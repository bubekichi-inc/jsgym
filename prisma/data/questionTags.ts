import { QuestionTagValue } from "@prisma/client";

export type QuestionTag = {
  id: number;
  name: QuestionTagValue;
};

export const questionTags: QuestionTag[] = [
  {
    id: 1,
    name: "VALUE",
  },
  {
    id: 2,
    name: "ARRAY",
  },
  {
    id: 3,
    name: "OBJECT",
  },
  {
    id: 4,
    name: "FUNCTION",
  },
  {
    id: 5,
    name: "CLASS",
  },
];
