"use client";

import { useCallback, useState } from "react";
import { useFetch } from "../useFetch";
import { toast } from "react-toastify";
import { api } from "../../_utils/api";
import { useRouter } from "next/navigation";
import { 
  ForumThreadsResponse, 
  CreateThreadRequest,
  CreateThreadResponse, 
  ThreadsQuery 
} from "../../api/forum/threads/route";
import { 
  ForumThreadResponse,
  UpdateThreadRequest,
  UpdateThreadResponse
} from "../../api/forum/threads/[threadId]/route";

interface UseForumThreadsProps {
  initialThreadId?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export const useForumThreads = (props?: UseForumThreadsProps) => {
  const { initialThreadId, categorySlug, page: initialPage = 1, limit: initialLimit = 20 } = props || {};
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // クエリパラメータを構築
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (categorySlug) params.append("categorySlug", categorySlug);
    
    return params.toString();
  }, [page, limit, categorySlug]);

  // スレッド一覧を取得
  const { data: threadsData, isLoading: isLoadingThreads, mutate: mutateThreads } = 
    useFetch<ForumThreadsResponse>(`/api/forum/threads?${buildQueryString()}`);

  // 特定のスレッドを取得
  const { data: threadData, isLoading: isLoadingThread, mutate: mutateThread } = 
    useFetch<ForumThreadResponse>(
      initialThreadId ? `/api/forum/threads/${initialThreadId}` : null
    );

  // スレッドを作成
  const createThread = useCallback(async (data: CreateThreadRequest) => {
    try {
      const response = await api.post<CreateThreadRequest, CreateThreadResponse>("/api/forum/threads", data);
      toast.success("スレッドが作成されました");
      await mutateThreads();
      return response;
    } catch (error) {
      console.error("スレッドの作成に失敗しました:", error);
      toast.error("スレッドの作成に失敗しました");
      throw error;
    }
  }, [mutateThreads]);

  // スレッドを更新
  const updateThread = useCallback(async (threadId: string, data: UpdateThreadRequest) => {
    try {
      const response = await api.put<UpdateThreadRequest, UpdateThreadResponse>(`/api/forum/threads/${threadId}`, data);
      toast.success("スレッドが更新されました");
      await Promise.all([
        mutateThreads(),
        initialThreadId === threadId ? mutateThread() : Promise.resolve()
      ]);
      return response;
    } catch (error) {
      console.error("スレッドの更新に失敗しました:", error);
      toast.error("スレッドの更新に失敗しました");
      throw error;
    }
  }, [mutateThreads, mutateThread, initialThreadId]);

  // スレッドを削除
  const deleteThread = useCallback(async (threadId: string) => {
    if (!confirm("このスレッドを削除しますか？関連するすべての投稿も削除されます。")) {
      return false;
    }

    try {
      await api.del(`/api/forum/threads/${threadId}`);
      toast.success("スレッドが削除されました");
      
      if (initialThreadId === threadId) {
        // 表示中のスレッドが削除された場合はフォーラムトップに戻る
        router.push("/forum");
      } else {
        // 一覧の更新
        await mutateThreads();
      }
      
      return true;
    } catch (error) {
      console.error("スレッドの削除に失敗しました:", error);
      toast.error("スレッドの削除に失敗しました");
      return false;
    }
  }, [mutateThreads, initialThreadId, router]);

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
    // スレッド一覧
    threads: threadsData?.threads || [],
    pagination: threadsData?.pagination || { total: 0, page, limit, totalPages: 0 },
    isLoadingThreads,
    mutateThreads,
    
    // 特定のスレッド
    thread: threadData?.thread,
    isLoadingThread,
    mutateThread,
    
    // スレッド管理関数
    createThread,
    updateThread,
    deleteThread,
    
    // ページネーション
    page,
    limit,
    changePage,
    changeLimit,
  };
};