import { useFetch } from "@/app/_hooks/useFetch";
import { Message } from "@/app/api/questions/[questionId]/messages/route";

interface Props {
  questionId: string;
}

export const useMessages = ({ questionId }: Props) =>
  useFetch<{ messages: Message[] }>(`/api/questions/${questionId}/messages`);
