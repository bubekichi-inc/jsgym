"use client";

import { useFetch } from "../../../_hooks/useFetch";
import type { DashboardResponse } from "../../../api/dashboard/route";

export const useDashboard = () => {
  return useFetch<DashboardResponse>("/api/dashboard");
};
