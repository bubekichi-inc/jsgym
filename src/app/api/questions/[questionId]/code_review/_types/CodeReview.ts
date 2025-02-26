import { CodeReviewResult } from "@prisma/client";

export type AIReviewJsonResponse = {
  result: CodeReviewResult;
  overview: string;
  comments: CodeReviewComment[];
};

type CodeReviewComment = {
  targetCode: string;
  message: string;
  level: "GOOD" | "WARNING" | "ERROR";
};

export type CodeReviewRequest = {
  answer: string;
};
