import { NextRequest, NextResponse } from "next/server";
import { LessonsResponse } from "../_types/RessonsResponse";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}
export const GET = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { courseId } = await params;
  try {
    await getCurrentUser({ request });
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId, 10),
      },
      include: {
        lessons: {
          orderBy: {
            id: "asc",
          },
        },
      },
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
    return await buildError(e);
  }
};
