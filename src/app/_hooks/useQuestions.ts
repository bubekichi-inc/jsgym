import { Question } from "../api/lessons/[lessonId]/questions/route";
import { useFetch } from "./useFetch";

export const useQuestions = ({ lessonId }: { lessonId: string }) => {
  return useFetch<{ questions: Question[] }>(
    `/api/lessons/${lessonId}/questions`
  );
};
