import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export async function GET(request: NextRequest) {
  const prisma = await buildPrisma();
  try {
    const currentUser = await getCurrentUser({ request });

    // ユーザーの学習進捗データを取得
    const userQuestions = await prisma.userQuestion.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        question: {
          include: {
            lesson: {
              include: {
                course: true,
              },
            },
            questions: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    // コース別の進捗状況を集計
    const courseProgress = await prisma.course.findMany({
      include: {
        lessons: {
          include: {
            questions: {
              include: {
                userQuestions: {
                  where: {
                    userId: currentUser.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    // ユーザーのポイント履歴
    const pointTransactions = await prisma.pointTransaction.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // 最近のコードレビュー
    const recentCodeReviews = await prisma.codeReview.findMany({
      where: {
        userQuestion: {
          userId: currentUser.id,
        },
      },
      include: {
        userQuestion: {
          include: {
            question: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      userQuestions,
      courseProgress,
      pointTransactions,
      recentCodeReviews,
      totalPoints: currentUser.points,
    });
  } catch (e) {
    return await buildError(e);
  }
}
