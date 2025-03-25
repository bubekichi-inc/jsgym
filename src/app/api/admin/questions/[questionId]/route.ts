import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildPrisma } from "@/app/_utils/prisma";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

// 問題ファイルのスキーマ定義
const questionFileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  ext: z.enum(["JS", "TS", "CSS", "HTML", "JSX", "TSX", "JSON"]),
  exampleAnswer: z.string(),
  template: z.string(),
  isRoot: z.boolean().default(false),
});

// 問題更新リクエストのスキーマ定義
const updateQuestionSchema = z.object({
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

// APIレスポンスの型
export type AdminQuestionResponse = {
  question: {
    id: string;
    title: string;
    content: string;
    inputCode: string;
    outputCode: string;
    level: "BASIC" | "ADVANCED" | "REAL_WORLD";
    type: "JAVA_SCRIPT" | "TYPE_SCRIPT" | "REACT_JS" | "REACT_TS";
    reviewerId: number;
  };
  questionFiles: {
    id: string;
    questionId: string;
    name: string;
    ext: "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";
    exampleAnswer: string;
    template: string;
    isRoot: boolean;
  }[];
  tags: {
    id: string;
    tagId: number;
    name: string;
  }[];
};

export type UpdateQuestionRequest = z.infer<typeof updateQuestionSchema>;

// 問題データを取得するGETエンドポイント
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
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
    const questionId = (await params).questionId;

    // 問題データの取得
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        questionFiles: true,
        questions: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "問題が見つかりません" },
        { status: 404 }
      );
    }

    // レスポンスデータの整形
    const response: AdminQuestionResponse = {
      question: {
        id: question.id,
        title: question.title,
        content: question.content,
        inputCode: question.inputCode,
        outputCode: question.outputCode,
        level: question.level,
        type: question.type,
        reviewerId: question.reviewerId,
      },
      questionFiles: question.questionFiles.map((file) => ({
        id: file.id,
        questionId: file.questionId,
        name: file.name,
        ext: file.ext,
        exampleAnswer: file.exampleAnswer,
        template: file.template,
        isRoot: file.isRoot,
      })),
      tags: question.questions.map((relation) => ({
        id: relation.id,
        tagId: relation.tagId,
        name: relation.tag.name,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("問題データの取得に失敗しました:", error);
    return NextResponse.json(
      { error: "問題データの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 問題を更新するPUTエンドポイント
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
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
    const questionId = (await params).questionId;

    // リクエストデータの検証
    const body = await request.json();
    const validationResult = updateQuestionSchema.safeParse(body);

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

    // トランザクションを使用して問題と関連データを更新
    const updatedQuestion = await prisma.$transaction(async (tx) => {
      // 1. 問題本体の更新
      const question = await tx.question.update({
        where: { id: questionId },
        data: {
          title: data.title,
          content: data.content,
          inputCode: data.inputCode,
          outputCode: data.outputCode,
          level: data.level,
          type: data.type,
          reviewerId: data.reviewerId,
        },
      });

      // 2. 現在のタグリレーションを削除
      await tx.questionTagRelation.deleteMany({
        where: { questionId },
      });

      // 3. 新しいタグリレーションを作成
      for (const tagId of data.tagIds) {
        await tx.questionTagRelation.create({
          data: {
            questionId,
            tagId,
          },
        });
      }

      // 4. 既存のquestionFilesをIDでグループ化
      const existingFiles = await tx.questionFile.findMany({
        where: { questionId },
      });

      const existingFileIds = new Set(existingFiles.map((file) => file.id));
      const updatedFileIds = new Set(
        data.questionFiles
          .filter((file) => file.id)
          .map((file) => file.id as string)
      );

      // 5. 削除するファイルを特定して削除
      const filesToDelete = [...existingFileIds].filter(
        (id) => !updatedFileIds.has(id)
      );

      if (filesToDelete.length > 0) {
        await tx.questionFile.deleteMany({
          where: {
            id: {
              in: filesToDelete,
            },
          },
        });
      }

      // 6. 既存のファイルを更新し、新しいファイルを作成
      for (const file of data.questionFiles) {
        if (file.id) {
          // 既存ファイルの更新
          await tx.questionFile.update({
            where: { id: file.id },
            data: {
              name: file.name,
              ext: file.ext,
              exampleAnswer: file.exampleAnswer,
              template: file.template,
              isRoot: file.isRoot,
            },
          });
        } else {
          // 新規ファイルの作成
          await tx.questionFile.create({
            data: {
              questionId,
              name: file.name,
              ext: file.ext,
              exampleAnswer: file.exampleAnswer,
              template: file.template,
              isRoot: file.isRoot,
            },
          });
        }
      }

      return question;
    });

    return NextResponse.json({
      message: "問題が正常に更新されました",
      questionId: updatedQuestion.id,
    });
  } catch (error) {
    console.error("問題の更新に失敗しました:", error);
    return NextResponse.json(
      { error: "問題の更新に失敗しました" },
      { status: 500 }
    );
  }
}

// 問題を削除するDELETEエンドポイント
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
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
    const questionId = (await params).questionId;

    // 問題が存在するか確認
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "問題が見つかりません" },
        { status: 404 }
      );
    }

    // トランザクションを使用して問題とその関連データを削除
    await prisma.$transaction(async (tx) => {
      // 1. タグリレーション削除
      await tx.questionTagRelation.deleteMany({
        where: { questionId },
      });

      // 2. 問題ファイル削除（スキーマでonDelete: Cascadeが設定されていれば不要）
      await tx.questionFile.deleteMany({
        where: { questionId },
      });

      // 3. 問題本体の削除
      await tx.question.delete({
        where: { id: questionId },
      });
    });

    return NextResponse.json({
      message: "問題が正常に削除されました",
    });
  } catch (error) {
    console.error("問題の削除に失敗しました:", error);
    return NextResponse.json(
      { error: "問題の削除に失敗しました" },
      { status: 500 }
    );
  }
}
