import { CourseType } from "@prisma/client";
export type Course = {
  id: number;
  name: CourseType;
  createdAt: Date;
  updatedAt: Date;
};

export type CoursesResponse = { courses: Course[] };
