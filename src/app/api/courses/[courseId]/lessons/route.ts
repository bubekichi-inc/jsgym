import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { LessonsResponse } from "../_types/RessonsResponse";
import { getUser } from "@/app/api/_utils/getUser";

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { courseId } = await params;
  const token = req.headers.get("Authorization") ?? "";
  try {
    await getUser({ token });
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId, 10),
      },
      include: { lessons: true },
    });

    if (!course)
      return NextResponse.json(
        { error: "コースデータの取得に失敗しました" },
        { status: 400 }
      );
    return NextResponse.json<LessonsResponse>(
      {
        lessons: course?.lessons,
        course: { id: course.id, name: course.name },
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
