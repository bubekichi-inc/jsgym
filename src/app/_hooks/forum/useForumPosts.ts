"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../useFetch";
import { toast } from "react-toastify";
import { api } from "../../_utils/api";
import { 
  ForumPostsResponse, 
  CreatePostRequest,
  CreatePostResponse
} from "../../api/forum/threads/[threadId]/posts/route";
import { 
  UpdatePostRequest,
  UpdatePostResponse
} from "../../api/forum/posts/[postId]/route";
import {
  AddReactionRequest,
  AddReactionResponse
} from "../../api/forum/posts/[postId]/reactions/route";

interface UseForumPostsProps {
  threadId?: string;
  page?: number;
  limit?: number;
}

export const useForumPosts = (props?: UseForumPostsProps) => {
  const { threadId, page: initialPage = 1, limit: initialLimit = 50 } = props || {};
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // クエリパラメータを構築
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    
    return params.toString();
  }, [page, limit]);

  // 投稿一覧を取得
  const { data: postsData, isLoading: isLoadingPosts, mutate: mutatePosts } = 
    useFetch<ForumPostsResponse>(
      threadId ? `/api/forum/threads/${threadId}/posts?${buildQueryString()}` : null
    );

  // 投稿を作成（スレッドへの投稿または返信）
  const createPost = useCallback(async (data: CreatePostRequest) => {
    if (!threadId) {
      throw new Error("threadId is required");
    }

    try {
      const response = await api.post<CreatePostRequest, CreatePostResponse>(
        `/api/forum/threads/${threadId}/posts`, 
        data
      );
      toast.success("投稿が作成されました");
      await mutatePosts();
      return response;
    } catch (error) {
      console.error("投稿の作成に失敗しました:", error);
      toast.error("投稿の作成に失敗しました");
      throw error;
    }
  }, [threadId, mutatePosts]);

  // 投稿を更新
  const updatePost = useCallback(async (postId: string, data: UpdatePostRequest) => {
    try {
      const response = await api.put<UpdatePostRequest, UpdatePostResponse>(
        `/api/forum/posts/${postId}`, 
        data
      );
      toast.success("投稿が更新されました");
      await mutatePosts();
      return response;
    } catch (error) {
      console.error("投稿の更新に失敗しました:", error);
      toast.error("投稿の更新に失敗しました");
      throw error;
    }
  }, [mutatePosts]);

  // 投稿を削除
  const deletePost = useCallback(async (postId: string) => {
    if (!confirm("この投稿を削除しますか？")) {
      return false;
    }

    try {
      await api.del(`/api/forum/posts/${postId}`);
      toast.success("投稿が削除されました");
      await mutatePosts();
      return true;
    } catch (error) {
      console.error("投稿の削除に失敗しました:", error);
      toast.error("投稿の削除に失敗しました");
      return false;
    }
  }, [mutatePosts]);

  // リアクションを追加
  const addReaction = useCallback(async (postId: string, data: AddReactionRequest) => {
    try {
      const response = await api.post<AddReactionRequest, AddReactionResponse>(
        `/api/forum/posts/${postId}/reactions`, 
        data
      );
      await mutatePosts();
      return response;
    } catch (error) {
      console.error("リアクションの追加に失敗しました:", error);
      toast.error("リアクションの追加に失敗しました");
      throw error;
    }
  }, [mutatePosts]);

  // リアクションを削除
  const removeReaction = useCallback(async (postId: string, kind: string) => {
    try {
      await api.del(`/api/forum/posts/${postId}/reactions?kind=${kind}`);
      await mutatePosts();
      return true;
    } catch (error) {
      console.error("リアクションの削除に失敗しました:", error);
      toast.error("リアクションの削除に失敗しました");
      return false;
    }
  }, [mutatePosts]);

  // ページを変更
  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 表示件数を変更
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // ページをリセット
  }, []);

  return {
    // 投稿一覧
    posts: postsData?.posts || [],
    pagination: postsData?.pagination || { total: 0, page, limit, totalPages: 0 },
    isLoadingPosts,
    mutatePosts,
    
    // 投稿管理関数
    createPost,
    updatePost,
    deletePost,
    
    // リアクション関数
    addReaction,
    removeReaction,
    
    // ページネーション
    page,
    limit,
    changePage,
    changeLimit,
  };
};