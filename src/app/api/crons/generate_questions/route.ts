import { CourseType } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import {
  AIQuestionGenerateService,
  QuestionLevel,
} from "@/app/_serevices/AIQuestionGenerateService";
import { SlackService } from "@/app/_serevices/SlackService";
import { buildPrisma } from "@/app/_utils/prisma";

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

export const dynamic = "force-dynamic";
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

    const question = await prisma.question.create({
      data: {
        id: nanoid(10),
        content: response.content,
        template: response.template,
        title: response.title,
        example: response.inputOutputExample,
        exampleAnswer: response.exampleAnswer,
        lessonId: getLessonId(response.level),
      },
    });

    await Promise.all(
      response.tags.map(async (tag) => {
        const tagId = allTags.find((t) => t.name === tag)?.id;
        if (!tagId) return;
        await prisma.questionTagRelation.create({
          data: {
            questionId: question.id,
            tagId,
          },
        });
      })
    );

    const slack = new SlackService();
    await slack.postMessage({
      channel: "jg-gym",
      message: `JS Gymに問題が追加されました！\n\n${question.title}\n\nhttps://jsgym.shiftb.dev/q/${question.id}`,
    });

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
