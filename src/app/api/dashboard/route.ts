import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export async function GET(request: NextRequest) {
  const prisma = await buildPrisma();
  try {
    const currentUser = await getCurrentUser({ request });

    // ユーザーの学習進捗データを取得
    const userQuestions = await prisma.userQuestion
      .findMany({
        where: {
          userId: currentUser.id,
        },
      })
      .then((questions) =>
        questions.map((q) => ({
          ...q,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
        }))
      );

    const responseData = {
      userQuestions,
    };

    return NextResponse.json(responseData);
  } catch (e) {
    return await buildError(e);
  }
}
