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
  period: "same_day" | "1_7_days" | "8_14_days" | "15_30_days";
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
    sameDay: RetentionData;
    oneToSevenDays: RetentionData;
    eightToFourteenDays: RetentionData;
    fifteenToThirtyDays: RetentionData;
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

    // リテンションデータを計算する関数
    const calculateRetention = async (
      startDaysAgo: number,
      endDaysAgo: number,
      periodName: "same_day" | "1_7_days" | "8_14_days" | "15_30_days"
    ): Promise<RetentionData> => {
      const startDate = subDays(now, startDaysAgo);
      const endDate = subDays(now, endDaysAgo);
      const periodStart = startOfDay(startDate);
      const periodEnd = endOfDay(endDate);

      // 対象期間に登録したユーザーを取得
      const users = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      const total = users.length;

      // 各ユーザーについて登録日から指定期間内にuserQuestionを作成したかを確認
      let retainedCount = 0;

      if (total > 0) {
        // 各ユーザーごとにチェック
        for (const user of users) {
          // ユーザーの登録日
          const userCreatedAt = user.createdAt;

          let activityCheckStartDate, activityCheckEndDate;

          if (periodName === "same_day") {
            // 登録当日
            activityCheckStartDate = startOfDay(userCreatedAt);
            activityCheckEndDate = endOfDay(userCreatedAt);
          } else if (periodName === "1_7_days") {
            // 登録1日後〜7日後
            activityCheckStartDate = startOfDay(
              new Date(userCreatedAt.getTime() + 24 * 60 * 60 * 1000)
            );
            activityCheckEndDate = endOfDay(
              new Date(userCreatedAt.getTime() + 7 * 24 * 60 * 60 * 1000)
            );
          } else if (periodName === "8_14_days") {
            // 登録8日後〜14日後
            activityCheckStartDate = startOfDay(
              new Date(userCreatedAt.getTime() + 8 * 24 * 60 * 60 * 1000)
            );
            activityCheckEndDate = endOfDay(
              new Date(userCreatedAt.getTime() + 14 * 24 * 60 * 60 * 1000)
            );
          } else if (periodName === "15_30_days") {
            // 登録15日後〜30日後
            activityCheckStartDate = startOfDay(
              new Date(userCreatedAt.getTime() + 15 * 24 * 60 * 60 * 1000)
            );
            activityCheckEndDate = endOfDay(
              new Date(userCreatedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
            );
          }

          // 該当期間内にユーザーがアクティビティを行ったか確認
          const userActivity = await prisma.userQuestion.findFirst({
            where: {
              userId: user.id,
              createdAt: {
                gte: activityCheckStartDate,
                lte: activityCheckEndDate,
              },
            },
          });

          if (userActivity) {
            retainedCount++;
          }
        }
      }

      const retentionRate =
        total > 0 ? Math.round((retainedCount / total) * 100) : 0;

      return {
        period: periodName,
        rate: retentionRate,
        total,
        retained: retainedCount,
      };
    };

    // 各期間のリテンションを計算
    // 登録当日
    const sameDayRetention = await calculateRetention(30, 1, "same_day");

    // 登録1日後〜7日後
    const oneToSevenDaysRetention = await calculateRetention(30, 1, "1_7_days");

    // 登録8日後〜14日後
    const eightToFourteenDaysRetention = await calculateRetention(
      30,
      1,
      "8_14_days"
    );

    // 登録15日後〜30日後
    const fifteenToThirtyDaysRetention = await calculateRetention(
      30,
      1,
      "15_30_days"
    );

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
        sameDay: sameDayRetention,
        oneToSevenDays: oneToSevenDaysRetention,
        eightToFourteenDays: eightToFourteenDaysRetention,
        fifteenToThirtyDays: fifteenToThirtyDaysRetention,
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
