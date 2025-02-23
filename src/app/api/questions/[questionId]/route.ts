import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { QuestionResponse } from "../_types/QuestionResponse";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

const prisma = await buildPrisma();

export const GET = async (request: NextRequest, { params }: Props) => {
  const { questionId } = await params;
  try {
    const { id: userId } = await getCurrentUser({ request });
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId, 10),
      },
      include: {
        lesson: {
          include: { course: true },
        },
      },
    });
    if (!question)
      return NextResponse.json(
        { error: "問題が見つかりません。" },
        { status: 404 }
      );

    const answer = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: parseInt(questionId, 10),
        },
      },
    });

    return NextResponse.json<QuestionResponse>(
      {
        course: question.lesson.course,
        question: {
          id: question.id,
          title: question.title,
          content: question.content,
          example: question.example,
          template: question.template,
        },
        answer,
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
