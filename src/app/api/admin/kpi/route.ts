import { UserRole } from "@prisma/client";
import {
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

// APIレスポンスの型定義
export type RetentionData = {
  period: "7days" | "30days";
  rate: number;
  total: number;
  retained: number;
};

export type ActiveUsersData = {
  period: "weekly" | "monthly";
  count: number;
  target: number;
  progress: number; // 目標達成率（%）
};

export type SubmissionData = {
  totalSubmissions: number;
  averagePerUser: number;
  totalAIReviews: number;
  aiReviewRate: number; // AIレビューを活用した割合
};

export type KPIResponse = {
  retention: {
    sevenDays: RetentionData;
    thirtyDays: RetentionData;
  };
  activeUsers: {
    weekly: ActiveUsersData;
    monthly: ActiveUsersData;
  };
  submissions: SubmissionData;
};

// 処理時間を延長（2分）
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ request });

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const prisma = await buildPrisma();
    const now = new Date();

    // 7日リテンション率計算
    const sevenDaysAgo = subDays(now, 7);
    const sevenDaysStart = startOfDay(sevenDaysAgo);
    const sevenDaysEnd = endOfDay(sevenDaysAgo);

    // 7日前に登録したユーザーを取得
    const sevenDaysUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysStart,
          lte: sevenDaysEnd,
        },
      },
      select: {
        id: true,
      },
    });

    const sevenDaysUserIds = sevenDaysUsers.map((user) => user.id);
    const sevenDaysTotal = sevenDaysUserIds.length;

    // 7日以内にuserQuestionの記録があるユーザー数を計算
    const sevenDaysRetainedCount =
      sevenDaysTotal > 0
        ? await prisma.userQuestion
            .groupBy({
              by: ["userId"],
              where: {
                userId: {
                  in: sevenDaysUserIds,
                },
                createdAt: {
                  gte: sevenDaysStart,
                  lte: now,
                },
              },
            })
            .then((results) => results.length)
        : 0;

    const sevenDaysRetention =
      sevenDaysTotal > 0
        ? Math.round((sevenDaysRetainedCount / sevenDaysTotal) * 100)
        : 0;

    // 30日リテンション率計算
    const thirtyDaysAgo = subDays(now, 30);
    const thirtyDaysStart = startOfDay(thirtyDaysAgo);
    const thirtyDaysEnd = endOfDay(thirtyDaysAgo);

    // 30日前に登録したユーザーを取得
    const thirtyDaysUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysStart,
          lte: thirtyDaysEnd,
        },
      },
      select: {
        id: true,
      },
    });

    const thirtyDaysUserIds = thirtyDaysUsers.map((user) => user.id);
    const thirtyDaysTotal = thirtyDaysUserIds.length;

    // 30日以内にuserQuestionの記録があるユーザー数を計算
    const thirtyDaysRetainedCount =
      thirtyDaysTotal > 0
        ? await prisma.userQuestion
            .groupBy({
              by: ["userId"],
              where: {
                userId: {
                  in: thirtyDaysUserIds,
                },
                createdAt: {
                  gte: thirtyDaysStart,
                  lte: now,
                },
              },
            })
            .then((results) => results.length)
        : 0;

    const thirtyDaysRetention =
      thirtyDaysTotal > 0
        ? Math.round((thirtyDaysRetainedCount / thirtyDaysTotal) * 100)
        : 0;

    // WAU(Weekly Active Users)の計算
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // 月曜日から始まる週
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const wauCount = await prisma.userQuestion
      .groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      })
      .then((results) => results.length);

    // MAU(Monthly Active Users)の計算
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const mauCount = await prisma.userQuestion
      .groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })
      .then((results) => results.length);

    // 目標値（ユーザーのリクエストに基づく）
    const wauTarget = 200; // 目標WAU
    const mauTarget = 600; // 目標MAU

    // コード提出数の計算
    const totalSubmissions = await prisma.answer.count();
    const totalUsers = await prisma.user.count({
      where: {
        role: UserRole.USER,
      },
    });
    const averagePerUser =
      totalUsers > 0
        ? Math.round((totalSubmissions / totalUsers) * 10) / 10
        : 0;

    // AIレビュー利用数
    const totalAIReviews = await prisma.codeReview.count();
    const aiReviewRate =
      totalSubmissions > 0
        ? Math.round((totalAIReviews / totalSubmissions) * 100)
        : 0;

    // レスポンスデータを構築
    const response: KPIResponse = {
      retention: {
        sevenDays: {
          period: "7days",
          rate: sevenDaysRetention,
          total: sevenDaysTotal,
          retained: sevenDaysRetainedCount,
        },
        thirtyDays: {
          period: "30days",
          rate: thirtyDaysRetention,
          total: thirtyDaysTotal,
          retained: thirtyDaysRetainedCount,
        },
      },
      activeUsers: {
        weekly: {
          period: "weekly",
          count: wauCount,
          target: wauTarget,
          progress: Math.round((wauCount / wauTarget) * 100),
        },
        monthly: {
          period: "monthly",
          count: mauCount,
          target: mauTarget,
          progress: Math.round((mauCount / mauTarget) * 100),
        },
      },
      submissions: {
        totalSubmissions,
        averagePerUser,
        totalAIReviews,
        aiReviewRate,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("KPI取得エラー:", error);
    return NextResponse.json(
      { error: "KPIデータの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
