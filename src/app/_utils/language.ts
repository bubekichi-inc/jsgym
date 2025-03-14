import { CourseType } from "@prisma/client";
import { Language } from "../_types/Language";
export const language = (course: CourseType): Language => {
  switch (course) {
    case CourseType.JAVA_SCRIPT:
      return "javascript";
    case CourseType.TYPE_SCRIPT:
      return "typescript";
    case CourseType.REACT_JS:
      return "javascript";
    case CourseType.REACT_TS:
      return "typescript";
    default:
      return "javascript";
  }
};
