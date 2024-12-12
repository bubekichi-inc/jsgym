export type CodeReviewResponse = {
  isCorrect: boolean;
  reviewComment: string;
};

export type CodeReviewRequest = {
  question: string;
  answer: string;
};
