import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { QuestionResponse } from "../_types/QuestionResponse";
import { getUser } from "../../_utils/getUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  const { questionId } = await params;
  try {
    const { id: userId } = await getUser({ token });
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
        },
        answer,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Unauthorized") {
        return NextResponse.json({ error: e.message }, { status: 401 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
