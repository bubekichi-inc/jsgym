import { Sender, AnswerStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CodeReviewRequest, CodeReviewResponse } from "./_types/CodeReview";
import { AIReviewService } from "@/app/_serevices/AIReviewService";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const POST = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;
  try {
    const { id: userId } = await getCurrentUser({ request });
    const body = await request.json();
    const { question, answer }: CodeReviewRequest = body;

    const res = await AIReviewService.getCodeReview({
      question,
      answer,
    });

    if (!res) throw new Error("AIレビューに失敗しました");

    const { isCorrect, overview, goodPoints, badPoints, improvedCode } = res;

    const status = isCorrect
      ? AnswerStatus.PASSED
      : AnswerStatus.REVISION_REQUIRED;

    //ステータスを更新する
    const answerResponse = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: userId,
          questionId: parseInt(questionId, 10),
        },
      },
    });

    //回答が既にあったら削除
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
      },
    });
    const systemMessage = AIReviewService.buildSystemMessage({
      overview,
      goodPoints,
      badPoints,
      improvedCode,
    });

    //メッセージにも登録(履歴送るときに備えて、回答なども含める)
    //同時に回答履歴登録
    await Promise.all([
      prisma.message.create({
        data: {
          message: systemMessage,
          sender: Sender.SYSTEM,
          answerId: answerData.id,
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

    return NextResponse.json<CodeReviewResponse>(
      {
        isCorrect,
        overview,
        goodPoints,
        badPoints,
        improvedCode,
        messages: [
          {
            message: systemMessage,
            sender: Sender.SYSTEM,
            answerId: answerData.id,
          },
        ],
        answerId: answerData.id,
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
