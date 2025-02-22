import { CourseType, AnswerStatus } from "@prisma/client";

export type QuestionResponse = {
  course: {
    id: number;
    name: CourseType;
  };
  question: {
    id: number;
    title: string;
    content: string;
    example?: string | null;
    template: string;
  };
  answer: {
    id: string;
    answer: string;
    status: AnswerStatus;
  } | null;
};
