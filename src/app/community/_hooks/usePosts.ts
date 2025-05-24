"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../../_hooks/useFetch";
import { CommunityPostsQuery, CommunityPostsResponse } from "../../api/community/posts/route";
import { api } from "@/app/_utils/api";

interface UsePostsProps {
  threadId?: string;
  parentId?: string;
}

export const usePosts = ({ threadId, parentId }: UsePostsProps = {}) => {
  const [queryParams, setQueryParams] = useState<CommunityPostsQuery>({
    threadId,
    parentId,
    page: "1",
    limit: "20",
  });

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (queryParams.threadId) {
      params.append("threadId", queryParams.threadId);
    }

    if (queryParams.parentId) {
      params.append("parentId", queryParams.parentId);
    }

    if (queryParams.page) {
      params.append("page", queryParams.page);
    }

    if (queryParams.limit) {
      params.append("limit", queryParams.limit);
    }

    return params.toString();
  }, [queryParams]);

  const { data, error, isLoading, mutate } = useFetch<CommunityPostsResponse>(
    `/api/community/posts?${buildQueryString()}`
  );

  // Set page parameter
  const setPage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page: String(page) }));
  }, []);

  // Set parent ID parameter (for viewing replies)
  const setParentId = useCallback((parentId: string | undefined) => {
    setQueryParams((prev) => ({ ...prev, parentId, page: "1" }));
  }, []);

  return {
    posts: data?.posts || [],
    pagination: data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 },
    error,
    isLoading,
    currentPage: Number(queryParams.page || "1"),
    setPage,
    setParentId,
    mutate,
  };
};