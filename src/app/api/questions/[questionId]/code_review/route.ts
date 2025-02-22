import {
  Sender,
  AnswerStatus,
  CodeReviewResult,
  MessageType,
} from "@prisma/client";
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
    const { question, answer }: CodeReviewRequest = body;

    const res = await AIReviewService.getCodeReview({
      question,
      answer,
    });

    if (!res) throw new Error("レビュー中にエラーが発生しました");

    const { result, overview, comments } = res;

    const status =
      result === CodeReviewResult.APPROVED
        ? AnswerStatus.PASSED
        : AnswerStatus.REVISION_REQUIRED;

    const answerResponse = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: userId,
          questionId: parseInt(questionId, 10),
        },
      },
    });

    if (answerResponse) {
      await prisma.answer.delete({
        where: {
          id: answerResponse.id,
        },
      });
    }

    const answerData = await prisma.answer.create({
      data: {
        questionId: parseInt(questionId, 10),
        answer,
        status,
        userId,
      },
    });

    const userMessage = AIReviewService.buildPrompt({ question, answer });
    await prisma.message.create({
      data: {
        message: userMessage,
        sender: Sender.USER,
        answerId: answerData.id,
        type: MessageType.SUBMISSION,
      },
    });

    //メッセージにも登録(履歴送るときに備えて、回答なども含める)
    //同時に回答履歴登録
    await Promise.all([
      prisma.message.create({
        data: {
          message: "",
          sender: Sender.SYSTEM,
          answerId: answerData.id,
          type: MessageType.REVIEW,
          codeReview: {
            create: {
              overview,
              result,
              comments: {
                createMany: {
                  data: comments.map(({ code, message }) => ({
                    code,
                    message,
                  })),
                },
              },
            },
          },
        },
      }),
      prisma.answerHistory.create({
        data: {
          userId: userId,
          questionId: parseInt(questionId, 10),
          answer,
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
