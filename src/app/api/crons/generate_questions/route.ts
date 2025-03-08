import { CourseType } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import {
  AIQuestionGenerateService,
  QuestionLevel,
} from "@/app/_serevices/AIQuestionGenerateService";
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

// const getLevelName = (lessonId: number) => {
//   if (lessonId === 1) {
//     return "基礎";
//   } else if (lessonId === 2) {
//     return "応用";
//   } else {
//     return "実務模擬";
//   }
// };

export const maxDuration = 30;

const generage = async () => {
  const prisma = await buildPrisma();
  const reviewes = await prisma.reviewer.findMany();
  // ランダムにレビュワーを選択
  const reviewer = reviewes[Math.floor(Math.random() * reviewes.length)];

  const response = await AIQuestionGenerateService.generateQuestion({
    course: CourseType.JAVA_SCRIPT,
    level: getRandomDifficulty(),
    reviewer,
  });

  if (!response) throw new Error("Failed to generate question.");

  const allTags = await prisma.questionTag.findMany();

  const question = await prisma.question.create({
    data: {
      id: nanoid(10),
      content: response.content,
      template: response.template,
      title: response.title,
      inputCode: response.inputCode,
      outputCode: response.outputCode,
      exampleAnswer: response.exampleAnswer,
      lessonId: getLessonId(response.level),
      reviewerId: reviewer.id,
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

  return question;
};

export const GET = async () => {
  try {
    await generage();

    // const slack = new SlackService();
    // await slack.postMessage({
    //   channel: "js-gym",
    //   message: `JS Gymに問題が追加されました！\n\n[${getLevelName(
    //     question.lessonId
    //   )}] ${question.title}\n\nhttps://jsgym.shiftb.dev/q/${question.id}`,
    // });

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
