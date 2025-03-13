"use client";

import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { QuestionCard } from "@/app/_components/QuestionCard";
import { useFetch } from "@/app/_hooks/useFetch";
import { Question } from "@/app/api/questions/route";

export default function BookmarksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { data, error } = useFetch<{ questions: Question[] }>(
    "/api/bookmark_questions"
  );

  useEffect(() => {
    if (data || error) {
      setIsLoading(false);
    }
  }, [data, error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-lg font-bold md:text-2xl">
        ブックマークした問題
      </h1>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>エラーが発生しました。再度お試しください。</p>
        </div>
      ) : data?.questions.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            ブックマークがありません
          </h2>
          <p className="text-gray-600">
            <span>問題ページでブックマークボタン</span>
            <FontAwesomeIcon
              icon={faBookmark}
              className="mx-1 text-yellow-500"
            />
            <span>を押すと、ここに表示されます。</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
