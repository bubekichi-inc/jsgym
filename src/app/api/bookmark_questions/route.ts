import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { Question } from "../questions/route";
import { buildPrisma } from "@/app/_utils/prisma";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();

  const { id: userId } = await getCurrentUser({ request });

  try {
    // ブックマークした問題を取得
    const bookmarkedQuestions = await prisma.question.findMany({
      where: {
        questionBookmarks: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        content: true,
        questions: {
          select: {
            tag: true,
          },
        },
        lesson: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            bio: true,
            profileImageUrl: true,
          },
        },
        userQuestions: {
          where: {
            userId,
          },
          select: {
            status: true,
          },
        },
        questionBookmarks: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json<{
      questions: Question[];
    }>(
      {
        questions: bookmarkedQuestions,
      },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
