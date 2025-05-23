import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "../../_utils/buildPrisma";
import { buildError } from "../../_utils/buildError";
import { z } from "zod";

// レスポンス型の定義
export interface ForumCategoriesResponse {
  categories: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    threadsCount: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

// カテゴリ作成リクエストの検証スキーマ
const createCategorySchema = z.object({
  slug: z.string().min(1, "スラッグは必須です").regex(/^[a-z0-9-]+$/, "スラッグには小文字英数字とハイフンのみ使用できます"),
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
});

// カテゴリ作成リクエスト型の定義
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;

// カテゴリ作成レスポンス型の定義
export interface CreateCategoryResponse {
  message: string;
  category: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// 全てのカテゴリを取得するGETエンドポイント
export async function GET(request: NextRequest) {
  try {
    const prisma = await buildPrisma();

    // カテゴリの取得とスレッド数のカウント
    const categoriesWithCounts = await prisma.forumCategory.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        _count: {
          select: {
            threads: true,
          },
        },
      },
    });

    // レスポンス形式に変換
    return NextResponse.json<ForumCategoriesResponse>({
      categories: categoriesWithCounts.map((category) => ({
        id: category.id,
        slug: category.slug,
        title: category.title,
        description: category.description,
        threadsCount: category._count.threads,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("フォーラムカテゴリの取得に失敗しました:", error);
    return await buildError(error);
  }
}

// カテゴリを新規作成するPOSTエンドポイント
export async function POST(request: NextRequest) {
  try {
    // 管理者権限の確認
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = createCategorySchema.safeParse(body);

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

    // スラッグが重複していないか確認
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "そのスラッグは既に使用されています" },
        { status: 400 }
      );
    }

    // カテゴリの作成
    const newCategory = await prisma.forumCategory.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json<CreateCategoryResponse>(
      {
        message: "カテゴリが正常に作成されました",
        category: {
          id: newCategory.id,
          slug: newCategory.slug,
          title: newCategory.title,
          description: newCategory.description,
          createdAt: newCategory.createdAt.toISOString(),
          updatedAt: newCategory.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("カテゴリの作成に失敗しました:", error);
    return await buildError(error);
  }
}