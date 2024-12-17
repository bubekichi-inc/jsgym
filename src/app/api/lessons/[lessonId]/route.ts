import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { QuestionsResponse } from "./_types/QuestionsResponse";

interface Props {
  params: Promise<{
    lessonId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { lessonId } = await params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: parseInt(lessonId, 10),
      },
      include: {
        questions: {
          orderBy: { id: "asc" },
        },
      },
    });

    if (!lesson)
      return NextResponse.json(
        { error: "lesson情報の取得に失敗しました" },
        { status: 404 }
      );

    return NextResponse.json<QuestionsResponse>(
      { questions: lesson.questions },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
