"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import React, { useState } from "react";
import { useEvents } from "./_hooks/useEvents";

const eventTypeMap: Record<string, string> = {
  VIEW: "閲覧",
  CLICK: "クリック",
  KEY_PRESS: "キー入力",
  SCROLL: "スクロール",
  HOVER: "ホバー",
};

export default function AdminEvents() {
  const currentMonth = format(new Date(), "yyyy/M");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [isAllPeriods, setIsAllPeriods] = useState<boolean>(false);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "all") {
      setIsAllPeriods(true);
    } else {
      setIsAllPeriods(false);
      setSelectedMonth(value);
    }
  };

  const monthOptions: Array<{ value: string; label: string }> = React.useMemo(() => {
    const options: Array<{ value: string; label: string }> = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = format(month, "yyyy/M");
      const label = format(month, "yyyy年M月");
      options.push({ value, label });
    }
    return options;
  }, []);

  const { events, totalCount, error, isLoading } = useEvents(selectedMonth, isAllPeriods);

  return (
    <div className="mx-auto">
      <h1 className="mb-6 text-2xl font-bold">イベント集計</h1>

      <div className="mb-6">
        <label htmlFor="month" className="mb-2 block text-sm font-medium">
          期間:
        </label>
        <select
          id="month"
          value={isAllPeriods ? "all" : selectedMonth}
          onChange={handleMonthChange}
          className="w-40 rounded border px-3 py-2"
        >
          <option value="all">全期間</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center text-gray-500">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          データを読み込み中...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          データの取得中にエラーが発生しました
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
          該当するイベントデータがありません
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-8">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              イベント集計 - 合計: {totalCount}件
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left">イベント名</th>
                    <th className="px-4 py-3 text-right">数</th>
                    <th className="px-4 py-3 text-left">タイプ内訳</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={event.name}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3">{event.name}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {event.count}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {event.typeBreakdown.map((type) => (
                            <span
                              key={type.type}
                              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                            >
                              {eventTypeMap[type.type]}: {type.count}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
