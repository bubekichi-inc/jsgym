"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../_utils/api";
import { useFetch } from "./useFetch";

interface MemoResponse {
  memo: string;
}

export const useUserMemo = () => {
  const [memo, setMemo] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data, error, isLoading, mutate } =
    useFetch<MemoResponse>("/api/memo");

  useEffect(() => {
    if (data && data.memo !== undefined) {
      setMemo(data.memo);
    }
  }, [data]);

  // 独自のdebounce実装
  const saveMemo = useCallback(
    async (memoText: string) => {
      try {
        // 前回のタイマーがあればクリア
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // 新しいタイマーをセット
        timerRef.current = setTimeout(async () => {
          setIsSaving(true);
          try {
            await api.put<{ memo: string }, MemoResponse>("/api/memo", {
              memo: memoText,
            });
            setLastSaved(new Date());
            await mutate();
          } finally {
            setIsSaving(false);
            timerRef.current = null;
          }
        }, 1000);
      } catch (error) {
        console.error("メモの保存に失敗しました:", error);
        setIsSaving(false);
      }
    },
    [mutate]
  );

  const updateMemo = useCallback(
    (newMemo: string) => {
      setMemo(newMemo);
      saveMemo(newMemo);
    },
    [saveMemo]
  );

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    memo,
    updateMemo,
    isLoading,
    error,
    isSaving,
    lastSaved,
  };
};
