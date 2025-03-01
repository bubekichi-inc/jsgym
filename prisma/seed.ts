import { CourseType } from "@prisma/client";
import { buildPrisma } from "../src/app/_utils/prisma";
import { courses, lessons, questions } from "./data/javascriptCourse";

export type Course = {
  id: number;
  name: CourseType;
};

export type Lesson = {
  id: number;
  name: string;
  courseId: number;
};

export type Question = {
  id: number;
  lessonId: number;
  content: string;
  template: string;
  title: string;
  example: string;
  exampleAnswer: string;
};

const seedData = async () => {
  const prisma = await buildPrisma();

  const upsertCourses = async (courses: Course[]) => {
    await Promise.all(
      courses.map((course) =>
        prisma.course.upsert({
          where: { id: course.id },
          create: course,
          update: course,
        })
      )
    );
  };

  const upsertLessons = async (lessons: Lesson[]) => {
    await Promise.all(
      lessons.map((lesson) =>
        prisma.lesson.upsert({
          where: { id: lesson.id },
          create: lesson,
          update: lesson,
        })
      )
    );
  };

  const upsertQuestions = async (questions: Question[]) => {
    await Promise.all(
      questions.map((question) =>
        prisma.question.upsert({
          where: { id: question.id },
          create: question,
          update: question,
        })
      )
    );
  };

  try {
    await upsertCourses(courses);
    await upsertLessons(lessons);
    await upsertQuestions(questions);
  } catch (error) {
    console.error(`エラー発生${error}`);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
