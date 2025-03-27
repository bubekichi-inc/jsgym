"use client";

import { ProgressBar } from "./ProgressBar";

type StatCardProps = {
  title: string;
  value: number;
  total?: number;
  color?: "blue" | "green" | "purple" | "amber";
};

// 統計カードコンポーネント
export const StatCard = ({
  title,
  value,
  total,
  color = "blue",
}: StatCardProps) => {
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
