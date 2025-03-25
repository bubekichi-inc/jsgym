"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/app/_utils/api";
import { QuestionFormData } from "@/app/admin/questions/_components/QuestionForm";

// 新規問題作成用のリクエスト型
export type CreateQuestionRequest = {
  title: string;
  content: string;
  inputCode: string;
  outputCode: string;
  level: "BASIC" | "ADVANCED" | "REAL_WORLD";
  type: "JAVA_SCRIPT" | "TYPE_SCRIPT" | "REACT_JS" | "REACT_TS";
  reviewerId: number;
  questionFiles: {
    name: string;
    ext: "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";
    exampleAnswer: string;
    template: string;
    isRoot: boolean;
  }[];
  tagIds: number[];
};

export const useCreateQuestion = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // デフォルトの問題データ
  const defaultQuestionData: QuestionFormData = {
    title: "",
    content: "",
    inputCode: "",
    outputCode: "",
    level: "BASIC",
    type: "JAVA_SCRIPT",
    reviewerId: 1,
    questionFiles: [
      {
        name: "index",
        ext: "JS",
        exampleAnswer: "// 解答例を入力してください",
        template: "// テンプレートを入力してください",
        isRoot: true,
      },
    ],
    tagIds: [],
  };

  // 問題を作成
  const createQuestion = async (formData: QuestionFormData) => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await api.post<{ questionId: string }>(
        "/api/admin/questions",
        formData
      );

      toast.success("問題を作成しました");

      // 作成した問題の編集ページにリダイレクト
      if (response.questionId) {
        router.push(`/admin/questions/${response.questionId}`);
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof Error) {
        console.error("問題の作成に失敗しました:", error);
        setError(error.message || "問題の作成に失敗しました");
        toast.error("問題の作成に失敗しました");
        return false;
      }
      console.error("問題の作成に失敗しました:", error);
      setError("問題の作成に失敗しました");
      toast.error("問題の作成に失敗しました");
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    defaultQuestionData,
    isCreating,
    error,
    createQuestion,
  };
};
