"use client";

import { useState } from "react";

// Mock data for problems
const problems = [
  {
    id: 1,
    title: "配列の要素を合計する",
    description:
      "与えられた配列の全ての要素の合計を返す関数を実装してください。",
    difficulty: "初級",
    tags: ["配列", "ループ", "reduce"],
    createdAt: "2025-01-01",
  },
  {
    id: 2,
    title: "文字列の逆順",
    description: "与えられた文字列を逆順にして返す関数を実装してください。",
    difficulty: "初級",
    tags: ["文字列", "配列"],
    createdAt: "2025-01-01",
  },
  {
    id: 3,
    title: "オブジェクトのマージ",
    description: "2つのオブジェクトを1つにマージする関数を実装してください。",
    difficulty: "中級",
    tags: ["オブジェクト", "スプレッド構文"],
    createdAt: "2025-01-01",
  },
  {
    id: 4,
    title: "非同期処理の順序制御",
    description: "複数の非同期処理を順番に実行する関数を実装してください。",
    difficulty: "上級",
    tags: ["Promise", "async/await"],
    createdAt: "2025-01-02",
  },
  {
    id: 5,
    title: "DOM操作の最適化",
    description:
      "複数の要素を追加する際のDOM操作を最適化する方法を実装してください。",
    difficulty: "中級",
    tags: ["DOM", "パフォーマンス"],
    createdAt: "2025-01-02",
  },
  {
    id: 6,
    title: "イベントデリゲーション",
    description:
      "イベントデリゲーションを使用して、動的に追加される要素にイベントを設定する実装をしてください。",
    difficulty: "中級",
    tags: ["イベント", "DOM"],
    createdAt: "2025-01-02",
  },
  {
    id: 7,
    title: "カリー化関数",
    description: "任意の関数をカリー化する高階関数を実装してください。",
    difficulty: "上級",
    tags: ["関数型", "高階関数"],
    createdAt: "2025-01-03",
  },
  {
    id: 8,
    title: "ディープコピー",
    description:
      "ネストされたオブジェクトの完全なディープコピーを行う関数を実装してください。",
    difficulty: "上級",
    tags: ["オブジェクト", "再帰"],
    createdAt: "2025-01-03",
  },
  {
    id: 9,
    title: "メモ化関数",
    description: "関数の結果をキャッシュするメモ化関数を実装してください。",
    difficulty: "中級",
    tags: ["パフォーマンス", "キャッシュ", "クロージャ"],
    createdAt: "2025-01-03",
  },
];

export function ProblemsSection() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProblems =
    activeTab === "all"
      ? problems
      : problems.filter((problem) => problem.difficulty === activeTab);

  return (
    <section className="bg-gray-100/50 py-12 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              今日の問題
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              毎日9つの新しい問題が追加されます。自分のレベルに合わせて挑戦してみましょう。
            </p>
          </div>
        </div>
        <div className="mt-8">
          <div className="w-full">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 ${
                    activeTab === "all"
                      ? "bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                      : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  すべて
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 ${
                    activeTab === "初級"
                      ? "bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                      : ""
                  }`}
                  onClick={() => setActiveTab("初級")}
                >
                  初級
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 ${
                    activeTab === "中級"
                      ? "bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                      : ""
                  }`}
                  onClick={() => setActiveTab("中級")}
                >
                  中級
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 ${
                    activeTab === "上級"
                      ? "bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                      : ""
                  }`}
                  onClick={() => setActiveTab("上級")}
                >
                  上級
                </button>
              </div>
            </div>
            <div className="mt-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex h-full flex-col rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="pb-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-white">
                          {problem.title}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                            problem.difficulty === "初級"
                              ? "border-transparent bg-blue-500 text-white"
                              : problem.difficulty === "中級"
                              ? "border-transparent bg-yellow-500 text-white"
                              : "border-transparent bg-red-500 text-white"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        {problem.description}
                      </p>
                    </div>
                    <div className="grow">
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800 transition-colors dark:border-gray-800 dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                        問題に挑戦する
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
