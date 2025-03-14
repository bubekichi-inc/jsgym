import { UserRole } from "@prisma/client";
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

// APIレスポンスの型定義
export type DailyStats = {
  date: string;
  newUsers: number;
  submittedAnswers: number;
  clearedQuestions: number;
  activeUsers: number;
};

export type UserDailyStats = {
  userId: string;
  username: string;
  dailyActivities: {
    date: string;
    submittedAnswers: number;
    clearedQuestions: number;
  }[];
  totalSubmitted: number;
  totalCleared: number;
};

export type DashboardResponse = {
  dailyStats: DailyStats[];
  userStats: UserDailyStats[];
};

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

    // クエリパラメータから月を取得
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month");

    if (!monthParam) {
      return NextResponse.json(
        { error: "月のパラメータが必要です (例: 2025/3)" },
        { status: 400 }
      );
    }

    // 月のフォーマットを解析 (例: 2025/3)
    const parsedDate = parse(monthParam, "yyyy/M", new Date());
    const startDate = startOfMonth(parsedDate);
    const endDate = endOfMonth(parsedDate);

    // 月の全日付を取得
    const daysInMonth = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const prisma = await buildPrisma();

    // 各日付ごとのデータを取得
    const dailyStats = await Promise.all(
      daysInMonth.map(async (date) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        // 1. ユーザー登録数
        const newUsers = await prisma.user.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        // 2. 解答提出数
        const submittedAnswers = await prisma.answer.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        // 3. クリアした問題数
        const clearedQuestions = await prisma.userQuestion.count({
          where: {
            status: "PASSED",
            updatedAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        // 4. アクティブユーザー数（その日に1回でも解答を提出したユーザー）
        // ユーザーIDの重複を除外して数える
        const activeUsersResult = await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          JOIN user_questions uq ON u.id = uq.user_id
          JOIN answers a ON uq.id = a.user_id
          WHERE a.created_at >= ${dayStart} AND a.created_at <= ${dayEnd}
        `;

        const activeUsers = Number(activeUsersResult[0]?.count || 0);

        return {
          date: format(date, "yyyy-MM-dd"),
          newUsers,
          submittedAnswers,
          clearedQuestions,
          activeUsers,
        };
      })
    );

    // ユーザーごとの統計情報を取得
    // 非アクティブユーザーも含めて全ユーザーを取得
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // ユーザーごとの日別統計情報を取得
    const userStats = await Promise.all(
      allUsers.map(async (user) => {
        // 各日付ごとの活動データを取得
        const dailyActivities = await Promise.all(
          daysInMonth.map(async (date) => {
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            // 解答提出数
            const submittedAnswers = await prisma.answer.count({
              where: {
                userQuestion: {
                  userId: user.id,
                },
                createdAt: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            });

            // クリアした問題数
            const clearedQuestions = await prisma.userQuestion.count({
              where: {
                userId: user.id,
                status: "PASSED",
                updatedAt: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            });

            return {
              date: format(date, "yyyy-MM-dd"),
              submittedAnswers,
              clearedQuestions,
            };
          })
        );

        // 月間の合計を計算
        const totalSubmitted = dailyActivities.reduce(
          (sum, day) => sum + day.submittedAnswers,
          0
        );
        const totalCleared = dailyActivities.reduce(
          (sum, day) => sum + day.clearedQuestions,
          0
        );

        return {
          userId: user.id,
          username: user.name || "名前なし",
          dailyActivities,
          totalSubmitted,
          totalCleared,
        };
      })
    );

    // 活動量の多い順にソート
    userStats.sort((a, b) => {
      // まず合計クリア数で比較
      if (b.totalCleared !== a.totalCleared) {
        return b.totalCleared - a.totalCleared;
      }
      // 次に合計提出数で比較
      return b.totalSubmitted - a.totalSubmitted;
    });

    return NextResponse.json({ dailyStats, userStats });
  } catch (error) {
    console.error("ダッシュボードデータの取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "データの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
