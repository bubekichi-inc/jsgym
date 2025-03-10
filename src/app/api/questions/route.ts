import { UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";

export const dynamic = "force-dynamic";

export type Question = {
  id: string;
  title: string;
  createdAt: Date;
  content: string;
  reviewer: {
    id: number;
    bio: string;
    name: string;
    profileImageUrl: string;
  };
  questions: {
    tag: {
      name: string;
    };
  }[];
  lesson: {
    id: number;
    name: string;
    course: {
      id: number;
      name: string;
    };
  };
  userQuestions: {
    status: UserQuestionStatus;
  }[];
};

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();

  // クエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || "24");
  const offset = Number(searchParams.get("offset") || "0");
  const searchTitle = searchParams.get("title") || "";
  const lessonId = Number(searchParams.get("lessonId") || "0");
  const reviewerId = Number(searchParams.get("reviewerId") || "0");
  const status = searchParams.get("status") as UserQuestionStatus | null;

  const token = request.headers.get("Authorization") ?? "";
  const { data } = await supabase.auth.getUser(token);
  const currentUser = data.user
    ? await prisma.user.findUnique({
        where: {
          supabaseUserId: data.user.id,
        },
      })
    : null;

  const userQuestionsQuery = currentUser
    ? {
        userQuestions: {
          where: {
            userId: currentUser.id,
          },
          select: {
            status: true,
          },
        },
      }
    : {};

  // フィルタリング条件を構築
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any = {};

  // タイトル検索
  if (searchTitle) {
    whereConditions.title = {
      contains: searchTitle,
    };
  }

  // レッスンIDによるフィルタリング
  if (lessonId > 0) {
    whereConditions.lessonId = lessonId;
  }

  // レビュワーIDによるフィルタリング
  if (reviewerId > 0) {
    whereConditions.reviewerId = reviewerId;
  }

  // ステータスによるフィルタリング
  if (status && currentUser) {
    whereConditions.userQuestions = {
      some: {
        userId: currentUser.id,
        status: status,
      },
    };
  }

  try {
    // 問題の総数を取得（ページネーション用）
    const totalCount = await prisma.question.count({
      where: whereConditions,
    });

    // 問題を取得
    const questions = await prisma.question.findMany({
      where: whereConditions,
      skip: offset,
      take: limit,
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
        ...userQuestionsQuery,
      },
    });

    // レスポンスにページネーション情報を追加
    return NextResponse.json<{
      questions: Question[];
      pagination: {
        total: number;
        offset: number;
        limit: number;
        hasMore: boolean;
      };
    }>(
      {
        questions,
        pagination: {
          total: totalCount,
          offset,
          limit,
          hasMore: offset + questions.length < totalCount,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
