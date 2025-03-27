"use client";

import {
  faChartLine,
  faUsers,
  faCalendarAlt,
  faCode,
  faRobot,
  faSync,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import KpiTrends from "./_components/KpiTrends";
import { useKpi } from "@/app/_hooks/useKpi";

export default function KpiDashboard() {
  const { data, error, isLoading, refresh } = useKpi();

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">KPI ダッシュボード</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          更新
        </button>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-y-2 border-blue-500"></div>
          <p className="ml-2">データを読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            <span>データの取得中にエラーが発生しました。</span>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-8">
          {/* 主要KPIカード */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* リテンション */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                  <FontAwesomeIcon icon={faUsers} className="text-xl" />
                </div>
                <h2 className="text-xl font-bold">リテンション</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      登録当日の活動
                    </span>
                    <span className="text-2xl font-bold">
                      {data.retention.sameDay.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min(data.retention.sameDay.rate, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {data.retention.sameDay.retained} /{" "}
                    {data.retention.sameDay.total} ユーザー
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      登録1日後〜7日後
                    </span>
                    <span className="text-2xl font-bold">
                      {data.retention.oneToSevenDays.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min(
                          data.retention.oneToSevenDays.rate,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    目標値: 30% → 50%（3ヶ月以内）
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {data.retention.oneToSevenDays.retained} /{" "}
                    {data.retention.oneToSevenDays.total} ユーザー
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      登録8日後〜14日後
                    </span>
                    <span className="text-2xl font-bold">
                      {data.retention.eightToFourteenDays.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min(
                          data.retention.eightToFourteenDays.rate,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    目標値: 25% → 40%（3ヶ月以内）
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {data.retention.eightToFourteenDays.retained} /{" "}
                    {data.retention.eightToFourteenDays.total} ユーザー
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      登録15日後〜30日後
                    </span>
                    <span className="text-2xl font-bold">
                      {data.retention.fifteenToThirtyDays.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min(
                          data.retention.fifteenToThirtyDays.rate,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    目標値: 20% → 35%（3〜6ヶ月以内）
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {data.retention.fifteenToThirtyDays.retained} /{" "}
                    {data.retention.fifteenToThirtyDays.total} ユーザー
                  </div>
                </div>
              </div>
            </div>

            {/* アクティブユーザー */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-green-100 text-green-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />
                </div>
                <h2 className="text-xl font-bold">アクティブユーザー</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      週間アクティブユーザー (WAU)
                    </span>
                    <span className="text-2xl font-bold">
                      {data.activeUsers.weekly.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          data.activeUsers.weekly.progress,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    目標値: {data.activeUsers.weekly.target}（進捗率:{" "}
                    {data.activeUsers.weekly.progress}%）
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      月間アクティブユーザー (MAU)
                    </span>
                    <span className="text-2xl font-bold">
                      {data.activeUsers.monthly.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          data.activeUsers.monthly.progress,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    目標値: {data.activeUsers.monthly.target}（進捗率:{" "}
                    {data.activeUsers.monthly.progress}%）
                  </div>
                </div>
              </div>
            </div>

            {/* コード提出・AIレビュー */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                  <FontAwesomeIcon icon={faCode} className="text-xl" />
                </div>
                <h2 className="text-xl font-bold">コード提出・AIレビュー</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">総提出回数</span>
                    <span className="text-2xl font-bold">
                      {data.submissions.totalSubmissions}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      ユーザーあたりの平均提出回数
                    </span>
                    <span className="text-2xl font-bold">
                      {data.submissions.averagePerUser}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    目標値: 週平均1.5回 → 2回（3ヶ月以内）
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-end justify-between">
                    <span className="text-sm text-gray-600">
                      AIレビュー利用率
                    </span>
                    <span className="text-2xl font-bold">
                      {data.submissions.aiReviewRate}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${Math.min(
                          data.submissions.aiReviewRate,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <FontAwesomeIcon icon={faRobot} className="mr-1" />
                    <span>
                      AIレビュー利用回数: {data.submissions.totalAIReviews}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI推移 */}
          <KpiTrends />

          {/* KPI詳細情報 */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold">KPIの説明と目標値</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 flex items-center text-lg font-semibold">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="mr-2 text-blue-500"
                  />
                  大枠の指標（KGI・KPI）
                </h3>
                <div className="ml-8 rounded-lg bg-blue-50 p-4">
                  <h4 className="font-medium">KGI（最終目標）</h4>
                  <p className="mb-2">月間売上 100万円</p>
                  <p className="text-sm text-gray-600">
                    将来的に想定している目標。まずは、有料化開始後にこれを達成できる仕組みを作る。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center text-lg font-semibold">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="mr-2 text-indigo-500"
                  />
                  リテンション（継続率）
                </h3>
                <div className="ml-8 space-y-2">
                  <p>
                    ベータ版で課金がなくても「継続利用」が高いほど、提携先や投資家に対して「価値のあるサービス」と説明しやすい。
                  </p>
                  <div className="rounded-lg bg-indigo-50 p-4">
                    <h4 className="font-medium">説明：</h4>
                    <p className="mb-2">
                      ユーザーが登録した日を起点として、以下の期間でのアクティビティ（問題への取り組み）を測定します：
                    </p>
                    <ul className="ml-4 list-disc">
                      <li>登録当日：初期体験の満足度を測る指標</li>
                      <li>1〜7日後：短期的な継続率の指標</li>
                      <li>8〜14日後：中期的な継続率の指標</li>
                      <li>15〜30日後：長期的な継続率の指標</li>
                    </ul>
                    <h4 className="mt-3 font-medium">目標：</h4>
                    <ul className="ml-4 list-disc">
                      <li>登録当日：80%以上（初期体験の最適化）</li>
                      <li>1〜7日後：50%以上（3ヶ月以内）</li>
                      <li>8〜14日後：40%以上（3ヶ月以内）</li>
                      <li>15〜30日後：35%以上（3〜6ヶ月以内）</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center text-lg font-semibold">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-2 text-green-500"
                  />
                  アクティブユーザー数
                </h3>
                <div className="ml-8 space-y-2">
                  <p>
                    現在の週アクティブが約100名なので、これをどこまで伸ばせるかを明確にする。
                  </p>
                  <div className="rounded-lg bg-green-50 p-4">
                    <h4 className="font-medium">目標：</h4>
                    <ul className="ml-4 list-disc">
                      <li>WAU: 100 → 200（4〜6週間後） → 300（3ヶ月後）</li>
                      <li>
                        MAU: 300（現状推定） → 600（3ヶ月後） → 1,000（6ヶ月後）
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center text-lg font-semibold">
                  <FontAwesomeIcon
                    icon={faCode}
                    className="mr-2 text-amber-500"
                  />
                  コード提出数・AIレビュー利用数
                </h3>
                <div className="ml-8 space-y-2">
                  <p>
                    JS
                    Gymならではの「AIレビューを活用している」実績を見せられると、プロダクトの強みが伝わりやすい。
                  </p>
                  <div className="rounded-lg bg-amber-50 p-4">
                    <h4 className="font-medium">目標：</h4>
                    <ul className="ml-4 list-disc">
                      <li>
                        1ユーザーあたりの平均コード提出回数: 週平均1.5回 →
                        2回（3ヶ月以内）
                      </li>
                      <li>AIレビュー利用率の向上</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
