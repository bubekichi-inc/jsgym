import { NextRequest } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  const prisma = await buildPrisma();
  const { courseId } = params;
  try {
    const questions = await prisma.lesson.findMany({
      where: {
        courseId: parseInt(courseId, 10),
      },
    });
    return Response.json({ questions }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  }
};
