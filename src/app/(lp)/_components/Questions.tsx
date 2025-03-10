"use client";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import {
  lessonLevelMap,
  lessonTextMap,
  questionTagTextMap,
  userQuestionColorMap,
  userQuestionTextMap,
} from "@/app/_constants";
import { QuestionLevel } from "@/app/_serevices/AIQuestionGenerateService";
import { api } from "@/app/_utils/api";
import { Question } from "@/app/api/questions/route";
import { Reviewer } from "@/app/api/reviewers/route";

// 拡張されたuseFetchフック - 動的なクエリパラメータに対応
function useQuestionsApi<T>(
  baseUrl: string,
  params: Record<string, string | number>,
  config?: any
) {
  // パラメータからキーを生成
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  const fetcher = async () => await api.get<T>(url);

  return useSWR<T>(url, fetcher, config);
}

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

  const [activeTab, setActiveTab] = useState<QuestionLevel | "ALL">(initialTab);
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [selectedReviewerId, setSelectedReviewerId] =
    useState<number>(initialReviewerId);
  const [offset, setOffset] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // レビュワー一覧を取得
  const { data: reviewersData } = useSWR<{ reviewers: Reviewer[] }>(
    "/api/reviewers",
    api.get
  );
  const reviewers = reviewersData?.reviewers || [];

  // 検索パラメータ
  const queryParams = {
    limit,
    offset,
    title: searchTitle,
    lessonId: activeTab !== "ALL" ? lessonLevelMap[activeTab] : "",
    reviewerId: selectedReviewerId || "",
  };

  // 問題一覧を取得
  const { data: questionsData, isLoading } = useQuestionsApi<{
    questions: Question[];
    pagination: {
      total: number;
      offset: number;
      limit: number;
      hasMore: boolean;
    };
  }>("/api/questions/", queryParams, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  // データが取得できたらstateを更新
  useEffect(() => {
    if (questionsData) {
      // 初回ロードかページネーションかを判断
      if (offset === 0) {
        setQuestions(questionsData.questions);
      } else {
        setQuestions((prev) => [...prev, ...questionsData.questions]);
      }
      setHasMore(questionsData.pagination.hasMore);
    }
  }, [questionsData, offset]);

  // URLを更新する関数
  const updateUrl = useCallback(
    (title: string, tab: QuestionLevel | "ALL", reviewerId: number) => {
      const params = new URLSearchParams();

      if (title) {
        params.append("title", title);
      }

      if (tab !== "ALL") {
        params.append("tab", tab);
      }

      if (reviewerId > 0) {
        params.append("reviewerId", reviewerId.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;

      // pushStateを使用してURLを更新（ページリロードなし）
      window.history.pushState({}, "", url);
      console.log("URL updated:", url);
    },
    []
  );

  // 検索入力のハンドラ
  const handleSearchInputChange = useCallback(
    (value: string) => {
      setSearchTitle(value);
      setOffset(0); // 検索時はoffsetリセット
      updateUrl(value, activeTab, selectedReviewerId);
    },
    [activeTab, selectedReviewerId, updateUrl]
  );

  // タブ切り替え
  const handleTabChange = useCallback(
    (tab: QuestionLevel | "ALL") => {
      // 同じタブを選択した場合は何もしない
      if (tab === activeTab) return;

      console.log("Tab changed:", tab);
      setActiveTab(tab);
      setOffset(0); // タブ切替時はoffsetリセット

      // レビュワー選択はリセットしない（組み合わせて検索できるように）
      updateUrl(searchTitle, tab, selectedReviewerId);
    },
    [activeTab, searchTitle, selectedReviewerId, updateUrl]
  );

  // レビュワー選択
  const handleReviewerSelect = useCallback(
    (reviewerId: number) => {
      console.log("Reviewer selected:", reviewerId);

      // 同じレビュワーを選択した場合は選択解除
      const newReviewerId = reviewerId === selectedReviewerId ? 0 : reviewerId;
      console.log("New reviewer ID:", newReviewerId);

      // 変更がない場合は何もしない
      if (newReviewerId === selectedReviewerId) return;

      setSelectedReviewerId(newReviewerId);
      setOffset(0); // レビュワー変更時はoffsetリセット
      updateUrl(searchTitle, activeTab, newReviewerId);
    },
    [activeTab, searchTitle, selectedReviewerId, updateUrl]
  );

  // 追加ロード
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setOffset((prev) => prev + limit);
    }
  }, [hasMore, isLoading, limit]);

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
          {/* 検索バー */}
          <div className="w-full max-w-xs">
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="問題タイトルを検索..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

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
        </div>

        {/* レビュワー一覧 - スクロール可能なコンパクト表示 */}
        <div className="mt-6">
          <h3 className="mb-3 text-center text-sm font-bold text-gray-500">
            レビュワー
          </h3>
          <div className="flex justify-center">
            <div className="flex max-w-full pb-2 pt-1 md:max-w-screen-md">
              <div className="flex gap-3 px-2">
                {reviewers.map((reviewer) => (
                  <button
                    key={reviewer.id}
                    onClick={() => handleReviewerSelect(reviewer.id)}
                    className={`group flex min-w-[60px] flex-col items-center space-y-1 transition-transform hover:scale-105 ${
                      selectedReviewerId === reviewer.id ? "scale-105" : ""
                    }`}
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
                    <div className="invisible absolute bottom-[105%] z-[999] mb-2 w-[240px] rounded-lg bg-gray-900 p-3 text-left text-sm text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
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
                    setSearchTitle("");
                    updateUrl("", activeTab, selectedReviewerId);
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
              <div
                key={question.id}
                className="relative flex h-full flex-col rounded-lg border bg-white p-6 py-8 shadow-sm"
              >
                <div className="space-y-2 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="mb-1 text-sm">
                      <span className="text-gray-600">
                        {dayjs(question.createdAt).format("YYYY/MM/DD_HH:mm")}
                      </span>
                      <span>
                        {dayjs(question.createdAt).isSame(dayjs(), "day") && (
                          <span className="ml-2 inline-flex items-center rounded-full text-base font-bold text-red-600">
                            NEW
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                          question.lesson.id === lessonLevelMap["BASIC"]
                            ? "border-transparent bg-blue-500 text-white"
                            : question.lesson.id === lessonLevelMap["ADVANCED"]
                            ? "border-transparent bg-yellow-500 text-white"
                            : "border-transparent bg-red-500 text-white"
                        }`}
                      >
                        {
                          lessonTextMap[
                            question.lesson.id as keyof typeof lessonTextMap
                          ]
                        }
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{question.title}</h3>
                  <p className="line-clamp-2 text-gray-500">
                    {question.content}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="grow">
                    <div className="flex flex-wrap gap-2">
                      {question.questions.map((q) => (
                        <span
                          key={q.tag.name}
                          className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800 transition-colors"
                        >
                          {
                            questionTagTextMap[
                              q.tag.name as keyof typeof questionTagTextMap
                            ]
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                  {question.reviewer && (
                    <div className="group relative">
                      <button
                        onClick={() =>
                          handleReviewerSelect(question.reviewer.id)
                        }
                        className={`flex size-10 items-center justify-center overflow-hidden rounded-full ${
                          selectedReviewerId === question.reviewer.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                      >
                        <Image
                          src={question.reviewer.profileImageUrl}
                          alt="reviewer"
                          width={80}
                          height={80}
                          className="size-full object-cover"
                        />
                      </button>
                      <div className="invisible absolute -right-4 bottom-full z-10 mb-2 w-[320px] rounded-lg bg-gray-900 p-2 text-sm text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-300">
                            レビュワー
                          </span>
                          <p className="font-bold">{question.reviewer.name}</p>
                        </div>
                        <p className="mt-1 whitespace-pre-line text-xs text-gray-300">
                          {question.reviewer.bio}
                        </p>
                        <p className="mt-1 text-xs text-blue-300">
                          クリックしてこのレビュワーの問題をフィルター
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <Link
                    href={`/q/${question.id}`}
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    問題に挑戦する
                  </Link>
                </div>
                {question.userQuestions?.[0] && (
                  <div
                    className={`absolute left-0 top-0 rounded-br-lg rounded-tl-lg px-2 py-1 text-sm text-white ${
                      userQuestionColorMap[question.userQuestions?.[0].status]
                    }`}
                  >
                    {userQuestionTextMap[question.userQuestions?.[0].status]}
                  </div>
                )}
              </div>
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
