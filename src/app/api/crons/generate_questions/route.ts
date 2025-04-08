import { FileExtension, QuestionType } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import { levelTextMap } from "@/app/_constants";
import {
  JsQuestionGenerateService,
  QuestionLevel,
} from "@/app/_serevices/JsQuestionGenerateService";
import { SlackService } from "@/app/_serevices/SlackService";
import { buildPrisma } from "@/app/_utils/prisma";

/**
 * 難易度を "BASIC", "ADVANCED", "REAL_WORLD" の比率 5:3:2 で返す関数
 * @returns {("BASIC"|"ADVANCED"|"REAL_WORLD")} ランダムに選ばれた難易度
 */
const getRandomLevel = (): QuestionLevel => {
  const basicRate = 0.7;
  const advancedRate = 0.3;
  // 一旦REAL_WORLDは出さない

  const random = Math.random();

  if (random < basicRate) {
    return "BASIC";
  } else if (random < basicRate + advancedRate) {
    return "ADVANCED";
  } else {
    return "REAL_WORLD";
  }
};

const getLevelName = (level: QuestionLevel) => {
  return levelTextMap[level as keyof typeof levelTextMap];
};

export const maxDuration = 180;

const generage = async () => {
  const prisma = await buildPrisma();
  const reviewes = await prisma.reviewer.findMany({
    where: {
      fired: false,
    },
  });
  // ランダムにレビュワーを選択
  const reviewer = reviewes[Math.floor(Math.random() * reviewes.length)];

  const response = await JsQuestionGenerateService.generateQuestion({
    type: QuestionType.JAVA_SCRIPT,
    level: getRandomLevel(),
    reviewer,
  });

  if (!response) throw new Error("Failed to generate question.");

  const allTags = await prisma.questionTag.findMany();

  const question = await prisma.question.create({
    data: {
      id: nanoid(10),
      content: response.content,
      title: response.title,
      inputCode: response.inputCode,
      outputCode: response.outputCode,
      level: response.level,
      reviewerId: reviewer.id,
      questionFiles: {
        create: [response].map((file) => ({
          name: "index",
          template: file.template,
          ext: FileExtension.JS,
          exampleAnswer: file.exampleAnswer,
          isRoot: true,
        })),
      },
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
    const question1 = await generage();
    const question2 = await generage();
    // const question3 = await generage();

    const question1Text = `[${getLevelName(question1.level)}] ${
      question1.title
    }\nhttps://jsgym.shiftb.dev/q/${question1.id}\n\n`;
    const question2Text = `[${getLevelName(question2.level)}] ${
      question2.title
    }\nhttps://jsgym.shiftb.dev/q/${question2.id}\n\n`;
    // const question3Text = `[${getLevelName(question3.level)}] ${
    //   question3.title
    // }\nhttps://jsgym.shiftb.dev/q/${question3.id}\n\n`;

    const slack = new SlackService();
    await slack.postMessage({
      channel: "js-gym",
      message: `JS Gymに問題が追加されました！


${question1Text}
${question2Text}`,
      // ${question3Text}
    });

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
