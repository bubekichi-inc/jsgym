import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export interface AdminUsersResponse {
  users: {
    id: string;
    email: string | null;
    name: string | null;
    iconUrl: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    userQuestionCount: number;
  }[];
  total: number;
}

// クエリパラメータの型定義
export interface AdminUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
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
    const query: AdminUsersQuery = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "25",
      search: searchParams.get("search") ?? "",
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    };

    const prisma = await buildPrisma();

    // 検索条件を構築
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // ページネーション用のパラメータ
    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "25");
    const skip = (page - 1) * limit;

    // 並び替え条件
    let orderBy: Prisma.UserOrderByWithRelationInput = {};

    // ソート条件を適切に設定
    if (query.sortBy === "createdAt") {
      orderBy = { createdAt: query.sortOrder ?? "desc" };
    } else if (query.sortBy === "updatedAt") {
      orderBy = { updatedAt: query.sortOrder ?? "desc" };
    } else if (query.sortBy === "name") {
      orderBy = { name: query.sortOrder ?? "desc" };
    } else if (query.sortBy === "email") {
      orderBy = { email: query.sortOrder ?? "desc" };
    } else if (query.sortBy === "points") {
      orderBy = { points: query.sortOrder ?? "desc" };
    } else {
      // デフォルトは作成日時
      orderBy = { createdAt: query.sortOrder ?? "desc" };
    }

    // 総件数を取得
    const total = await prisma.user.count({ where });

    // ユーザー一覧を取得
    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        iconUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userQuestions: {
          select: {
            id: true,
          },
        },
      },
    });

    // レスポンス形式に整形
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      iconUrl: user.iconUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      userQuestionCount: user.userQuestions.length,
    }));

    return NextResponse.json({
      users: formattedUsers,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ユーザー一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
