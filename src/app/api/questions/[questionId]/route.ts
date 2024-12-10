import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
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
    const questions = await prisma.lesson.findUnique({
      where: {
        id: question?.lesson_id,
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(
      {
        course: question?.lesson.course,
        lesson: { id: question?.lesson.id, name: question?.lesson.name },
        question: { id: question?.id, content: question?.content },
        questions: questions?.questions,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
