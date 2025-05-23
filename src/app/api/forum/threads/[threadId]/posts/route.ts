import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../_utils/getCurrentUser";
import { buildPrisma } from "../../../../_utils/buildPrisma";
import { buildError } from "../../../../_utils/buildError";
import { z } from "zod";

// パラメータの型定義
interface Params {
  params: {
    threadId: string;
  };
}

// レスポンス型の定義
export interface ForumPostsResponse {
  posts: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    parentId: string | null;
    user: {
      id: string;
      name: string | null;
      iconUrl: string | null;
    };
    reactions: {
      kind: string;
      count: number;
      reacted: boolean;
    }[];
    replies?: {
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string | null;
        iconUrl: string | null;
      };
    }[];
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 投稿作成リクエストの検証スキーマ
const createPostSchema = z.object({
  content: z.string().min(1, "投稿内容は必須です"),
  parentId: z.string().uuid("親投稿IDが不正です").optional(),
});

// 投稿作成リクエスト型の定義
export type CreatePostRequest = z.infer<typeof createPostSchema>;

// 投稿作成レスポンス型の定義
export interface CreatePostResponse {
  message: string;
  post: {
    id: string;
    content: string;
    createdAt: string;
    parentId: string | null;
  };
}

// スレッドの投稿一覧を取得するGETエンドポイント
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { threadId } = params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // ログインユーザー（リアクション情報取得のため）
    let currentUser = null;
    try {
      currentUser = await getCurrentUser({ request });
    } catch (e) {
      // ログインユーザーがいなくても続行
    }

    const prisma = await buildPrisma();

    // スレッドの存在確認
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "指定されたスレッドが見つかりません" },
        { status: 404 }
      );
    }

    // 投稿総数のカウント (親投稿のみ)
    const total = await prisma.forumPost.count({
      where: {
        threadId,
        parentId: null,
      },
    });

    // 投稿一覧の取得（親投稿のみ）
    const posts = await prisma.forumPost.findMany({
      where: {
        threadId,
        parentId: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
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

    // リアクション情報をカウントと自分がリアクションしたかの形式に変換
    const postsWithFormattedReactions = posts.map(post => {
      // リアクションの種類ごとに集計
      const reactionsByKind = post.reactions.reduce((acc, reaction) => {
        if (!acc[reaction.kind]) {
          acc[reaction.kind] = {
            count: 0,
            reacted: false,
          };
        }
        acc[reaction.kind].count += 1;
        
        // 自分のリアクションかチェック
        if (currentUser && reaction.user.id === currentUser.id) {
          acc[reaction.kind].reacted = true;
        }
        
        return acc;
      }, {} as Record<string, { count: number; reacted: boolean }>);

      // 配列形式に変換
      const formattedReactions = Object.entries(reactionsByKind).map(
        ([kind, { count, reacted }]) => ({
          kind,
          count,
          reacted,
        })
      );

      return {
        ...post,
        reactions: formattedReactions,
      };
    });

    // レスポンス形式に変換
    return NextResponse.json<ForumPostsResponse>({
      posts: postsWithFormattedReactions.map(post => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        parentId: post.parentId,
        user: post.user,
        reactions: post.reactions,
        replies: post.replies.map(reply => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.updatedAt.toISOString(),
          user: reply.user,
        })),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("投稿一覧の取得に失敗しました:", error);
    return await buildError(error);
  }
}

// 投稿を新規作成するPOSTエンドポイント
export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    // ログインユーザーの取得
    const user = await getCurrentUser({ request });
    const { threadId } = params;
    const prisma = await buildPrisma();

    // スレッドの存在確認とロック状態のチェック
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      select: {
        isLocked: true,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "指定されたスレッドが見つかりません" },
        { status: 404 }
      );
    }

    // ロックされたスレッドには管理者のみ投稿可能
    if (thread.isLocked && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "このスレッドはロックされているため投稿できません" },
        { status: 403 }
      );
    }

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = createPostSchema.safeParse(body);

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

    // 親投稿の存在確認（返信の場合）
    if (data.parentId) {
      const parentPost = await prisma.forumPost.findUnique({
        where: {
          id: data.parentId,
          threadId, // 同じスレッド内の投稿のみ許可
        },
      });

      if (!parentPost) {
        return NextResponse.json(
          { error: "指定された親投稿が見つからないか、このスレッドに属していません" },
          { status: 404 }
        );
      }

      // 返信の返信は許可しない（UX考慮）
      if (parentPost.parentId) {
        return NextResponse.json(
          { error: "返信に対する返信はできません" },
          { status: 400 }
        );
      }
    }

    // 投稿の作成
    const post = await prisma.forumPost.create({
      data: {
        threadId,
        userId: user.id,
        content: data.content,
        parentId: data.parentId,
      },
    });

    // スレッドの更新日時を更新
    await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json<CreatePostResponse>(
      {
        message: "投稿が正常に作成されました",
        post: {
          id: post.id,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
          parentId: post.parentId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("投稿の作成に失敗しました:", error);
    return await buildError(error);
  }
}