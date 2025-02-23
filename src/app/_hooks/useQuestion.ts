import { QuestionResponse } from "../api/questions/[questionId]/route";
import { useFetch } from "@/app/_hooks/useFetch";
export const useQuestion = ({ questionId }: { questionId: string }) => {
  return useFetch<QuestionResponse>(`/api/questions/${questionId}`);
};
