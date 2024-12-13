import { Message } from "@prisma/client";
export type CodeReviewResponse = {
  isCorrect: boolean;
  reviewComment: string;
  messages: Message[];
};

export type CodeReviewRequest = {
  question: string;
  answer: string;
};
