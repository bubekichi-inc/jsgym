"use client";

import { UserQuestionStatus } from "@prisma/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { QuestionCard } from "@/app/_components/QuestionCard";
import { useDevice } from "@/app/_hooks/useDevice";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { QuestionLevel } from "@/app/_serevices/AIQuestionGenerateService";

// 拡張ステータス型
type ExtendedStatus = UserQuestionStatus | "NOT_SUBMITTED" | "ALL";

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
  const initialStatus = (searchParams.get("status") as ExtendedStatus) || "ALL";

  const [hoveredReviewerId, setHoveredReviewerId] = useState<number | null>(
    null
  );
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isSp } = useDevice();
  const { data: me } = useMe();

  const {
    questions,
    reviewers,
    activeTab,
    selectedReviewerId,
    selectedStatus,
    hasMore,
    isLoading,
    handleTabChange,
    handleReviewerSelect,
    handleStatusChange,
    handleLoadMore,
  } = useQuestions({
    limit,
    initialTitle,
    initialTab,
    initialReviewerId,
    initialStatus,
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
    <section className="mx-auto max-w-screen-xl bg-gray-100/50 py-4 md:py-12">
      <div className="container mx-auto space-y-6 px-4 md:space-y-20 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter">問題一覧</h2>
            <p className="text-sm text-gray-500">
              毎日新しい問題が追加されます。自分のレベルに合わせて挑戦してみましょう。
            </p>
          </div>
        </div>

        <div className="">
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

            <div className="space-y-3">
              {/* レベル選択タブ */}
              <div className="flex items-center gap-4 rounded-md bg-white px-4">
                {!isSp && (
                  <p className="text-xs font-bold text-gray-500">レベル</p>
                )}
                <div className="flex h-10 items-center justify-center rounded-md p-1 text-gray-500">
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      activeTab === "ALL"
                        ? "bg-blue-100 text-blue-800 shadow-sm"
                        : ""
                    }`}
                    onClick={() => handleTabChange("ALL")}
                  >
                    すべて
                  </button>
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      activeTab === "BASIC"
                        ? "bg-blue-100 text-blue-800 shadow-sm"
                        : ""
                    }`}
                    onClick={() => handleTabChange("BASIC")}
                  >
                    基礎
                  </button>
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      activeTab === "ADVANCED"
                        ? "bg-blue-100 text-blue-800 shadow-sm"
                        : ""
                    }`}
                    onClick={() => handleTabChange("ADVANCED")}
                  >
                    応用
                  </button>
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      activeTab === "REAL_WORLD"
                        ? "bg-blue-100 text-blue-800 shadow-sm"
                        : ""
                    }`}
                    onClick={() => handleTabChange("REAL_WORLD")}
                  >
                    実務模擬
                  </button>
                </div>
              </div>

              {/* ステータス選択タブ */}
              {me && (
                <div className="flex items-center gap-4 rounded-md bg-white px-4">
                  {!isSp && (
                    <p className="text-xs font-bold text-gray-500">
                      ステータス
                    </p>
                  )}
                  <div className="flex h-10 items-center justify-center rounded-md p-1 text-gray-500">
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        selectedStatus === "ALL"
                          ? "bg-blue-100 text-blue-800 shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleStatusChange("ALL")}
                    >
                      すべて
                    </button>
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        selectedStatus === "NOT_SUBMITTED"
                          ? "bg-blue-100 text-blue-800 shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleStatusChange("NOT_SUBMITTED")}
                    >
                      未提出
                    </button>
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        selectedStatus === "PASSED"
                          ? "bg-blue-100 text-blue-800 shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleStatusChange("PASSED")}
                    >
                      合格済み
                    </button>
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        selectedStatus === "REVISION_REQUIRED"
                          ? "bg-blue-100 text-blue-800 shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleStatusChange("REVISION_REQUIRED")}
                    >
                      再提出
                    </button>
                    <button
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        selectedStatus === "DRAFT"
                          ? "bg-blue-100 text-blue-800 shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleStatusChange("DRAFT")}
                    >
                      下書き
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 rounded-md bg-white py-2 md:flex-row md:px-4">
              {!isSp && (
                <p className="text-xs font-bold text-gray-500">レビュワー</p>
              )}
              <div className="flex justify-center">
                <div className="flex max-w-full pb-2 pt-1 md:max-w-screen-md">
                  <div className="flex gap-3 px-2">
                    {reviewers.map((reviewer) => (
                      <button
                        key={reviewer.id}
                        onClick={() => handleReviewerSelect(reviewer.id)}
                        className={`group relative flex min-w-[60px] flex-col items-center space-y-1 transition-transform hover:scale-110 ${
                          selectedReviewerId === reviewer.id ? "scale-110" : ""
                        }`}
                        onMouseEnter={() =>
                          handleReviewerMouseEnter(reviewer.id)
                        }
                        onMouseLeave={handleReviewerMouseLeave}
                      >
                        <div
                          className={`relative size-12 overflow-hidden rounded-full border-2 ${
                            selectedReviewerId === reviewer.id
                              ? "border-2 border-blue-500"
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
                        <span className="whitespace-nowrap text-center text-xs font-medium">
                          {reviewer.name}
                        </span>
                        {!isSp && (
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
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
