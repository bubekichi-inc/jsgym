import { Sender, CodeReviewResult, UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CodeReviewRequest } from "./_types/CodeReview";
import { AIReviewService } from "@/app/_serevices/AIReviewService";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

const prisma = await buildPrisma();

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const POST = async (request: NextRequest, { params }: Props) => {
  const { questionId } = await params;
  try {
    const { id: userId } = await getCurrentUser({ request });
    const body = await request.json();
    const { answer }: CodeReviewRequest = body;

    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId, 10),
      },
      include: {
        lesson: true,
      },
    });

    if (!question) throw new Error("質問が見つかりません");

    const res = await AIReviewService.getCodeReview({
      question,
      answer,
    });

    if (!res) throw new Error("レビュー中にエラーが発生しました");

    const { result, overview, comments } = res;

    const status =
      result === CodeReviewResult.APPROVED
        ? UserQuestionStatus.PASSED
        : UserQuestionStatus.REVISION_REQUIRED;

    const userQuestionData = await prisma.userQuestion.upsert({
      where: {
        userId_questionId: {
          userId: userId,
          questionId: parseInt(questionId, 10),
        },
      },
      update: {
        status,
      },
      create: {
        questionId: parseInt(questionId, 10),
        status,
        userId,
      },
    });

    const userMessage = await prisma.message.create({
      data: {
        message: AIReviewService.buildPrompt({
          question: question,
          answer,
        }),
        sender: Sender.USER,
        userQuestionId: userQuestionData.id,
      },
    });

    await prisma.answer.create({
      data: {
        userQuestionId: userQuestionData.id,
        messageId: userMessage.id,
        answer,
      },
    });

    await prisma.message.create({
      data: {
        message: "",
        sender: Sender.SYSTEM,
        userQuestionId: userQuestionData.id,
        codeReview: {
          create: {
            userQuestionId: userQuestionData.id,
            overview,
            result,
            comments: {
              createMany: {
                data: comments.map(({ targetCode, message, level }) => ({
                  targetCode,
                  message,
                  level,
                })),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "success",
        result,
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
