import { NextRequest, NextResponse } from "next/server";
import { DashboardData } from "../_types/DashboardTypes";
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
      })
      .then((questions) =>
        questions.map((q) => ({
          ...q,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
        }))
      );

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
    const pointTransactions = await prisma.pointTransaction
      .findMany({
        where: {
          userId: currentUser.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      })
      .then((transactions) =>
        transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        }))
      );

    // 最近のコードレビュー
    const recentCodeReviews = await prisma.codeReview
      .findMany({
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
        take: 10,
      })
      .then((reviews) =>
        reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }))
      );

    const responseData: DashboardData = {
      userQuestions,
      courseProgress,
      pointTransactions,
      recentCodeReviews,
      totalPoints: currentUser.points,
    };

    return NextResponse.json(responseData);
  } catch (e) {
    return await buildError(e);
  }
}
