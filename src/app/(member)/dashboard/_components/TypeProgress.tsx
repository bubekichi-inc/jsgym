"use client";

import { ProgressBar } from "./ProgressBar";

type QuestionTypeStats = {
  type: string;
  total: number;
  completed: number;
  rate: number;
}[];

export const TypeProgress = ({ data }: { data: QuestionTypeStats }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">問題タイプ別の進捗</h2>
      <div className="space-y-4">
        {data.map((item, index) => (
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
  );
};
