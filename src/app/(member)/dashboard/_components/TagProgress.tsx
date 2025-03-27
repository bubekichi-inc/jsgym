"use client";

import { ProgressBar } from "./ProgressBar";

type QuestionTagStats = {
  tag: string;
  total: number;
  completed: number;
  rate: number;
}[];

export const TagProgress = ({ data }: { data: QuestionTagStats }) => {
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">タグ別の進捗</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-1 flex justify-between">
              <span className="font-medium">
                {item.tag === "VALUE"
                  ? "値"
                  : item.tag === "ARRAY"
                  ? "配列"
                  : item.tag === "OBJECT"
                  ? "オブジェクト"
                  : item.tag === "FUNCTION"
                  ? "関数"
                  : item.tag === "CLASS"
                  ? "クラス"
                  : item.tag === "STATE"
                  ? "状態管理"
                  : item.tag === "PROPS"
                  ? "Props"
                  : item.tag === "HOOK"
                  ? "Hooks"
                  : item.tag === "ERROR_HANDLING"
                  ? "エラー処理"
                  : item.tag === "ASYNC"
                  ? "非同期処理"
                  : item.tag}
              </span>
              <span className="text-sm">
                {item.completed}/{item.total}
              </span>
            </div>
            <ProgressBar value={item.completed} max={item.total} />
            <p className="mt-1 text-right text-sm text-gray-500">
              {item.rate}% 完了
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
