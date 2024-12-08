import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { courseId, lessonId } = await params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        course_id: parseInt(courseId, 10),
        id: parseInt(lessonId, 10),
      },
      include: { questions: true },
    });

    return NextResponse.json({ questions: lesson?.questions }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
