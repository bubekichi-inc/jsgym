import { CourseType } from "@prisma/client";
import { Course, Lesson } from "../seed";

export const courses: Course[] = [{ id: 1, name: CourseType.JAVA_SCRIPT }];

export const lessons: Lesson[] = [
  {
    id: 1,
    name: "基礎",
    courseId: 1,
  },
  {
    id: 2,
    name: "応用",
    courseId: 1,
  },
  {
    id: 3,
    name: "実務模擬",
    courseId: 1,
  },
];
