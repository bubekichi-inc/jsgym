"use client";

import type { KPIResponse } from "../api/admin/kpi/route";
import { useFetch } from "./useFetch";

export const useKpi = () => {
  const { data, error, isLoading, mutate } =
    useFetch<KPIResponse>("/api/admin/kpi");

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
};
