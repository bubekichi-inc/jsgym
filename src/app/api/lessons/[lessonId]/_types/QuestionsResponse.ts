import { AnswerStatus } from "@prisma/client";
export type Question = {
  id: number;
  title: string;
  content: string;
  status: AnswerStatus;
};
export type QuestionsResponse = { questions: Question[] };
