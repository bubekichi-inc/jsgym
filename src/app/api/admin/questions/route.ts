/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export interface AdminQuestionsResponse {
  questions: {
    id: string;
    title: string;
    content: string;
    level: string;
    type: string;
    reviewer: {
      name: string;
      id: number;
    };
    createdAt: string;
    updatedAt: string;
    bookmarkCount: number;
    userQuestionCount: number;
  }[];
  total: number;
}

// クエリパラメータの型定義
export interface AdminQuestionsQuery {
  page?: string;
  limit?: string;
  search?: string;
  level?: string;
  type?: string;
  reviewerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser({ request });

    // 管理者権限チェック
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query: AdminQuestionsQuery = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "10",
      search: searchParams.get("search") ?? "",
      level: searchParams.get("level") ?? "",
      type: searchParams.get("type") ?? "",
      reviewerId: searchParams.get("reviewerId") ?? "",
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    };

    const prisma = await buildPrisma();

    // 検索条件を構築
    const where: Prisma.QuestionWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.level) {
      where.level = query.level as any;
    }

    if (query.type) {
      where.type = query.type as any;
    }

    if (query.reviewerId) {
      where.reviewerId = parseInt(query.reviewerId);
    }

    // ページネーション用のパラメータ
    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "10");
    const skip = (page - 1) * limit;

    // 並び替え条件
    const orderBy: any = {};
    orderBy[query.sortBy ?? "createdAt"] = query.sortOrder ?? "desc";

    // 総件数を取得
    const total = await prisma.question.count({ where });

    // 問題一覧を取得
    const questions = await prisma.question.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        level: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
        questionBookmarks: {
          select: {
            id: true,
          },
        },
        userQuestions: {
          select: {
            id: true,
          },
        },
      },
    });

    // レスポンス形式に整形
    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      title: question.title,
      content: question.content,
      level: question.level,
      type: question.type,
      reviewer: question.reviewer,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
      bookmarkCount: question.questionBookmarks.length,
      userQuestionCount: question.userQuestions.length,
    }));

    return NextResponse.json({
      questions: formattedQuestions,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "問題一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
