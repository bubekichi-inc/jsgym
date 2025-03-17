"use client";

import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { useDashboard } from "./_hooks/useDashboard";

// 進捗バーコンポーネント
const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-2 rounded-full bg-blue-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// 統計カードコンポーネント
const StatCard = ({
  title,
  value,
  total,
  color = "blue",
}: {
  title: string;
  value: number;
  total?: number;
  color?: "blue" | "green" | "purple" | "amber";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-lg p-4 shadow ${colorClasses[color]}`}>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      {total !== undefined && (
        <div className="mt-2">
          <ProgressBar value={value} max={total} />
          <p className="mt-1 text-sm">
            {value} / {total} ({Math.round((value / total) * 100)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { data, error, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
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

      {/* 週間学習統計 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">週間学習統計</h2>
        <div className="relative h-64">
          {/* Y軸 */}
          <div className="absolute inset-y-0 left-0 flex w-10 flex-col justify-between text-xs text-gray-500">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-end">
                {Math.max(
                  ...formattedWeeklyStats.map(
                    (s) => s.questionsCompleted + s.answersSubmitted
                  ),
                  5
                ) *
                  ((5 - i) / 5)}
              </div>
            ))}
          </div>

          {/* グラフエリア */}
          <div className="ml-10 flex h-full">
            {formattedWeeklyStats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center justify-end"
              >
                {/* 解答提出数 */}
                <div
                  className="group relative w-6 bg-blue-400"
                  style={{
                    height: `${
                      (stat.answersSubmitted /
                        Math.max(
                          ...formattedWeeklyStats.map(
                            (s) => s.questionsCompleted + s.answersSubmitted
                          ),
                          5
                        )) *
                      100
                    }%`,
                  }}
                >
                  <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                    解答提出: {stat.answersSubmitted}
                  </div>
                </div>

                {/* 完了した問題数 */}
                <div
                  className="group relative w-6 bg-green-500"
                  style={{
                    height: `${
                      (stat.questionsCompleted /
                        Math.max(
                          ...formattedWeeklyStats.map(
                            (s) => s.questionsCompleted + s.answersSubmitted
                          ),
                          5
                        )) *
                      100
                    }%`,
                  }}
                >
                  <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                    完了: {stat.questionsCompleted}
                  </div>
                </div>

                {/* X軸ラベル */}
                <div className="mt-2 text-xs">{stat.formattedDate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 凡例 */}
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="mr-2 size-4 bg-blue-400"></div>
            <span className="text-sm">解答提出数</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 size-4 bg-green-500"></div>
            <span className="text-sm">完了した問題数</span>
          </div>
        </div>
      </div>

      {/* 問題タイプ別の統計 */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">問題タイプ別の進捗</h2>
          <div className="space-y-4">
            {data.questionsByType.map((item, index) => (
              <div key={index}>
                <div className="mb-1 flex justify-between">
                  <span className="font-medium">
                    {item.type === "JAVA_SCRIPT"
                      ? "JavaScript"
                      : item.type === "TYPE_SCRIPT"
                      ? "TypeScript"
                      : item.type === "REACT_JS"
                      ? "React (JS)"
                      : item.type === "REACT_TS"
                      ? "React (TS)"
                      : item.type}
                  </span>
                  <span>
                    {item.completed}/{item.total} ({item.rate}%)
                  </span>
                </div>
                <ProgressBar value={item.completed} max={item.total} />
              </div>
            ))}
          </div>
        </div>

        {/* 問題レベル別の統計 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">問題レベル別の進捗</h2>
          <div className="space-y-4">
            {data.questionsByLevel.map((item, index) => (
              <div key={index}>
                <div className="mb-1 flex justify-between">
                  <span className="font-medium">
                    {item.level === "BASIC"
                      ? "基本"
                      : item.level === "ADVANCED"
                      ? "応用"
                      : item.level === "REAL_WORLD"
                      ? "実践"
                      : item.level}
                  </span>
                  <span>
                    {item.completed}/{item.total} ({item.rate}%)
                  </span>
                </div>
                <ProgressBar value={item.completed} max={item.total} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* タグ別の統計 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">タグ別の進捗</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.questionsByTag.map((item, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="mb-1 flex justify-between">
                <span className="font-medium">
                  {item.tag === "VALUE"
                    ? "値"
                    : item.tag === "ARRAY"
                    ? "配列"
                    : item.tag === "OBJECT"
                    ? "オブジェクト"
                    : item.tag === "FUNCTION"
                    ? "関数"
                    : item.tag === "CLASS"
                    ? "クラス"
                    : item.tag === "STATE"
                    ? "状態管理"
                    : item.tag === "PROPS"
                    ? "Props"
                    : item.tag === "HOOK"
                    ? "Hooks"
                    : item.tag === "ERROR_HANDLING"
                    ? "エラー処理"
                    : item.tag === "ASYNC"
                    ? "非同期処理"
                    : item.tag}
                </span>
                <span className="text-sm">
                  {item.completed}/{item.total}
                </span>
              </div>
              <ProgressBar value={item.completed} max={item.total} />
              <p className="mt-1 text-right text-sm text-gray-500">
                {item.rate}% 完了
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 最近の活動 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">最近の活動</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  問題
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  タイプ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  レベル
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ステータス
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  更新日
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/q/${activity.questionId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {activity.questionTitle}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {activity.type === "JAVA_SCRIPT"
                      ? "JavaScript"
                      : activity.type === "TYPE_SCRIPT"
                      ? "TypeScript"
                      : activity.type === "REACT_JS"
                      ? "React (JS)"
                      : activity.type === "REACT_TS"
                      ? "React (TS)"
                      : activity.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {activity.level === "BASIC"
                      ? "基本"
                      : activity.level === "ADVANCED"
                      ? "応用"
                      : activity.level === "REAL_WORLD"
                      ? "実践"
                      : activity.level}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        activity.status === "PASSED"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "REVISION_REQUIRED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status === "PASSED"
                        ? "完了"
                        : activity.status === "REVISION_REQUIRED"
                        ? "修正必要"
                        : "下書き"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {format(parseISO(activity.updatedAt), "yyyy/MM/dd HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
