"use client";

import { useCallback, useState, useMemo } from "react";
import { useFetch } from "../../_hooks/useFetch";
import { CommunityPostsQuery, CommunityPostsResponse } from "../../api/community/posts/route";

interface UsePostsWithRepliesProps {
  threadId?: string;
}

interface PostWithReplies {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  threadId: string;
  parentId: string | null;
  user: {
    id: string;
    name: string | null;
    iconUrl: string | null;
  };
  reactions: {
    kind: string;
    count: number;
    userReacted: boolean;
  }[];
  replyCount: number;
  replies?: PostWithReplies[];
}

export const usePostsWithReplies = ({ threadId }: UsePostsWithRepliesProps = {}) => {
  const [page, setPage] = useState(1);
  const limit = 20;

  // Build query string for main posts
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (threadId) {
      params.append("threadId", threadId);
      params.append("parentId", "null"); // Only get top-level posts
    }

    params.append("page", String(page));
    params.append("limit", String(limit));

    return params.toString();
  }, [threadId, page]);

  // Fetch main posts
  const { data: mainPostsData, error, isLoading, mutate } = useFetch<CommunityPostsResponse>(
    threadId ? `/api/community/posts?${buildQueryString()}` : ""
  );

  // Fetch all replies for the thread
  const buildRepliesQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (threadId) {
      params.append("threadId", threadId);
      params.append("limit", "1000"); // Get all replies
    }
    return params.toString();
  }, [threadId]);

  const { data: allRepliesData } = useFetch<CommunityPostsResponse>(
    threadId ? `/api/community/posts?${buildRepliesQueryString()}` : ""
  );

  // Organize posts with their replies
  const postsWithReplies = useMemo(() => {
    if (!mainPostsData?.posts || !allRepliesData?.posts) {
      return [];
    }

    const mainPosts = mainPostsData.posts;
    const allReplies = allRepliesData.posts.filter(post => post.parentId !== null);

    // Group replies by parent ID
    const repliesByParent = allReplies.reduce((acc, reply) => {
      if (!reply.parentId) return acc;
      
      if (!acc[reply.parentId]) {
        acc[reply.parentId] = [];
      }
      acc[reply.parentId].push(reply);
      return acc;
    }, {} as Record<string, typeof allReplies>);

    // Add replies to main posts
    return mainPosts.map(post => ({
      ...post,
      replies: repliesByParent[post.id] || []
    })) as PostWithReplies[];
  }, [mainPostsData, allRepliesData]);

  return {
    posts: postsWithReplies,
    pagination: mainPostsData?.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 },
    error,
    isLoading,
    currentPage: page,
    setPage,
    mutate: () => {
      mutate();
      // We could also add a separate mutate for replies if needed
    },
  };
};
