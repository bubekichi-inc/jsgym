"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../../_hooks/useFetch";
import {
  AdminUsersResponse,
  AdminUsersQuery,
} from "../../../api/admin/users/route";

export const useAdminUsers = () => {
  const [queryParams, setQueryParams] = useState<AdminUsersQuery>({
    page: "1",
    limit: "25",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // クエリパラメータを文字列に変換
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.page) params.append("page", queryParams.page);
    if (queryParams.limit) params.append("limit", queryParams.limit);
    if (queryParams.search) params.append("search", queryParams.search);
    if (queryParams.sortBy) params.append("sortBy", queryParams.sortBy);
    if (queryParams.sortOrder)
      params.append("sortOrder", queryParams.sortOrder);

    return params.toString();
  }, [queryParams]);

  // データ取得
  const { data, error, isLoading, mutate } = useFetch<AdminUsersResponse>(
    `/api/admin/users?${buildQueryString()}`
  );

  // ページを変更
  const changePage = useCallback((page: number) => {
    setQueryParams((prev: AdminUsersQuery) => ({
      ...prev,
      page: page.toString(),
    }));
  }, []);

  // 検索条件を変更
  const changeSearch = useCallback((search: string) => {
    setQueryParams((prev: AdminUsersQuery) => ({ ...prev, search, page: "1" }));
  }, []);

  // 並び替え
  const changeSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
      setQueryParams((prev: AdminUsersQuery) => ({
        ...prev,
        sortBy,
        sortOrder,
      }));
    },
    []
  );

  // 表示件数を変更
  const changeLimit = useCallback((limit: string) => {
    setQueryParams((prev: AdminUsersQuery) => ({ ...prev, limit, page: "1" }));
  }, []);

  // 全条件クリア
  const clearFilters = useCallback(() => {
    setQueryParams({
      page: "1",
      limit: "25",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  // 現在のページ番号（数値型）
  const currentPage = parseInt(queryParams.page || "1");

  // 最大ページ数
  const maxPage = data
    ? Math.ceil(data.total / parseInt(queryParams.limit || "25"))
    : 0;

  return {
    users: data?.users || [],
    total: data?.total || 0,
    error,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSearch,
    changeSort,
    changeLimit,
    clearFilters,
    mutate,
  };
};
