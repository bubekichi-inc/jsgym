import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "../../_utils/buildPrisma";
import { buildError } from "../../_utils/buildError";
import { z } from "zod";

// クエリパラメータの型定義
export interface ThreadsQuery {
  categorySlug?: string;
  page?: string;
  limit?: string;
}

// レスポンス型の定義
export interface ForumThreadsResponse {
  threads: {
    id: string;
    title: string;
    views: number;
    isLocked: boolean;
    postsCount: number;
    createdAt: string;
    updatedAt: string;
    category: {
      id: string;
      slug: string;
      title: string;
    };
    user: {
      id: string;
      name: string | null;
      iconUrl: string | null;
    };
    latestPost?: {
      id: string;
      createdAt: string;
      user: {
        id: string;
        name: string | null;
        iconUrl: string | null;
      };
    } | null;
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// スレッド作成リクエストの検証スキーマ
const createThreadSchema = z.object({
  categoryId: z.string().uuid("カテゴリIDが不正です"),
  title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内で入力してください"),
  content: z.string().min(1, "投稿内容は必須です"),
});

// スレッド作成リクエスト型の定義
export type CreateThreadRequest = z.infer<typeof createThreadSchema>;

// スレッド作成レスポンス型の定義
export interface CreateThreadResponse {
  message: string;
  thread: {
    id: string;
    title: string;
    createdAt: string;
  };
}

// スレッド一覧を取得するGETエンドポイント
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("categorySlug") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const prisma = await buildPrisma();

    // 検索条件を構築
    let whereCondition: any = {};
    
    if (categorySlug) {
      const category = await prisma.forumCategory.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });
      
      if (!category) {
        return NextResponse.json(
          { error: "指定されたカテゴリが見つかりません" },
          { status: 404 }
        );
      }
      
      whereCondition.categoryId = category.id;
    }

    // スレッド総数のカウント
    const total = await prisma.forumThread.count({
      where: whereCondition,
    });

    // スレッド一覧の取得
    const threads = await prisma.forumThread.findMany({
      where: whereCondition,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                iconUrl: true,
              },
            },
          },
        },
      },
    });

    // レスポンス形式に変換
    return NextResponse.json<ForumThreadsResponse>({
      threads: threads.map((thread) => ({
        id: thread.id,
        title: thread.title,
        views: thread.views,
        isLocked: thread.isLocked,
        postsCount: thread._count.posts,
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
        category: thread.category,
        user: thread.user,
        latestPost: thread.posts[0] ? {
          id: thread.posts[0].id,
          createdAt: thread.posts[0].createdAt.toISOString(),
          user: thread.posts[0].user,
        } : null,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("スレッド一覧の取得に失敗しました:", error);
    return await buildError(error);
  }
}

// スレッドを新規作成するPOSTエンドポイント
export async function POST(request: NextRequest) {
  try {
    // ログインユーザーの取得
    const user = await getCurrentUser({ request });

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = createThreadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "無効なリクエストデータです",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const prisma = await buildPrisma();

    // カテゴリの存在確認
    const category = await prisma.forumCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "指定されたカテゴリが見つかりません" },
        { status: 404 }
      );
    }

    // トランザクションを使用してスレッドと初期投稿を作成
    const result = await prisma.$transaction(async (tx) => {
      // スレッドの作成
      const thread = await tx.forumThread.create({
        data: {
          categoryId: data.categoryId,
          userId: user.id,
          title: data.title,
        },
      });

      // 初期投稿の作成
      await tx.forumPost.create({
        data: {
          threadId: thread.id,
          userId: user.id,
          content: data.content,
        },
      });

      return thread;
    });

    return NextResponse.json<CreateThreadResponse>(
      {
        message: "スレッドが正常に作成されました",
        thread: {
          id: result.id,
          title: result.title,
          createdAt: result.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("スレッドの作成に失敗しました:", error);
    return await buildError(error);
  }
}