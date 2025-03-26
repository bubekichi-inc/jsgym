import { Reviewer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

// レスポンスの型定義
export type ReviewerListResponse = {
  reviewers: Reviewer[];
};

// 新規作成・更新時のリクエストの型定義
export type ReviewerRequest = {
  name: string;
  bio: string;
  hiddenProfile: string;
  profileImageUrl?: string;
  userId?: string;
};

// リクエストのレスポンスの型定義
export type ReviewerResponse = {
  success: boolean;
  reviewer?: Reviewer;
  message?: string;
};

// GET: レビュワー一覧を取得
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 管理者権限チェック
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "権限がありません" },
        { status: 403 }
      );
    }

    const prisma = await buildPrisma();
    const reviewers = await prisma.reviewer.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ reviewers });
  } catch (error) {
    console.error("レビュワー一覧取得エラー:", error);
    return NextResponse.json(
      { message: "レビュワー一覧の取得に失敗しました", reviewers: [] },
      { status: 500 }
    );
  }
}

// POST: 新規レビュワーを作成
export async function POST(
  request: NextRequest
): Promise<NextResponse<ReviewerResponse>> {
  try {
    // 管理者権限チェック
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "権限がありません" },
        { status: 403 }
      );
    }

    const data: ReviewerRequest = await request.json();
    const { name, bio, hiddenProfile, profileImageUrl, userId } = data;

    // バリデーション
    if (!name || !bio || !hiddenProfile) {
      return NextResponse.json(
        { success: false, message: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    const prisma = await buildPrisma();

    // ユーザーIDが指定されている場合は、そのユーザーが既にレビュワーに紐付いていないか確認
    if (userId) {
      const existingReviewer = await prisma.reviewer.findFirst({
        where: { userId },
      });

      if (existingReviewer) {
        return NextResponse.json(
          {
            success: false,
            message:
              "指定されたユーザーは既に別のレビュワーとして登録されています",
          },
          { status: 400 }
        );
      }
    }

    // レビュワーを作成
    const reviewer = await prisma.reviewer.create({
      data: {
        name,
        bio,
        hiddenProfile,
        profileImageUrl: profileImageUrl || "",
        userId: userId || null,
      },
    });

    return NextResponse.json({
      success: true,
      reviewer,
    });
  } catch (error) {
    console.error("レビュワー作成エラー:", error);
    return NextResponse.json(
      { success: false, message: "レビュワーの作成に失敗しました" },
      { status: 500 }
    );
  }
}
