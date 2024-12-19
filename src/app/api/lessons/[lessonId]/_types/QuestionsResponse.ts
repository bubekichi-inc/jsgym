import { Question as BaseQuestion } from "@/app/api/_types/Question";
import { StatusType } from "@prisma/client";
type Question = BaseQuestion & { status: StatusType };

export type QuestionsResponse = { questions: Question[] };
