import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../_utils/getCurrentUser";
import { buildPrisma } from "../../../../_utils/buildPrisma";
import { buildError } from "../../../../_utils/buildError";
import { z } from "zod";
import { ReactionKind } from "@prisma/client";

// パラメータの型定義
interface Params {
  params: {
    postId: string;
  };
}

// リアクション追加リクエストの検証スキーマ
const addReactionSchema = z.object({
  kind: z.enum(["LIKE", "LOVE", "LAUGH", "THINK"] as const, {
    errorMap: () => ({ message: "無効なリアクション種別です" }),
  }),
});

// リアクション追加リクエスト型の定義
export type AddReactionRequest = z.infer<typeof addReactionSchema>;

// リアクション追加レスポンス型の定義
export interface AddReactionResponse {
  message: string;
  reaction: {
    id: string;
    kind: string;
    createdAt: string;
  };
}

// リアクション削除リクエストの検証スキーマ
const removeReactionSchema = z.object({
  kind: z.enum(["LIKE", "LOVE", "LAUGH", "THINK"] as const, {
    errorMap: () => ({ message: "無効なリアクション種別です" }),
  }),
});

// リアクション削除リクエスト型の定義
export type RemoveReactionRequest = z.infer<typeof removeReactionSchema>;

// リアクションを追加するPOSTエンドポイント
export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    // ログインユーザーの取得
    const user = await getCurrentUser({ request });
    const { postId } = params;
    const prisma = await buildPrisma();

    // 投稿の存在確認
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        thread: {
          select: {
            isLocked: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "指定された投稿が見つかりません" },
        { status: 404 }
      );
    }

    // ロックされたスレッドにはリアクションできないようにする
    if (post.thread.isLocked && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "このスレッドはロックされているためリアクションできません" },
        { status: 403 }
      );
    }

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = addReactionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "無効なリクエストデータです",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { kind } = validationResult.data;

    // 既存のリアクションをチェック
    const existingReaction = await prisma.forumReaction.findUnique({
      where: {
        postId_userId_kind: {
          postId,
          userId: user.id,
          kind,
        },
      },
    });

    if (existingReaction) {
      return NextResponse.json(
        { error: "既に同じリアクションが追加されています" },
        { status: 400 }
      );
    }

    // リアクションの作成
    const reaction = await prisma.forumReaction.create({
      data: {
        postId,
        userId: user.id,
        kind,
      },
    });

    return NextResponse.json<AddReactionResponse>(
      {
        message: "リアクションが正常に追加されました",
        reaction: {
          id: reaction.id,
          kind: reaction.kind,
          createdAt: reaction.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("リアクションの追加に失敗しました:", error);
    return await buildError(error);
  }
}

// リアクションを削除するDELETEエンドポイント
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    // ログインユーザーの取得
    const user = await getCurrentUser({ request });
    const { postId } = params;
    const searchParams = request.nextUrl.searchParams;
    const kind = searchParams.get("kind") as ReactionKind;
    const prisma = await buildPrisma();

    // kindパラメータのバリデーション
    const validationResult = removeReactionSchema.safeParse({ kind });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "無効なリアクション種別です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // 投稿の存在確認
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "指定された投稿が見つかりません" },
        { status: 404 }
      );
    }

    // リアクションの削除（自分のリアクションのみ）
    const deletedReaction = await prisma.forumReaction.deleteMany({
      where: {
        postId,
        userId: user.id,
        kind,
      },
    });

    if (deletedReaction.count === 0) {
      return NextResponse.json(
        { error: "指定されたリアクションが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "リアクションが正常に削除されました",
    });
  } catch (error) {
    console.error("リアクションの削除に失敗しました:", error);
    return await buildError(error);
  }
}