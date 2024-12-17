import { QuestionResponse } from "../api/questions/_types/QuestionResponse";
import { useFetch } from "@/app/_hooks/useFetch";
export const useQuestion = ({ questionId }: { questionId: string }) => {
  return useFetch<QuestionResponse>(`/api/questions/${questionId}`);
};
