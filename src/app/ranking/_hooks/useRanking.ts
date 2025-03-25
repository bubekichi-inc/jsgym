"use client";

import { useFetch } from "../../_hooks/useFetch";
import type { RankingResponse, PeriodType } from "@/app/api/ranking/route";

export const useRanking = (period: PeriodType) => {
  const { data, error, isLoading, mutate } = useFetch<RankingResponse>(
    `/api/ranking?period=${period}`
  );

  return {
    rankings: data?.rankings || [],
    currentUserRank: data?.currentUserRank,
    error,
    isLoading,
    mutate,
  };
};
