"use client";

import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

type ActivityData = {
  date: string;
  count: number;
}[];

// 活動カレンダーコンポーネント
export const ActivityCalendar = ({ data }: { data: ActivityData }) => {
  const maxCount = Math.max(...data.map((day) => day.count), 1);
  const getActivityColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    const intensity = Math.min(Math.ceil((count / maxCount) * 4), 4);
    const colors = [
      "bg-emerald-100",
      "bg-emerald-200",
      "bg-emerald-300",
      "bg-emerald-500",
    ];
    return colors[intensity - 1];
  };

  // 月を計算（逆順に表示）
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    return date;
  }).reverse();

  // 月表示位置の計算（近似値）
  const monthPositions = [0, 4, 8, 13, 17, 22]; // 各月の開始週位置

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* 月表示エリア */}
        <div className="mb-2 pl-6">
          <div className="relative h-5 w-full">
            {months.map((month, i) => {
              const pos = monthPositions[i];
              return (
                <div
                  key={i}
                  className="absolute text-xs text-gray-500"
                  style={{
                    left: `${pos * 16}px`, // 16px = サイズ(12px) + 間隔(4px)
                  }}
                >
                  {format(month, "M月", { locale: ja })}
                </div>
              );
            })}
          </div>
        </div>

        {/* カレンダー本体 */}
        <div className="flex">
          {/* 曜日表示 */}
          <div className="mr-2 flex flex-col justify-around text-xs text-gray-500">
            <span>日</span>
            <span>月</span>
            <span>火</span>
            <span>水</span>
            <span>木</span>
            <span>金</span>
            <span>土</span>
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-flow-col gap-1">
            {Array.from({ length: 26 }, (_, weekIndex) => (
              <div key={weekIndex} className="grid grid-flow-row gap-1">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  // 最新のデータが右側に表示されるように週インデックスを反転
                  const reversedWeekIndex = 25 - weekIndex;
                  const dayData = data.find((d) => {
                    const date = parseISO(d.date);
                    return (
                      date.getDay() === dayIndex &&
                      Math.floor(
                        (now.getTime() - date.getTime()) /
                          (7 * 24 * 60 * 60 * 1000)
                      ) === reversedWeekIndex
                    );
                  });
                  return (
                    <div
                      key={dayIndex}
                      className={`size-3 rounded-sm ${getActivityColor(
                        dayData?.count || 0
                      )}`}
                      title={
                        dayData
                          ? `${dayData.date}: ${dayData.count}問題`
                          : undefined
                      }
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 凡例 */}
        <div className="mt-6 flex items-center text-xs text-gray-600">
          <span className="mr-1">少</span>
          <div className="size-3 rounded-sm bg-gray-100"></div>
          <div className="ml-1 size-3 rounded-sm bg-emerald-100"></div>
          <div className="ml-1 size-3 rounded-sm bg-emerald-200"></div>
          <div className="ml-1 size-3 rounded-sm bg-emerald-300"></div>
          <div className="ml-1 size-3 rounded-sm bg-emerald-500"></div>
          <span className="ml-1">多</span>
        </div>
      </div>
    </div>
  );
};
