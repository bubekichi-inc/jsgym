import { QuestionsResponse } from "../api/lessons/[lessonId]/_types/QuestionsResponse";
import { useFetch } from "./useFetch";

export const useQuestions = ({ lessonId }: { lessonId: string }) => {
  return useFetch<QuestionsResponse>(`/api/lessons/${lessonId}`);
};
