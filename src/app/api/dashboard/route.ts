import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export type DashboardResponse = {
  // 基本的な学習統計
  totalQuestions: number;
  completedQuestions: number;
  inProgressQuestions: number;
  completionRate: number;

  // 問題タイプ別の統計
  questionsByType: {
    type: string;
    total: number;
    completed: number;
    rate: number;
  }[];

  // 問題レベル別の統計
  questionsByLevel: {
    level: string;
    total: number;
    completed: number;
    rate: number;
  }[];

  // タグ別の統計
  questionsByTag: {
    tag: string;
    total: number;
    completed: number;
    rate: number;
  }[];

  // 最近の活動履歴
  recentActivities: {
    id: string;
    questionId: string;
    questionTitle: string;
    status: string;
    updatedAt: string;
    type: string;
    level: string;
  }[];

  // 週間学習統計
  weeklyStats: {
    date: string;
    questionsCompleted: number;
    answersSubmitted: number;
  }[];
};

export async function GET(request: NextRequest) {
  const prisma = await buildPrisma();
  try {
    const currentUser = await getCurrentUser({ request });

    // 全ての問題を取得
    const allQuestions = await prisma.question.findMany({
      include: {
        questions: {
          include: {
            tag: true,
          },
        },
      },
    });

    // ユーザーの学習進捗データを取得
    const userQuestions = await prisma.userQuestion.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        question: {
          include: {
            questions: {
              include: {
                tag: true,
              },
            },
          },
        },
        answers: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // 基本的な統計情報を計算
    const totalQuestions = allQuestions.length;
    const completedQuestions = userQuestions.filter(
      (q) => q.status === "PASSED"
    ).length;
    const inProgressQuestions = userQuestions.filter(
      (q) => q.status === "DRAFT"
    ).length;
    const completionRate =
      totalQuestions > 0
        ? Math.round((completedQuestions / totalQuestions) * 100)
        : 0;

    // 問題タイプ別の統計
    const typeStats = {} as Record<
      string,
      { total: number; completed: number }
    >;
    allQuestions.forEach((q) => {
      const type = q.type;
      if (!typeStats[type]) {
        typeStats[type] = { total: 0, completed: 0 };
      }
      typeStats[type].total += 1;
    });

    userQuestions
      .filter((q) => q.status === "PASSED")
      .forEach((uq) => {
        const type = uq.question.type;
        if (typeStats[type]) {
          typeStats[type].completed += 1;
        }
      });

    const questionsByType = Object.entries(typeStats).map(([type, stats]) => ({
      type,
      total: stats.total,
      completed: stats.completed,
      rate:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));

    // 問題レベル別の統計
    const levelStats = {} as Record<
      string,
      { total: number; completed: number }
    >;
    allQuestions.forEach((q) => {
      const level = q.level;
      if (!levelStats[level]) {
        levelStats[level] = { total: 0, completed: 0 };
      }
      levelStats[level].total += 1;
    });

    userQuestions
      .filter((q) => q.status === "PASSED")
      .forEach((uq) => {
        const level = uq.question.level;
        if (levelStats[level]) {
          levelStats[level].completed += 1;
        }
      });

    const questionsByLevel = Object.entries(levelStats).map(
      ([level, stats]) => ({
        level,
        total: stats.total,
        completed: stats.completed,
        rate:
          stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0,
      })
    );

    // タグ別の統計
    const tagStats = {} as Record<string, { total: number; completed: number }>;

    // すべての問題のタグを集計
    allQuestions.forEach((question) => {
      question.questions.forEach((relation) => {
        const tagName = relation.tag.name;
        if (!tagStats[tagName]) {
          tagStats[tagName] = { total: 0, completed: 0 };
        }
        tagStats[tagName].total += 1;
      });
    });

    // 完了した問題のタグを集計
    userQuestions
      .filter((uq) => uq.status === "PASSED")
      .forEach((uq) => {
        uq.question.questions.forEach((relation) => {
          const tagName = relation.tag.name;
          if (tagStats[tagName]) {
            tagStats[tagName].completed += 1;
          }
        });
      });

    const questionsByTag = Object.entries(tagStats).map(([tag, stats]) => ({
      tag,
      total: stats.total,
      completed: stats.completed,
      rate:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));

    // 最近の活動履歴
    const recentActivities = userQuestions.slice(0, 10).map((uq) => ({
      id: uq.id,
      questionId: uq.questionId,
      questionTitle: uq.question.title,
      status: uq.status,
      updatedAt: uq.updatedAt.toISOString(),
      type: uq.question.type,
      level: uq.question.level,
    }));

    // 週間学習統計（過去7日間）
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    const weeklyStats = last7Days.map((date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // その日に完了した問題数
      const questionsCompleted = userQuestions.filter(
        (uq) =>
          uq.status === "PASSED" &&
          uq.updatedAt >= date &&
          uq.updatedAt < nextDay
      ).length;

      // その日に提出した解答数
      const answersSubmitted = userQuestions.flatMap((uq) =>
        uq.answers.filter(
          (answer) => answer.createdAt >= date && answer.createdAt < nextDay
        )
      ).length;

      return {
        date: date.toISOString().split("T")[0],
        questionsCompleted,
        answersSubmitted,
      };
    });

    const responseData: DashboardResponse = {
      totalQuestions,
      completedQuestions,
      inProgressQuestions,
      completionRate,
      questionsByType,
      questionsByLevel,
      questionsByTag,
      recentActivities,
      weeklyStats,
    };

    return NextResponse.json(responseData);
  } catch (e) {
    return await buildError(e);
  }
}
