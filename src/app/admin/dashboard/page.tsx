"use client";

import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { useFetch } from "@/app/_hooks/useFetch";

type DailyStats = {
  date: string;
  newUsers: number;
  submittedAnswers: number;
  clearedQuestions: number;
};

type DashboardResponse = {
  dailyStats: DailyStats[];
};

export default function AdminDashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy/M")
  );

  const { data, error, isLoading } = useFetch<DashboardResponse>(
    `/api/admin/dashboard?month=${selectedMonth}`
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  // グラフの描画用データを準備
  const chartData = data?.dailyStats || [];

  // 日付を日本語表示用にフォーマット
  const formattedDates = chartData.map((item) => {
    const date = parse(item.date, "yyyy-MM-dd", new Date());
    return format(date, "M月d日(E)", { locale: ja });
  });

  // グラフの最大値を計算（少し余裕を持たせる）
  const maxValue =
    Math.max(
      ...chartData.map((item) =>
        Math.max(item.newUsers, item.submittedAnswers, item.clearedQuestions)
      ),
      10 // 最低値を10に設定
    ) * 1.2;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">管理者ダッシュボード</h1>

      <div className="mb-6">
        <label htmlFor="month" className="mb-2 block text-sm font-medium">
          月を選択:
        </label>
        <input
          type="text"
          id="month"
          placeholder="yyyy/M (例: 2025/3)"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="w-40 rounded border px-3 py-2"
        />
      </div>

      {isLoading && <p className="text-gray-500">データを読み込み中...</p>}

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          データの取得中にエラーが発生しました
        </div>
      )}

      {data && (
        <div className="space-y-8">
          {/* 統計サマリー */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 shadow">
              <h3 className="mb-2 text-lg font-semibold">新規ユーザー登録</h3>
              <p className="text-3xl font-bold">
                {chartData.reduce((sum, item) => sum + item.newUsers, 0)}
              </p>
              <p className="text-sm text-gray-500">今月の合計</p>
            </div>

            <div className="rounded-lg bg-green-50 p-4 shadow">
              <h3 className="mb-2 text-lg font-semibold">解答提出数</h3>
              <p className="text-3xl font-bold">
                {chartData.reduce(
                  (sum, item) => sum + item.submittedAnswers,
                  0
                )}
              </p>
              <p className="text-sm text-gray-500">今月の合計</p>
            </div>

            <div className="rounded-lg bg-purple-50 p-4 shadow">
              <h3 className="mb-2 text-lg font-semibold">クリアした問題数</h3>
              <p className="text-3xl font-bold">
                {chartData.reduce(
                  (sum, item) => sum + item.clearedQuestions,
                  0
                )}
              </p>
              <p className="text-sm text-gray-500">今月の合計</p>
            </div>
          </div>

          {/* グラフ */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">日別統計</h2>

            {chartData.length > 0 ? (
              <div className="relative h-80">
                {/* Y軸 */}
                <div className="absolute inset-y-0 left-0 flex w-12 flex-col justify-between text-xs text-gray-500">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex w-full items-center justify-end"
                    >
                      {Math.round((maxValue * (5 - i)) / 5)}
                    </div>
                  ))}
                </div>

                {/* グラフエリア */}
                <div className="ml-12 flex h-full">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-1 flex-col items-center justify-end"
                    >
                      {/* 新規ユーザー */}
                      <div
                        className="group relative mx-1 w-3 bg-blue-500"
                        style={{
                          height: `${(item.newUsers / maxValue) * 100}%`,
                        }}
                      >
                        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                          新規ユーザー: {item.newUsers}
                        </div>
                      </div>

                      {/* 解答提出数 */}
                      <div
                        className="group relative mx-1 w-3 bg-green-500"
                        style={{
                          height: `${
                            (item.submittedAnswers / maxValue) * 100
                          }%`,
                        }}
                      >
                        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                          解答提出: {item.submittedAnswers}
                        </div>
                      </div>

                      {/* クリアした問題数 */}
                      <div
                        className="group relative mx-1 w-3 bg-purple-500"
                        style={{
                          height: `${
                            (item.clearedQuestions / maxValue) * 100
                          }%`,
                        }}
                      >
                        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                          クリア: {item.clearedQuestions}
                        </div>
                      </div>

                      {/* X軸ラベル */}
                      <div className="mt-2 origin-top-left -rotate-45 text-xs">
                        {formattedDates[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">データがありません</p>
            )}

            {/* 凡例 */}
            <div className="mt-12 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="mr-2 size-4 bg-blue-500"></div>
                <span className="text-sm">新規ユーザー</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-4 bg-green-500"></div>
                <span className="text-sm">解答提出数</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-4 bg-purple-500"></div>
                <span className="text-sm">クリアした問題数</span>
              </div>
            </div>
          </div>

          {/* データテーブル */}
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg bg-white shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">日付</th>
                  <th className="px-4 py-3 text-left">新規ユーザー</th>
                  <th className="px-4 py-3 text-left">解答提出数</th>
                  <th className="px-4 py-3 text-left">クリアした問題数</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{formattedDates[index]}</td>
                    <td className="px-4 py-3">{item.newUsers}</td>
                    <td className="px-4 py-3">{item.submittedAnswers}</td>
                    <td className="px-4 py-3">{item.clearedQuestions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
