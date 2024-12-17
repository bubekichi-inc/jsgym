import { Sender } from "@prisma/client";

type Message = {
  message: string;
  sender: Sender;
  answerId: string;
};
export type CodeReviewResponse = {
  isCorrect: boolean;
  reviewComment: string;
  messages: Message[];
  answerId: string;
};

export type CodeReviewRequest = {
  question: string;
  answer: string;
};
