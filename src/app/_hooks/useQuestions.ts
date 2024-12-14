import { useParams } from "next/navigation";
import { QuestionResponse } from "../api/questions/_types/QuestionResponse";
import { useFetch } from "@/app/_hooks/useFetch";
export const useQuestions = () => {
  const { questionId } = useParams();
  return useFetch<QuestionResponse>(`/api/questions/${questionId}`);
};
