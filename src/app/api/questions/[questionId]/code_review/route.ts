import { Sender, CodeReviewResult, UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AIReviewService } from "@/app/_serevices/AIReviewService";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
import { CodeEditorFile } from "@/app/q/[questionId]/_hooks/useCodeEditor";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

export type CodeReviewRequest = {
  files: CodeEditorFile[];
};

export const POST = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;
  try {
    const { id: userId } = await getCurrentUser({ request });
    const body = await request.json();
    const { files }: CodeReviewRequest = body;

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        reviewer: true,
        questionFiles: true,
      },
    });

    if (!question) throw new Error("質問が見つかりません");

    const res = await AIReviewService.getCodeReview({
      question,
      files,
      reviewer: question.reviewer,
    });

    if (!res) throw new Error("レビュー中にエラーが発生しました");

    const { result, score, overview, comments } = res;

    const status =
      result === CodeReviewResult.APPROVED
        ? UserQuestionStatus.PASSED
        : UserQuestionStatus.REVISION_REQUIRED;

    await prisma.$transaction(async (tx) => {
      const userQuestion = await tx.userQuestion.upsert({
        where: {
          userId_questionId: {
            userId: userId,
            questionId,
          },
        },
        update: {
          status,
        },
        create: {
          questionId,
          status,
          userId,
        },
      });

      const userMessage = await tx.message.create({
        data: {
          message: AIReviewService.buildPrompt({
            question: question,
            files,
          }),
          sender: Sender.USER,
          userQuestionId: userQuestion.id,
        },
      });

      await tx.answer.create({
        data: {
          userQuestionId: userQuestion.id,
          messageId: userMessage.id,
          answerFiles: {
            createMany: {
              data: files.map((file) => ({
                name: file.name,
                content: file.content,
                ext: file.ext,
              })),
            },
          },
        },
      });

      await tx.message.create({
        data: {
          message: "",
          sender: Sender.SYSTEM,
          userQuestionId: userQuestion.id,
          reviewerId: question.reviewer?.id,
          codeReview: {
            create: {
              userQuestionId: userQuestion.id,
              overview,
              result,
              score: parseInt(score, 10),
              comments: {
                createMany: {
                  data: comments.map(
                    ({ fileName, targetCode, message, level }) => ({
                      fileName,
                      targetCode,
                      message,
                      level,
                    })
                  ),
                },
              },
            },
          },
        },
      });
    });

    // const slack = new SlackService();
    // await slack.postMessage({
    //   channel: "js-gym通知",
    //   message: `コードレビューが完了しました\n\n[${question.lesson.name}] ${question.title}\n\n問題文:\n${question.content}\n\n回答内容:\n${answer}\n\n結果: ${result}\nコメント: ${overview}\n\nhttps://jsgym.shiftb.dev/q/${question.id}`,
    // });

    return NextResponse.json(
      {
        message: "success",
        result,
      },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
