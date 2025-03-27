"use client";

import { faChartBar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, subMonths, eachMonthOfInterval } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";

type TrendDataPoint = {
  month: string;
  retention7d: number;
  retention30d: number;
  wau: number;
  mau: number;
  submissionsPerUser: number;
  aiReviewRate: number;
};

// デモ用のダミーデータ
const generateDummyData = (): TrendDataPoint[] => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);

  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now,
  });

  return months.map((month, index) => {
    // 徐々に改善するトレンドを模したデータ
    const baseValue = index / 5; // 0 から 1の間の値

    return {
      month: format(month, "yyyy年M月", { locale: ja }),
      retention7d: Math.round(20 + baseValue * 20), // 20% → 40%
      retention30d: Math.round(15 + baseValue * 15), // 15% → 30%
      wau: 100 + Math.round(baseValue * 150), // 100 → 250
      mau: 250 + Math.round(baseValue * 450), // 250 → 700
      submissionsPerUser: 1 + baseValue, // 1 → 2
      aiReviewRate: Math.round(40 + baseValue * 40), // 40% → 80%
    };
  });
};

export default function KpiTrends() {
  const [trendData] = useState<TrendDataPoint[]>(generateDummyData());

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <FontAwesomeIcon icon={faChartBar} className="mr-2 text-blue-500" />
        <h2 className="text-xl font-bold">KPI推移（過去6ヶ月）</h2>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
          <span>
            ※ 現在はデモデータです。実装後は実際のデータが表示されます。
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="p-2 text-sm font-medium text-gray-600">月</th>
              <th className="p-2 text-sm font-medium text-gray-600">
                7日リテンション
              </th>
              <th className="p-2 text-sm font-medium text-gray-600">
                30日リテンション
              </th>
              <th className="p-2 text-sm font-medium text-gray-600">WAU</th>
              <th className="p-2 text-sm font-medium text-gray-600">MAU</th>
              <th className="p-2 text-sm font-medium text-gray-600">
                平均提出回数
              </th>
              <th className="p-2 text-sm font-medium text-gray-600">
                AIレビュー率
              </th>
            </tr>
          </thead>
          <tbody>
            {trendData.map((data, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index === trendData.length - 1 ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-2 font-medium">{data.month}</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <span className="mr-2">{data.retention7d}%</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${data.retention7d}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <span className="mr-2">{data.retention30d}%</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${data.retention30d}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-2">{data.wau}</td>
                <td className="p-2">{data.mau}</td>
                <td className="p-2">{data.submissionsPerUser.toFixed(1)}</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <span className="mr-2">{data.aiReviewRate}%</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${data.aiReviewRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm">
        <p className="text-gray-600">
          ※ 最新月のデータは月末までのものであり、完全なデータではありません。
        </p>
      </div>
    </div>
  );
}
