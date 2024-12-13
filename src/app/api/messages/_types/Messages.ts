import { ChatMessage } from "@/app/courses/[courseId]/lessons/[lessonId]/questions/[questionId]/_types/ChatMessage";
import { StatusType } from "@prisma/client";
export type MessagesReasponse = {
  status: StatusType;
  answer: string;
  messages: ChatMessage[];
};

export type MessageRequest = {
  message: string;
};
