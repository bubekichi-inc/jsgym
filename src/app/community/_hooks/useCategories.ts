"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../_hooks/useFetch";
import { CommunityCategoriesQuery, CommunityCategoriesResponse } from "../../api/community/categories/route";
import { api } from "@/app/_utils/api";

export const useCategories = () => {
  const [queryParams, setQueryParams] = useState<CommunityCategoriesQuery>({
    search: "",
  });

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.search) {
      params.append("search", queryParams.search);
    }

    return params.toString();
  }, [queryParams]);

  const { data, error, isLoading, mutate } = useFetch<CommunityCategoriesResponse>(
    `/api/community/categories?${buildQueryString()}`
  );

  // Set search parameter
  const setSearch = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search }));
  }, []);

  return {
    categories: data?.categories || [],
    error,
    isLoading,
    search: queryParams.search,
    setSearch,
    mutate,
  };
};