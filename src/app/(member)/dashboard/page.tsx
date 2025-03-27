"use client";

import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivityCalendar } from "./_components/ActivityCalendar";
import { LevelProgress } from "./_components/LevelProgress";
import { RecentActivities } from "./_components/RecentActivities";
import { StatCard } from "./_components/StatCard";
import { TagProgress } from "./_components/TagProgress";
import { TypeProgress } from "./_components/TypeProgress";
import { WeeklyStats } from "./_components/WeeklyStats";
import { useDashboard } from "./_hooks/useDashboard";

export default function Dashboard() {
  const { data, error, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <p>エラーが発生しました。再度お試しください。</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // 週間学習統計のフォーマット
  const formattedWeeklyStats = data.weeklyStats.map((day) => ({
    ...day,
    formattedDate: format(parseISO(day.date), "M/d (E)", { locale: ja }),
  }));

  // 半年分のカレンダーデータを作成
  const generateActivityData = () => {
    if (!data) return [];

    // APIから提供されたactivityHistoryデータを使用
    return data.activityHistory;
  };

  // カレンダーデータを生成
  const activityData = data ? generateActivityData() : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">学習ダッシュボード</h1>

      {/* 基本統計 */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="総問題数" value={data.totalQuestions} color="blue" />
        <StatCard
          title="完了した問題"
          value={data.completedQuestions}
          total={data.totalQuestions}
          color="green"
        />
        <StatCard
          title="進行中の問題"
          value={data.inProgressQuestions}
          color="amber"
        />
        <div className="rounded-lg bg-purple-50 p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold text-purple-700">完了率</h3>
          <p className="text-3xl font-bold text-purple-700">
            {data.completionRate}%
          </p>
          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{ width: `${data.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub風の活動カレンダー */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">活動カレンダー</h2>
        <ActivityCalendar data={activityData} />
      </div>

      {/* 週間学習統計 */}
      <WeeklyStats data={formattedWeeklyStats} />

      {/* 問題タイプ別・レベル別の統計 */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <TypeProgress data={data.questionsByType} />
        <LevelProgress data={data.questionsByLevel} />
      </div>

      {/* タグ別の統計 */}
      <TagProgress data={data.questionsByTag} />

      {/* 最近の活動 */}
      <RecentActivities data={data.recentActivities} />
    </div>
  );
}
