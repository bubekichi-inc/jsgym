import { Sender } from "@prisma/client";

type Message = {
  message: string;
  sender: Sender;
  answerId: string;
};

export type AIReviewJsonResponse = {
  isCorrect: boolean;
  overview: string;
  goodPoints: string;
  badPoints: string;
  improvedCode: string;
};

export type CodeReviewResponse = {
  messages: Message[];
  answerId: string;
} & AIReviewJsonResponse;

export type CodeReviewRequest = {
  question: string;
  answer: string;
};
