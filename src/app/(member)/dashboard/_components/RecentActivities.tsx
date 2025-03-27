"use client";

import { format, parseISO } from "date-fns";
import Link from "next/link";

type ActivityItem = {
  id: string;
  questionId: string;
  questionTitle: string;
  status: string;
  updatedAt: string;
  type: string;
  level: string;
};

export const RecentActivities = ({ data }: { data: ActivityItem[] }) => {
  return (
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
            {data.map((activity) => (
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
  );
};
