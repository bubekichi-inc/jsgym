"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../../../_hooks/useFetch";
import { api } from "../../../../_utils/api";

// 問題データの型定義
export type AdminQuestionResponse = {
  question: {
    id: string;
    title: string;
    content: string;
    inputCode: string;
    outputCode: string;
    level: "BASIC" | "ADVANCED" | "REAL_WORLD";
    type: "JAVA_SCRIPT" | "TYPE_SCRIPT" | "REACT_JS" | "REACT_TS";
    reviewerId: number;
  };
  questionFiles: {
    id: string;
    questionId: string;
    name: string;
    ext: "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";
    exampleAnswer: string;
    template: string;
    isRoot: boolean;
  }[];
  tags: {
    id: string;
    tagId: number;
    name: string;
  }[];
};

// 問題更新用のリクエスト型
export type UpdateQuestionRequest = {
  title: string;
  content: string;
  inputCode: string;
  outputCode: string;
  level: "BASIC" | "ADVANCED" | "REAL_WORLD";
  type: "JAVA_SCRIPT" | "TYPE_SCRIPT" | "REACT_JS" | "REACT_TS";
  reviewerId: number;
  questionFiles: {
    id?: string;
    name: string;
    ext: "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";
    exampleAnswer: string;
    template: string;
    isRoot: boolean;
  }[];
  tagIds: number[];
};

export const useAdminQuestion = (questionId: string) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 問題データを取得
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useFetch<AdminQuestionResponse>(`/api/admin/questions/${questionId}`);

  // 問題を更新
  const updateQuestion = async (updateData: UpdateQuestionRequest) => {
    setIsUpdating(true);
    setError(null);
    try {
      await api.put(`/api/admin/questions/${questionId}`, updateData);
      toast.success("問題を更新しました");
      await mutate();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("問題の更新に失敗しました:", error);
        setError(error.message || "問題の更新に失敗しました");
        return false;
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // 問題を削除
  const deleteQuestion = async () => {
    if (!confirm("本当にこの問題を削除しますか？この操作は元に戻せません。")) {
      return false;
    }

    setIsDeleting(true);
    setError(null);
    try {
      await api.delete(`/api/admin/questions/${questionId}`);
      router.push("/admin/questions");
      toast.success("問題を削除しました");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("問題の削除に失敗しました:", error);
        setError(error.message || "問題の削除に失敗しました");
        return false;
      }
      console.error("問題の削除に失敗しました:", error);
      setError("問題の削除に失敗しました");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    question: data?.question,
    questionFiles: data?.questionFiles || [],
    tags: data?.tags || [],
    isLoading,
    error: fetchError || error,
    isUpdating,
    isDeleting,
    updateQuestion,
    deleteQuestion,
  };
};
