import { StatusType } from "@prisma/client";
export type Question = {
  id: number;
  title: string;
  content: string;
  status: StatusType;
};
export type QuestionsResponse = { questions: Question[] };
