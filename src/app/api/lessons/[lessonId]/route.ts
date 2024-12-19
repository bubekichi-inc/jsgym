import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { QuestionsResponse } from "./_types/QuestionsResponse";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildError } from "../../_utils/buildError";

interface Props {
  params: Promise<{
    lessonId: string;
  }>;
}
export const GET = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { lessonId } = await params;
  try {
    const user = await getCurrentUser({ request });
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: parseInt(lessonId, 10),
      },
      include: {
        questions: {
          orderBy: { id: "asc" },
          include: {
            answers: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!lesson)
      return NextResponse.json(
        { error: "lesson情報の取得に失敗しました" },
        { status: 404 }
      );
    const questionsWithStatus = lesson.questions.map(question => ({
      ...question,
      status: question.answers[0]?.status || null,
    }));

    return NextResponse.json<QuestionsResponse>(
      { questions: questionsWithStatus },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
