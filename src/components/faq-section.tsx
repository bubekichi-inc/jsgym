"use client";

import { useState } from "react";

export function FaqSection() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  const toggleItem = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              よくある質問
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              JS Gymについてよくある質問と回答をまとめました。
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="w-full">
            <div className="border-b">
              <div className="flex">
                <h3
                  className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
                  onClick={() => toggleItem("item-1")}
                >
                  無料で使えますか？
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      openItem === "item-1" ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
              </div>
              <div
                className={`overflow-hidden text-sm transition-all ${
                  openItem === "item-1" ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="pb-4 pt-0">
                  全機能、無料でご利用いただけます。将来的に変更する可能性がありますが、その際には事前にご案内いたします。
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex">
                <h3
                  className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
                  onClick={() => toggleItem("item-2")}
                >
                  JavaScript学習経験がなくても活用できますか？
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      openItem === "item-2" ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
              </div>
              <div
                className={`overflow-hidden text-sm transition-all ${
                  openItem === "item-2" ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="pb-4 pt-0">
                  ご利用いただけますが、完全初心者向けではないため、他の学習サイトなどで基本的な文法などを一通りインプットした後に実施いただくと、より効果を得やすいです。
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex">
                <h3
                  className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
                  onClick={() => toggleItem("item-3")}
                >
                  どのくらいの頻度で問題が追加されますか？
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      openItem === "item-3" ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
              </div>
              <div
                className={`overflow-hidden text-sm transition-all ${
                  openItem === "item-3" ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="pb-4 pt-0">
                  毎日9つの新しい問題が自動で追加されます。初級、中級、上級とレベル別に問題が用意されるので、自分のペースで学習を進めることができます。
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex">
                <h3
                  className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
                  onClick={() => toggleItem("item-4")}
                >
                  AIコードレビューはどのように行われますか？
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      openItem === "item-4" ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
              </div>
              <div
                className={`overflow-hidden text-sm transition-all ${
                  openItem === "item-4" ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="pb-4 pt-0">
                  問題を解いた後、提出したコードに対して自動的にAIがレビューを行います。コードの品質、効率性、ベストプラクティスなどの観点からフィードバックが得られます。実務で通用するコーディングスタイルを身につけるのに役立ちます。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
