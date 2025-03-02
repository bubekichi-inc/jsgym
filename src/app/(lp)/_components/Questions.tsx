"use client";

import Link from "next/link";
import { useState } from "react";
import { useFetch } from "@/app/_hooks/useFetch";
import { QuestionLevel } from "@/app/_serevices/AIQuestionGenerateService";
import { Question } from "@/app/api/public/questions/route";

export function Questions() {
  const [activeTab, setActiveTab] = useState<QuestionLevel | "ALL">("ALL");
  const { data } = useFetch<{ questions: Question[] }>("/api/public/questions");

  const problems = data?.questions ?? [];

  const levelMap = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  };

  const levelMapReverse = {
    "1": "初級",
    "2": "中級",
    "3": "上級",
  };

  const tagMap = {
    VALUE: "値",
    ARRAY: "配列",
    OBJECT: "オブジェクト",
    FUNCTION: "関数",
    CLASS: "クラス",
  };

  const filteredProblems =
    activeTab === "ALL"
      ? problems
      : problems.filter((problem) => problem.lesson.id === levelMap[activeTab]);

  return (
    <section className="bg-gray-100/50 py-12 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              新しい問題
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              毎日9つの新しい問題が追加されます。自分のレベルに合わせて挑戦してみましょう。
            </p>
          </div>
        </div>
        <div className="mt-8">
          <div className="w-full">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "ALL"
                      ? "bg-white text-gray-950 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("ALL")}
                >
                  すべて
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "EASY"
                      ? "bg-white text-gray-950 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("EASY")}
                >
                  初級
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "MEDIUM"
                      ? "bg-white text-gray-950 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("MEDIUM")}
                >
                  中級
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "HARD"
                      ? "bg-white text-gray-950 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("HARD")}
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
                    className="flex h-full flex-col rounded-lg border bg-white p-6 shadow-sm"
                  >
                    <div className="pb-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold">{problem.title}</h3>
                        <span
                          className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                            problem.lesson.id === levelMap["EASY"]
                              ? "border-transparent bg-blue-500 text-white"
                              : problem.lesson.id === levelMap["MEDIUM"]
                              ? "border-transparent bg-yellow-500 text-white"
                              : "border-transparent bg-red-500 text-white"
                          }`}
                        >
                          {
                            levelMapReverse[
                              problem.lesson.id.toString() as keyof typeof levelMapReverse
                            ]
                          }
                        </span>
                      </div>
                      <p className="line-clamp-2 text-gray-500">
                        {problem.content}
                      </p>
                    </div>
                    <div className="grow">
                      <div className="flex flex-wrap gap-2">
                        {problem.questions.map((q) => (
                          <span
                            key={q.tag.name}
                            className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800 transition-colors"
                          >
                            {tagMap[q.tag.name as keyof typeof tagMap]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4">
                      <Link
                        href={`/q/${problem.id}`}
                        className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      >
                        問題に挑戦する
                      </Link>
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
