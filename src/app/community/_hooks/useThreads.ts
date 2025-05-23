"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../_hooks/useFetch";
import { CommunityThreadsQuery, CommunityThreadsResponse } from "../../api/community/threads/route";
import { api } from "@/app/_utils/api";
import { useRouter, useSearchParams } from "next/navigation";

interface UseThreadsProps {
  categoryId?: string;
  categorySlug?: string;
}

export const useThreads = ({ categoryId, categorySlug }: UseThreadsProps = {}) => {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page") || "1");
  
  const router = useRouter();

  const [queryParams, setQueryParams] = useState<CommunityThreadsQuery>({
    categoryId,
    categorySlug,
    page: String(initialPage),
    limit: "10",
    search: initialSearch,
  });

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.categoryId) {
      params.append("categoryId", queryParams.categoryId);
    } else if (queryParams.categorySlug) {
      params.append("categorySlug", queryParams.categorySlug);
    }

    if (queryParams.page) {
      params.append("page", queryParams.page);
    }

    if (queryParams.limit) {
      params.append("limit", queryParams.limit);
    }

    if (queryParams.search) {
      params.append("search", queryParams.search);
    }

    return params.toString();
  }, [queryParams]);

  const { data, error, isLoading, mutate } = useFetch<CommunityThreadsResponse>(
    `/api/community/threads?${buildQueryString()}`
  );

  // Set search parameter
  const setSearch = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: "1" }));
    updateUrl(search, 1);
  }, []);

  // Set page parameter
  const setPage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page: String(page) }));
    updateUrl(queryParams.search || "", page);
  }, [queryParams.search]);

  // Update URL with search and page parameters
  const updateUrl = useCallback((search: string, page: number) => {
    const params = new URLSearchParams();
    
    if (search) {
      params.append("search", search);
    }
    
    if (page > 1) {
      params.append("page", String(page));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "";
    router.push(newUrl);
  }, [router]);

  return {
    threads: data?.threads || [],
    pagination: data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    error,
    isLoading,
    search: queryParams.search || "",
    currentPage: Number(queryParams.page || "1"),
    setSearch,
    setPage,
    mutate,
  };
};