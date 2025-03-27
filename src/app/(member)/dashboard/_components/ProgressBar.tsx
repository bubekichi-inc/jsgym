"use client";

// 進捗バーコンポーネント
export const ProgressBar = ({ value, max }: { value: number; max: number }) => {
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
