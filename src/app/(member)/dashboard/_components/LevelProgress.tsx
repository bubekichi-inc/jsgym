"use client";

import { ProgressBar } from "./ProgressBar";

type QuestionLevelStats = {
  level: string;
  total: number;
  completed: number;
  rate: number;
}[];

export const LevelProgress = ({ data }: { data: QuestionLevelStats }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">問題レベル別の進捗</h2>
      <div className="space-y-4">
        {data.map((item, index) => (
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
  );
};
