"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { QuestionTagsResponse } from "@/app/api/question_tags/route";

export const useQuestionTags = () => {
  const { data, error, isLoading, mutate } =
    useFetch<QuestionTagsResponse>("/api/question_tags");

  return {
    tags: data?.tags || [],
    error,
    isLoading,
    refresh: mutate,
  };
};
