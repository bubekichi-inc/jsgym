import { useFetch } from "./useFetch";
import { QuestionsResponse } from "../api/lessons/[lessonId]/_types/QuestionsResponse";
export const useQuestions = (id: string) => {
  return useFetch<QuestionsResponse>(`/api/lessons/${id}`);
};
