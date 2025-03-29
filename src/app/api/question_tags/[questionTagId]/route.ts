import { QuestionTagValue } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

// レスポンスの型定義
export type QuestionTagResponse = {
  tag: {
    id: number;
    name: QuestionTagValue;
    createdAt: string;
    updatedAt: string;
  };
};

// 更新リクエストの型定義
const updateQuestionTagSchema = z.object({
  name: z.nativeEnum(QuestionTagValue),
});

export type UpdateQuestionTagRequest = z.infer<typeof updateQuestionTagSchema>;

// パラメータのインターフェース
interface Props {
  params: Promise<{
    questionTagId: string;
  }>;
}

// QuestionTagを取得するGETエンドポイント
export async function GET(request: NextRequest, { params }: Props) {
  try {
    // 管理者権限の確認
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const prisma = await buildPrisma();
    const questionTagId = parseInt((await params).questionTagId, 10);

    if (isNaN(questionTagId)) {
      return NextResponse.json({ error: "無効なタグIDです" }, { status: 400 });
    }

    // QuestionTagの取得
    const tag = await prisma.questionTag.findUnique({
      where: { id: questionTagId },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "タグが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json<QuestionTagResponse>({
      tag: {
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("QuestionTagの取得に失敗しました:", error);
    return await buildError(error);
  }
}

// QuestionTagを更新するPUTエンドポイント
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    // 管理者権限の確認
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const questionTagId = parseInt((await params).questionTagId, 10);

    if (isNaN(questionTagId)) {
      return NextResponse.json({ error: "無効なタグIDです" }, { status: 400 });
    }

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = updateQuestionTagSchema.safeParse(body);

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

    // タグが存在するか確認
    const existingTag = await prisma.questionTag.findUnique({
      where: { id: questionTagId },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: "タグが見つかりません" },
        { status: 404 }
      );
    }

    // 同じ名前の別のタグが既に存在するか確認
    const duplicateTag = await prisma.questionTag.findFirst({
      where: {
        name: data.name,
        id: { not: questionTagId },
      },
    });

    if (duplicateTag) {
      return NextResponse.json(
        { error: "同じ名前のタグが既に存在します" },
        { status: 409 }
      );
    }

    // QuestionTagの更新
    const updatedTag = await prisma.questionTag.update({
      where: { id: questionTagId },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json<QuestionTagResponse>({
      tag: {
        id: updatedTag.id,
        name: updatedTag.name,
        createdAt: updatedTag.createdAt.toISOString(),
        updatedAt: updatedTag.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("QuestionTagの更新に失敗しました:", error);
    return await buildError(error);
  }
}

// QuestionTagを削除するDELETEエンドポイント
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // 管理者権限の確認
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const questionTagId = parseInt((await params).questionTagId, 10);

    if (isNaN(questionTagId)) {
      return NextResponse.json({ error: "無効なタグIDです" }, { status: 400 });
    }

    const prisma = await buildPrisma();

    // タグが存在するか確認
    const existingTag = await prisma.questionTag.findUnique({
      where: { id: questionTagId },
      include: {
        questions: true,
      },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: "タグが見つかりません" },
        { status: 404 }
      );
    }

    // このタグが使用されている問題があるか確認
    if (existingTag.questions.length > 0) {
      return NextResponse.json(
        { error: "このタグは問題に使用されているため削除できません" },
        { status: 400 }
      );
    }

    // QuestionTagの削除
    await prisma.questionTag.delete({
      where: { id: questionTagId },
    });

    return NextResponse.json({
      message: "タグが正常に削除されました",
    });
  } catch (error) {
    console.error("QuestionTagの削除に失敗しました:", error);
    return await buildError(error);
  }
}
