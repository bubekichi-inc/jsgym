"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useFetch } from "@/app/_hooks/useFetch";
import { api } from "@/app/_utils/api";

export const BookmarkButton: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data, mutate } = useFetch<{ bookmark: boolean }>(
    `/api/questions/${questionId}/bookmark`
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!data) return null;

  const isBookmarked = data?.bookmark;

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true);
      if (isBookmarked) {
        await api.del(`/api/questions/${questionId}/bookmark`);
      } else {
        await api.post(`/api/questions/${questionId}/bookmark`, {});
      }
      // データを再取得して状態を更新
      await mutate();
    } catch (error) {
      console.error("ブックマークの更新に失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-md p-1 transition-colors ${
        isLoading ? "cursor-not-allowed opacity-50" : ""
      }`}
      aria-label={isBookmarked ? "ブックマークを解除" : "ブックマークに追加"}
      title={isBookmarked ? "ブックマークを解除" : "ブックマークに追加"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`size-6 ${
          isBookmarked ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
};
