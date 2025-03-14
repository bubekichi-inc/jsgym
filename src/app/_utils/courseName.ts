import { CourseType } from "@prisma/client";
export const courseName = (course: CourseType): string => {
  switch (course) {
    case CourseType.JAVA_SCRIPT:
      return "JavaScript";
    case CourseType.TYPE_SCRIPT:
      return "TypeScript";
    case CourseType.REACT_JS:
      return "React";
    case CourseType.REACT_TS:
      return "React";
  }
};
