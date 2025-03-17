import { QuestionType } from "@prisma/client";
import { Language } from "../_types/Language";
export const language = (type: QuestionType): Language => {
  switch (type) {
    case QuestionType.JAVA_SCRIPT:
      return "javascript";
    case QuestionType.TYPE_SCRIPT:
      return "typescript";
    case QuestionType.REACT_JS:
      return "javascript";
    case QuestionType.REACT_TS:
      return "typescript";
    default:
      return "javascript";
  }
};
