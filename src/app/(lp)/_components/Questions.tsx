"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { QuestionCard } from "@/app/_components/QuestionCard";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { QuestionLevel } from "@/app/_serevices/AIQuestionGenerateService";

interface Props {
  limit: number;
}

export const Questions: React.FC<Props> = ({ limit }) => {
  const searchParams = useSearchParams();

  // URLクエリパラメータから初期状態を取得
  const initialTitle = searchParams.get("title") || "";
  const initialTab =
    (searchParams.get("tab") as QuestionLevel | "ALL") || "ALL";
  const initialReviewerId = Number(searchParams.get("reviewerId") || "0");

  const [hoveredReviewerId, setHoveredReviewerId] = useState<number | null>(
    null
  );
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    questions,
    reviewers,
    activeTab,
    searchTitle,
    selectedReviewerId,
    hasMore,
    isLoading,
    handleSearchInputChange,
    handleTabChange,
    handleReviewerSelect,
    handleLoadMore,
  } = useQuestions({
    limit,
    initialTitle,
    initialTab,
    initialReviewerId,
  });

  const handleReviewerMouseEnter = (reviewerId: number) => {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredReviewerId(reviewerId);
    }, 800);
  };

  const handleReviewerMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredReviewerId(null);
  };

  return (
    <section className="mx-auto max-w-screen-xl bg-gray-100/50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              新しい問題
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              毎日新しい問題が追加されます。自分のレベルに合わせて挑戦してみましょう。
            </p>
          </div>
        </div>

        {/* 検索コントロールエリア - PCでは横並び */}
        <div className="mt-6 flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
          {/* <div className="w-full max-w-xs">
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="問題タイトルを検索..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div> */}

          {/* レベル選択タブ */}
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "ALL" ? "bg-white text-gray-950 shadow-sm" : ""
              }`}
              onClick={() => handleTabChange("ALL")}
            >
              すべて
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "BASIC" ? "bg-white text-gray-950 shadow-sm" : ""
              }`}
              onClick={() => handleTabChange("BASIC")}
            >
              基礎
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "ADVANCED"
                  ? "bg-white text-gray-950 shadow-sm"
                  : ""
              }`}
              onClick={() => handleTabChange("ADVANCED")}
            >
              応用
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "REAL_WORLD"
                  ? "bg-white text-gray-950 shadow-sm"
                  : ""
              }`}
              onClick={() => handleTabChange("REAL_WORLD")}
            >
              実務模擬
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2">
            <p className="text-xs font-bold text-gray-500">レビュワー</p>
            <div className="flex justify-center">
              <div className="flex max-w-full pb-2 pt-1 md:max-w-screen-md">
                <div className="flex gap-3 px-2">
                  {reviewers.map((reviewer) => (
                    <button
                      key={reviewer.id}
                      onClick={() => handleReviewerSelect(reviewer.id)}
                      className={`group relative flex min-w-[60px] flex-col items-center space-y-1 transition-transform hover:scale-105 ${
                        selectedReviewerId === reviewer.id ? "scale-105" : ""
                      }`}
                      onMouseEnter={() => handleReviewerMouseEnter(reviewer.id)}
                      onMouseLeave={handleReviewerMouseLeave}
                    >
                      <div
                        className={`relative size-12 overflow-hidden rounded-full border-2 ${
                          selectedReviewerId === reviewer.id
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={reviewer.profileImageUrl}
                          alt={reviewer.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-center text-xs font-medium">
                        {reviewer.name}
                      </span>
                      <div
                        className={`absolute bottom-[105%] z-[999] mb-2 w-[240px] rounded-lg bg-gray-900 p-3 text-left text-sm text-white transition-opacity duration-200 ${
                          hoveredReviewerId === reviewer.id
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                        }`}
                      >
                        <p className="font-bold">{reviewer.name}</p>
                        <p className="mt-1 text-xs text-gray-300">
                          {reviewer.bio}
                        </p>
                        <p className="mt-1 text-xs text-blue-300">
                          問題数: {reviewer.questionCount}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 現在の検索条件の表示 - よりコンパクトに */}
        {(searchTitle || selectedReviewerId > 0 || activeTab !== "ALL") && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {searchTitle && (
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
                <span className="mr-1">検索:</span>
                <span className="max-w-[120px] truncate font-medium">
                  {searchTitle}
                </span>
                <button
                  onClick={() => {
                    handleSearchInputChange("");
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            )}

            {selectedReviewerId > 0 && (
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                <span className="mr-1">レビュワー:</span>
                <span className="font-medium">
                  {reviewers.find((r) => r.id === selectedReviewerId)?.name}
                </span>
                <button
                  onClick={() => handleReviewerSelect(0)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            )}

            {activeTab !== "ALL" && (
              <div className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">
                <span className="mr-1">レベル:</span>
                <span className="font-medium">
                  {activeTab === "BASIC"
                    ? "基礎"
                    : activeTab === "ADVANCED"
                    ? "応用"
                    : "実務模擬"}
                </span>
                <button
                  onClick={() => handleTabChange("ALL")}
                  className="ml-1 text-yellow-500 hover:text-yellow-700"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* 問題一覧 */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>

          {/* ページネーション - さらに読み込むボタン */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="rounded-md bg-gray-200 px-6 py-2 text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "読み込み中..." : "さらに読み込む"}
              </button>
            </div>
          )}

          {/* 検索結果がない場合 */}
          {questions.length === 0 && !isLoading && (
            <div className="mt-8 text-center text-gray-500">
              問題が見つかりませんでした。検索条件を変更してみてください。
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
