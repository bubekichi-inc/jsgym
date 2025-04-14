"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../../_hooks/useFetch";
import {
  AdminAnswerFilesResponse,
  AdminAnswerFilesQuery,
} from "../../../api/admin/answer_files/route";

export const useAdminAnswerFiles = () => {
  const [queryParams, setQueryParams] = useState<AdminAnswerFilesQuery>({
    page: "1",
    limit: "50",  // デフォルトで50件表示
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.page) params.append("page", queryParams.page);
    if (queryParams.limit) params.append("limit", queryParams.limit);
    if (queryParams.sortBy) params.append("sortBy", queryParams.sortBy);
    if (queryParams.sortOrder)
      params.append("sortOrder", queryParams.sortOrder);

    return params.toString();
  }, [queryParams]);

  const { data, error, isLoading, mutate } = useFetch<AdminAnswerFilesResponse>(
    `/api/admin/answer_files?${buildQueryString()}`
  );

  const changePage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page.toString() }));
  }, []);

  const changeSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
      setQueryParams((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  const changeLimit = useCallback((limit: string) => {
    setQueryParams((prev) => ({ ...prev, limit, page: "1" }));
  }, []);

  const currentPage = parseInt(queryParams.page || "1");

  const maxPage = data
    ? Math.ceil(data.total / parseInt(queryParams.limit || "50"))
    : 0;

  return {
    answerFiles: data?.answerFiles || [],
    total: data?.total || 0,
    error,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSort,
    changeLimit,
    mutate,
  };
};
