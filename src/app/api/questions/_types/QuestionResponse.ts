import { CourseType } from "@prisma/client";
import { StatusType } from "@prisma/client";
import { Question } from "@/app/api/_types/Question";

export type QuestionResponse = {
  course: {
    id: number;
    name: CourseType;
  };
  lesson: {
    id: number;
    name: string;
  };
  question: Question;
  questions: Question[];
  answer: {
    id: string;
    code: string;
    status: StatusType;
  } | null;
};
