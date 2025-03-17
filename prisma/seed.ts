import { buildPrisma } from "../src/app/_utils/prisma";
import { AIreviewers, Reviewer } from "./data/aiReviewers";
import { QuestionTag, questionTags } from "./data/questionTags";

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

  const upsertReviewers = async (reviewers: Reviewer[]) => {
    await Promise.all(
      reviewers.map((reviewer) =>
        prisma.reviewer.upsert({
          where: { id: reviewer.id },
          create: reviewer,
          update: reviewer,
        })
      )
    );
  };

  const upsertQuestionTags = async (questionTags: QuestionTag[]) => {
    await Promise.all(
      questionTags.map((questionTag) =>
        prisma.questionTag.upsert({
          where: { id: questionTag.id },
          create: questionTag,
          update: questionTag,
        })
      )
    );
  };

  try {
    await upsertReviewers(AIreviewers);
    await upsertQuestionTags(questionTags);
  } catch (error) {
    console.error(`エラー発生${error}`);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
