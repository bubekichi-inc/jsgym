import { UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    lessonId: string;
  }>;
}

export type Question = {
  id: string;
  title: string;
  content: string;
  userQuestions: {
    id: string;
    status: UserQuestionStatus;
  }[];
};

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
          select: {
            id: true,
            title: true,
            content: true,
            userQuestions: {
              where: { userId: user.id },
              select: {
                id: true,
                status: true,
              },
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

    return NextResponse.json<{ questions: Question[] }>(
      { questions: lesson.questions },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
