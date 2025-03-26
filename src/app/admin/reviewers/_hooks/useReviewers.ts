"use client";
import { Reviewer } from "@prisma/client";
import { useFetch } from "@/app/_hooks/useFetch";

// レビュワー一覧を取得するためのhook
export const useReviewers = () => {
  const { data, error, isLoading, mutate } = useFetch<{
    reviewers: Reviewer[];
  }>("/api/admin/reviewers");

  return {
    reviewers: data?.reviewers || [],
    isLoading,
    error,
    mutate,
  };
};

// 特定のレビュワーを取得するためのhook
export const useReviewer = (reviewerId: number) => {
  const { data, error, isLoading, mutate } = useFetch<{
    reviewer: Reviewer;
  }>(`/api/admin/reviewers/${reviewerId}`);

  return {
    reviewer: data?.reviewer,
    isLoading,
    error,
    mutate,
  };
};
