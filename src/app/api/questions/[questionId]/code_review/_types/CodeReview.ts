import { Message } from "@prisma/client";
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
