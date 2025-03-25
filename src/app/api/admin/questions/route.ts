/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export interface AdminQuestionsResponse {
  questions: {
    id: string;
    title: string;
    content: string;
    level: string;
    type: string;
    reviewer: {
      name: string;
      id: number;
    };
    createdAt: string;
    updatedAt: string;
    bookmarkCount: number;
    userQuestionCount: number;
  }[];
  total: number;
}

// クエリパラメータの型定義
export interface AdminQuestionsQuery {
  page?: string;
  limit?: string;
  search?: string;
  level?: string;
  type?: string;
  reviewerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 問題ファイルのスキーマ定義
const questionFileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  ext: z.enum(["JS", "TS", "CSS", "HTML", "JSX", "TSX", "JSON"]),
  exampleAnswer: z.string(),
  template: z.string(),
  isRoot: z.boolean().default(false),
});

// 問題作成リクエストのスキーマ定義
const createQuestionSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  inputCode: z.string(),
  outputCode: z.string(),
  level: z.enum(["BASIC", "ADVANCED", "REAL_WORLD"]),
  type: z.enum(["JAVA_SCRIPT", "TYPE_SCRIPT", "REACT_JS", "REACT_TS"]),
  reviewerId: z.number().int().positive(),
  questionFiles: z.array(questionFileSchema).min(1),
  tagIds: z.array(z.number().int().positive()),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser({ request });

    // 管理者権限チェック
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query: AdminQuestionsQuery = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "10",
      search: searchParams.get("search") ?? "",
      level: searchParams.get("level") ?? "",
      type: searchParams.get("type") ?? "",
      reviewerId: searchParams.get("reviewerId") ?? "",
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    };

    const prisma = await buildPrisma();

    // 検索条件を構築
    const where: Prisma.QuestionWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.level) {
      where.level = query.level as any;
    }

    if (query.type) {
      where.type = query.type as any;
    }

    if (query.reviewerId) {
      where.reviewerId = parseInt(query.reviewerId);
    }

    // ページネーション用のパラメータ
    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "10");
    const skip = (page - 1) * limit;

    // 並び替え条件
    const orderBy: any = {};
    orderBy[query.sortBy ?? "createdAt"] = query.sortOrder ?? "desc";

    // 総件数を取得
    const total = await prisma.question.count({ where });

    // 問題一覧を取得
    const questions = await prisma.question.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        level: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
        questionBookmarks: {
          select: {
            id: true,
          },
        },
        userQuestions: {
          select: {
            id: true,
          },
        },
      },
    });

    // レスポンス形式に整形
    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      title: question.title,
      content: question.content,
      level: question.level,
      type: question.type,
      reviewer: question.reviewer,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
      bookmarkCount: question.questionBookmarks.length,
      userQuestionCount: question.userQuestions.length,
    }));

    return NextResponse.json({
      questions: formattedQuestions,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "問題一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 問題を新規作成するPOSTエンドポイント
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
    const validationResult = createQuestionSchema.safeParse(body);

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

    // トランザクションを使用して問題と関連データを作成
    const newQuestion = await prisma.$transaction(async (tx) => {
      // 1. 問題本体の作成
      const question = await tx.question.create({
        data: {
          id: nanoid(10),
          title: data.title,
          content: data.content,
          inputCode: data.inputCode,
          outputCode: data.outputCode,
          level: data.level,
          type: data.type,
          reviewerId: data.reviewerId,
        },
      });

      // 2. タグリレーションの作成
      if (data.tagIds.length > 0) {
        await tx.questionTagRelation.createMany({
          data: data.tagIds.map((tagId) => ({
            questionId: question.id,
            tagId,
          })),
        });
      }

      // 3. 問題ファイルの作成
      await tx.questionFile.createMany({
        data: data.questionFiles.map((file) => ({
          questionId: question.id,
          name: file.name,
          ext: file.ext,
          exampleAnswer: file.exampleAnswer,
          template: file.template,
          isRoot: file.isRoot,
        })),
      });

      return question;
    });

    return NextResponse.json({
      message: "問題が正常に作成されました",
      questionId: newQuestion.id,
    });
  } catch (error) {
    console.error("問題の作成に失敗しました:", error);
    return NextResponse.json(
      { error: "問題の作成に失敗しました" },
      { status: 500 }
    );
  }
}
