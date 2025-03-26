import { Reviewer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ReviewerRequest, ReviewerResponse } from "../route";
import { buildPrisma } from "@/app/_utils/prisma";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

// レスポンスの型定義
export type ReviewerDetailResponse = {
  reviewer: Reviewer;
  message?: string;
};

// GET: 特定のレビュワーを取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewerId: string }> }
): Promise<NextResponse> {
  try {
    const { reviewerId } = await params;

    // 管理者権限チェック
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "権限がありません", reviewer: null },
        { status: 403 }
      );
    }

    const prisma = await buildPrisma();
    const reviewer = await prisma.reviewer.findUnique({
      where: { id: parseInt(reviewerId) },
    });

    if (!reviewer) {
      return NextResponse.json(
        { message: "レビュワーが見つかりません", reviewer: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ reviewer });
  } catch (error) {
    console.error("レビュワー取得エラー:", error);
    return NextResponse.json(
      { message: "レビュワーの取得に失敗しました", reviewer: null },
      { status: 500 }
    );
  }
}

// PUT: レビュワー情報を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewerId: string }> }
): Promise<NextResponse<ReviewerResponse>> {
  try {
    const { reviewerId } = await params;

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

    // 対象のレビュワーが存在するか確認
    const existingReviewer = await prisma.reviewer.findUnique({
      where: { id: parseInt(reviewerId) },
    });

    if (!existingReviewer) {
      return NextResponse.json(
        { success: false, message: "レビュワーが見つかりません" },
        { status: 404 }
      );
    }

    // ユーザーIDが指定されている場合は、そのユーザーが既に別のレビュワーに紐付いていないか確認
    if (userId && userId !== existingReviewer.userId) {
      const otherReviewer = await prisma.reviewer.findFirst({
        where: {
          userId,
          id: { not: parseInt(reviewerId) },
        },
      });

      if (otherReviewer) {
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

    // レビュワー情報を更新
    const updatedReviewer = await prisma.reviewer.update({
      where: { id: parseInt(reviewerId) },
      data: {
        name,
        bio,
        hiddenProfile,
        profileImageUrl: profileImageUrl || existingReviewer.profileImageUrl,
        userId: userId || null,
      },
    });

    return NextResponse.json({
      success: true,
      reviewer: updatedReviewer,
    });
  } catch (error) {
    console.error("レビュワー更新エラー:", error);
    return NextResponse.json(
      { success: false, message: "レビュワーの更新に失敗しました" },
      { status: 500 }
    );
  }
}
