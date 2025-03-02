import { CourseType } from "@prisma/client";
import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import {
  AIQuestionGenerateService,
  QuestionLevel,
} from "@/app/_serevices/AIQuestionGenerateService";
import { buildPrisma } from "@/app/_utils/prisma";

export const dynamic = "force-dynamic";

/**
 * 難易度を "EASY", "MEDIUM", "HARD" の比率 5:3:2 で返す関数
 * @returns {("EASY"|"MEDIUM"|"HARD")} ランダムに選ばれた難易度
 */
const getRandomDifficulty = (): QuestionLevel => {
  const easyRate = 0.5;
  const normalRate = 0.3;

  const random = Math.random();

  if (random < easyRate) {
    return "EASY";
  } else if (random < easyRate + normalRate) {
    return "MEDIUM";
  } else {
    return "HARD";
  }
};

const getLessonId = (level: QuestionLevel) => {
  if (level === "EASY") {
    return 1;
  } else if (level === "MEDIUM") {
    return 2;
  } else {
    return 3;
  }
};

export const maxDuration = 30;

export const GET = async () => {
  try {
    const response = await AIQuestionGenerateService.generateQuestion({
      course: CourseType.JAVA_SCRIPT,
      level: getRandomDifficulty(),
    });

    if (!response) throw new Error("Failed to generate question.");

    const prisma = await buildPrisma();

    const allTags = await prisma.questionTag.findMany();

    await prisma.question.create({
      data: {
        content: response.content,
        template: response.template,
        title: response.title,
        example: response.inputOutputExample,
        exampleAnswer: response.exampleAnswer,
        lessonId: getLessonId(response.level),
        questions: {
          create: response.tags.map((tag) => ({
            tag: {
              connect: {
                id: allTags.find((t) => t.name === tag)?.id,
                name: tag,
              },
            },
          })),
        },
      },
    });

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
