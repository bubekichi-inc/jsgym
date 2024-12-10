import { CourseType } from "@prisma/client";
import { Language } from "../_types/Language";
export const language = (course: CourseType): Language => {
  switch (course) {
    case "JAVA_SCRIPT":
      return "javascript";
    case "TYPE_SCRIPT":
      return "typescript";
  }
};
