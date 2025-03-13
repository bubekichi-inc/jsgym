import { CourseType } from "@prisma/client";
import { Course, Lesson } from "../seed";

export const courses: Course[] = [
  { id: 1, name: CourseType.JAVA_SCRIPT },
  { id: 2, name: CourseType.REACT_JS },
  { id: 3, name: CourseType.REACT_TS },
];

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
  {
    id: 4,
    name: "基礎",
    courseId: 2,
  },
  {
    id: 5,
    name: "応用",
    courseId: 2,
  },
  {
    id: 6,
    name: "実務模擬",
    courseId: 2,
  },
  {
    id: 7,
    name: "基礎",
    courseId: 3,
  },
  {
    id: 8,
    name: "応用",
    courseId: 3,
  },
  {
    id: 9,
    name: "実務模擬",
    courseId: 3,
  },
];
