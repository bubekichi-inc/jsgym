"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../../_hooks/useFetch";
import { AdminAnswersResponse } from "../../../api/admin/answers/route";

export interface AdminAnswersQuery {
  page?: string;
  limit?: string;
  search?: string;
  result?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useAdminAnswers = () => {
  const [queryParams, setQueryParams] = useState<AdminAnswersQuery>({
    page: "1",
    limit: "50",
    search: "",
    result: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.page) params.append("page", queryParams.page);
    if (queryParams.limit) params.append("limit", queryParams.limit);
    if (queryParams.search) params.append("search", queryParams.search);
    if (queryParams.result) params.append("result", queryParams.result);
    if (queryParams.sortBy) params.append("sortBy", queryParams.sortBy);
    if (queryParams.sortOrder)
      params.append("sortOrder", queryParams.sortOrder);

    return params.toString();
  }, [queryParams]);

  const { data, error, isLoading, mutate } = useFetch<AdminAnswersResponse>(
    `/api/admin/answers?${buildQueryString()}`
  );

  const changePage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page.toString() }));
  }, []);

  const changeSearch = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: "1" }));
  }, []);

  const changeResult = useCallback((result: string) => {
    setQueryParams((prev) => ({ ...prev, result, page: "1" }));
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

  const clearFilters = useCallback(() => {
    setQueryParams({
      page: "1",
      limit: "50",
      search: "",
      result: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  const currentPage = parseInt(queryParams.page || "1");

  const maxPage = data
    ? Math.ceil(data.total / parseInt(queryParams.limit || "50"))
    : 0;

  return {
    answers: data?.answers || [],
    total: data?.total || 0,
    error,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSearch,
    changeResult,
    changeSort,
    changeLimit,
    clearFilters,
    mutate,
  };
};
