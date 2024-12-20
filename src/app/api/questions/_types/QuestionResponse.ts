import { CourseType } from "@prisma/client";
import { StatusType } from "@prisma/client";

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
  };
  answer: {
    id: string;
    answer: string;
    status: StatusType;
  } | null;
};
