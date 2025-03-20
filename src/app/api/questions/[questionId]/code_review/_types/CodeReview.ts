import { CodeReviewCommentLevel, CodeReviewResult } from "@prisma/client";

export type AIReviewJsonResponse = {
  result: CodeReviewResult;
  overview: string;
  comments: CodeReviewComment[];
  score: string;
};

type CodeReviewComment = {
  targetCode: string;
  message: string;
  level: CodeReviewCommentLevel;
};
