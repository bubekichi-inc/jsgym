"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../../_hooks/useFetch";
import {
  AdminQuestionsResponse,
  AdminQuestionsQuery,
} from "../../../api/admin/questions/route";

export const useAdminQuestions = () => {
  const [queryParams, setQueryParams] = useState<AdminQuestionsQuery>({
    page: "1",
    limit: "25",
    search: "",
    level: "",
    type: "",
    reviewerId: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // クエリパラメータを文字列に変換
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.page) params.append("page", queryParams.page);
    if (queryParams.limit) params.append("limit", queryParams.limit);
    if (queryParams.search) params.append("search", queryParams.search);
    if (queryParams.level) params.append("level", queryParams.level);
    if (queryParams.type) params.append("type", queryParams.type);
    if (queryParams.reviewerId)
      params.append("reviewerId", queryParams.reviewerId);
    if (queryParams.sortBy) params.append("sortBy", queryParams.sortBy);
    if (queryParams.sortOrder)
      params.append("sortOrder", queryParams.sortOrder);

    return params.toString();
  }, [queryParams]);

  // データ取得
  const { data, error, isLoading, mutate } = useFetch<AdminQuestionsResponse>(
    `/api/admin/questions?${buildQueryString()}`
  );

  // ページを変更
  const changePage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page.toString() }));
  }, []);

  // 検索条件を変更
  const changeSearch = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: "1" }));
  }, []);

  // レベルで絞り込み
  const changeLevel = useCallback((level: string) => {
    setQueryParams((prev) => ({ ...prev, level, page: "1" }));
  }, []);

  // タイプで絞り込み
  const changeType = useCallback((type: string) => {
    setQueryParams((prev) => ({ ...prev, type, page: "1" }));
  }, []);

  // レビュアーで絞り込み
  const changeReviewer = useCallback((reviewerId: string) => {
    setQueryParams((prev) => ({ ...prev, reviewerId, page: "1" }));
  }, []);

  // 並び替え
  const changeSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
      setQueryParams((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  // 表示件数を変更
  const changeLimit = useCallback((limit: string) => {
    setQueryParams((prev) => ({ ...prev, limit, page: "1" }));
  }, []);

  // 全条件クリア
  const clearFilters = useCallback(() => {
    setQueryParams({
      page: "1",
      limit: "10",
      search: "",
      level: "",
      type: "",
      reviewerId: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  // 現在のページ番号（数値型）
  const currentPage = parseInt(queryParams.page || "1");

  // 最大ページ数
  const maxPage = data
    ? Math.ceil(data.total / parseInt(queryParams.limit || "10"))
    : 0;

  return {
    questions: data?.questions || [],
    total: data?.total || 0,
    error,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSearch,
    changeLevel,
    changeType,
    changeReviewer,
    changeSort,
    changeLimit,
    clearFilters,
    mutate,
  };
};
