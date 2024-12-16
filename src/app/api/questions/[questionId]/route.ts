import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  //プロトタイプ用のtestアカウントID
  const userId = "aa47a833-3bd9-4ad3-92f5-dcea9f9fab7e";
  const { questionId } = await params;
  try {
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

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: question.lessonId,
      },
      include: {
        questions: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
    if (!lesson)
      return NextResponse.json(
        { error: "問題が見つかりません。" },
        { status: 404 }
      );

    const answer = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: userId,
          questionId: parseInt(questionId, 10),
        },
      },
    });

    return NextResponse.json(
      {
        course: question.lesson.course,
        lesson: { id: question.lesson.id, name: question.lesson.name },
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
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
