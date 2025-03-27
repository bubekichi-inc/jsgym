import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export type QuestionTagResponse = {
  id: number;
  name: string;
}[];

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

    // QuestionTagの一覧を取得
    const tags = await prisma.questionTag.findMany({
      orderBy: {
        id: "asc",
      },
    });

    // レスポンスデータの整形
    const response: QuestionTagResponse = tags.map((tag) => ({
      id: tag.id,
      name: String(tag.name), // enumをstringに変換
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("タグ一覧の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "タグ一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
