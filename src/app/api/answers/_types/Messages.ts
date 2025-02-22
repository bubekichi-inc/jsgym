import { AnswerStatus } from "@prisma/client";
import { ChatMessage } from "@/app/(member)/courses/[courseId]/[lessonId]/[questionId]/_types/ChatMessage";

export type MessagesReasponse = {
  status: AnswerStatus;
  answer: string;
  messages: ChatMessage[];
};

export type MessageRequest = {
  message: string;
};
