import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) => {
  const prisma = await buildPrisma();
  const { courseId, lessonId } = params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: parseInt(lessonId, 10),
      },
      include: { questions: true },
    });

    // レッスンが存在しない、またはコースIDが一致しない場合のチェック
    if (!lesson || lesson.course_id !== parseInt(courseId, 10)) {
      return NextResponse.json(
        { error: "Lesson not found or mismatched course" },
        { status: 404 }
      );
    }
    return NextResponse.json({ questions: lesson.questions }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
