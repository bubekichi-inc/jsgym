import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../_utils/getCurrentUser";
import { buildPrisma } from "../../../_utils/buildPrisma";
import { buildError } from "../../../_utils/buildError";
import { z } from "zod";

// パラメータの型定義
interface Params {
  params: {
    threadId: string;
  };
}

// レスポンス型の定義
export interface ForumThreadResponse {
  thread: {
    id: string;
    title: string;
    views: number;
    isLocked: boolean;
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
  };
}

// スレッド更新リクエストの検証スキーマ
const updateThreadSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内で入力してください"),
  isLocked: z.boolean().optional(),
});

// スレッド更新リクエスト型の定義
export type UpdateThreadRequest = z.infer<typeof updateThreadSchema>;

// スレッド更新レスポンス型の定義
export interface UpdateThreadResponse {
  message: string;
  thread: {
    id: string;
    title: string;
    isLocked: boolean;
    updatedAt: string;
  };
}

// 特定のスレッドを取得するGETエンドポイント
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { threadId } = params;
    const prisma = await buildPrisma();

    // スレッドの存在確認
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
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
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "指定されたスレッドが見つかりません" },
        { status: 404 }
      );
    }

    // 閲覧数をインクリメント
    await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        views: { increment: 1 },
      },
    });

    // レスポンス形式に変換
    return NextResponse.json<ForumThreadResponse>({
      thread: {
        id: thread.id,
        title: thread.title,
        views: thread.views + 1, // APIレスポンスでは既に更新された値を返す
        isLocked: thread.isLocked,
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
        category: thread.category,
        user: thread.user,
      },
    });
  } catch (error) {
    console.error("スレッドの取得に失敗しました:", error);
    return await buildError(error);
  }
}

// スレッドを更新するPUTエンドポイント
export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    // ログインユーザーの取得
    const user = await getCurrentUser({ request });
    const { threadId } = params;
    const prisma = await buildPrisma();

    // スレッドの存在確認と所有権確認
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      select: {
        userId: true,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "指定されたスレッドが見つかりません" },
        { status: 404 }
      );
    }

    // 管理者または作成者のみ更新可能
    if (thread.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "このスレッドを更新する権限がありません" },
        { status: 403 }
      );
    }

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = updateThreadSchema.safeParse(body);

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

    // スレッドの更新
    const updatedThread = await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        title: data.title,
        // 管理者のみロック状態を変更可能
        ...(user.role === "ADMIN" && data.isLocked !== undefined
          ? { isLocked: data.isLocked }
          : {}),
      },
    });

    return NextResponse.json<UpdateThreadResponse>({
      message: "スレッドが正常に更新されました",
      thread: {
        id: updatedThread.id,
        title: updatedThread.title,
        isLocked: updatedThread.isLocked,
        updatedAt: updatedThread.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("スレッドの更新に失敗しました:", error);
    return await buildError(error);
  }
}

// スレッドを削除するDELETEエンドポイント
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    // ログインユーザーの取得
    const user = await getCurrentUser({ request });
    const { threadId } = params;
    const prisma = await buildPrisma();

    // スレッドの存在確認と所有権確認
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      select: {
        userId: true,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "指定されたスレッドが見つかりません" },
        { status: 404 }
      );
    }

    // 管理者または作成者のみ削除可能
    if (thread.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "このスレッドを削除する権限がありません" },
        { status: 403 }
      );
    }

    // スレッドの削除（関連する投稿は外部キー制約によって削除される）
    await prisma.forumThread.delete({
      where: { id: threadId },
    });

    return NextResponse.json({
      message: "スレッドが正常に削除されました",
    });
  } catch (error) {
    console.error("スレッドの削除に失敗しました:", error);
    return await buildError(error);
  }
}