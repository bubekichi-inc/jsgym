import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { courseId } = await params;
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId, 10),
      },
      include: { lessons: true },
    });

    return NextResponse.json({ lessons: course?.lessons }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
