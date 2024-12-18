import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { QuestionsResponse } from "./_types/QuestionsResponse";
import { getUser } from "../../_utils/getUser";

interface Props {
  params: Promise<{
    lessonId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { lessonId } = await params;
  const token = req.headers.get("Authorization") ?? "";
  try {
    await getUser({ token });
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
      if (e.message === "Unauthorized") {
        return NextResponse.json({ error: e.message }, { status: 401 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
