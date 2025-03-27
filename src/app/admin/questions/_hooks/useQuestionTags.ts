"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { QuestionTagResponse } from "@/app/api/admin/question_tags/route";

export const useQuestionTags = () => {
  const {
    data: tags,
    error,
    isLoading,
  } = useFetch<QuestionTagResponse>("/api/admin/question_tags");

  return {
    tags: tags || [],
    error,
    isLoading,
  };
};
