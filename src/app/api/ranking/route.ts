import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";
import { calculateScore } from "@/app/_utils/score";

// レスポンスの型を定義
export type RankingResponse = {
  rankings: RankingUser[];
  currentUserRank: number | null;
};

export type RankingUser = {
  id: string;
  name: string | null;
  iconUrl: string | null;
  score: number;
  rank: number;
};

// 期間タイプの定義
export type PeriodType = "daily" | "weekly" | "all";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const periodType = (searchParams.get("period") as PeriodType) || "all";

    let user = null;
    try {
      user = await getCurrentUser({ request });
    } catch {
      // ログインユーザーがいない場合もランキングは表示できるようにする
      console.log("Not logged in user");
    }

    const prisma = await buildPrisma();

    // 期間に応じたフィルター条件を作成
    let dateFilter = {};
    const now = new Date();

    if (periodType === "daily") {
      // 本日のデータ
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      dateFilter = {
        createdAt: {
          gte: startOfDay,
        },
      };
    } else if (periodType === "weekly") {
      // 過去1週間のデータ
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0);

      dateFilter = {
        createdAt: {
          gte: oneWeekAgo,
        },
      };
    }

    // ユーザーごとの質問集計
    const usersWithQuestions = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        iconUrl: true,
        userQuestions: {
          where: {
            ...dateFilter,
            status: {
              in: ["PASSED"],
            },
          },
          select: {
            question: {
              select: {
                level: true,
                type: true,
              },
            },
          },
        },
      },
    });

    // スコア計算とランキング作成
    const usersWithScores = usersWithQuestions.map((user) => {
      const score = user.userQuestions.reduce((total, uq) => {
        return total + calculateScore(uq.question.level, uq.question.type);
      }, 0);

      return {
        id: user.id,
        name: user.name,
        iconUrl: user.iconUrl,
        score,
      };
    });

    // スコアでソート
    const sortedUsers = usersWithScores
      .filter((user) => user.score > 0) // スコアが0より大きいユーザーのみ
      .sort((a, b) => b.score - a.score);

    // ランクを付ける（同点は同じランク）
    let currentRank = 1;
    let previousScore = -1;
    let rankSkip = 0;

    const rankings = sortedUsers.slice(0, 25).map((user, index) => {
      if (previousScore !== user.score) {
        currentRank = index + 1 - rankSkip;
        previousScore = user.score;
      } else {
        rankSkip++;
      }

      return {
        ...user,
        rank: currentRank,
      };
    });

    // 現在のユーザーのランクを特定
    let currentUserRank = null;
    if (user) {
      const userRankObj = sortedUsers.find((u) => u.id === user.id);
      if (userRankObj) {
        const index = sortedUsers.findIndex((u) => u.id === user.id);
        let rank = 1;
        let prevScore = -1;
        let skipCount = 0;

        for (let i = 0; i < index + 1; i++) {
          if (prevScore !== sortedUsers[i].score) {
            rank = i + 1 - skipCount;
            prevScore = sortedUsers[i].score;
          } else {
            skipCount++;
          }
        }

        currentUserRank = rank;
      }
    }

    const response: RankingResponse = {
      rankings,
      currentUserRank,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}
