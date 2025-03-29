import { QuestionTagValue } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

// レスポンスの型定義
export type QuestionTagsResponse = {
  tags: {
    id: number;
    name: QuestionTagValue;
    createdAt: string;
    updatedAt: string;
  }[];
};

// 作成リクエストの型定義
const createQuestionTagSchema = z.object({
  name: z.nativeEnum(QuestionTagValue),
});

export type CreateQuestionTagRequest = z.infer<typeof createQuestionTagSchema>;

// QuestionTagを全て取得するGETエンドポイント
export async function GET(request: NextRequest) {
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

    // QuestionTagの全件取得
    const tags = await prisma.questionTag.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json<QuestionTagsResponse>({
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("QuestionTagの取得に失敗しました:", error);
    return await buildError(error);
  }
}

// QuestionTagを新規作成するPOSTエンドポイント
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
    const validationResult = createQuestionTagSchema.safeParse(body);

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

    // 同じ名前のタグが既に存在するか確認
    const existingTag = await prisma.questionTag.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "同じ名前のタグが既に存在します" },
        { status: 409 }
      );
    }

    // QuestionTagの作成
    const newTag = await prisma.questionTag.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(
      {
        tag: {
          id: newTag.id,
          name: newTag.name,
          createdAt: newTag.createdAt.toISOString(),
          updatedAt: newTag.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("QuestionTagの作成に失敗しました:", error);
    return await buildError(error);
  }
}
