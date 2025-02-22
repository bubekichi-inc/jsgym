import { CodeReviewResult, Sender } from "@prisma/client";

type Message = {
  message: string;
  sender: Sender;
  answerId: string;
};

export type AIReviewJsonResponse = {
  result: CodeReviewResult;
  overview: string;
  comments: CodeReviewComment[]
};

type CodeReviewComment = {
  code: string;
  message: string;
}

export type CodeReviewRequest = {
  question: string;
  answer: string;
};
