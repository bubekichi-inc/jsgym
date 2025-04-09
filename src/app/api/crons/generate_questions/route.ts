import { FileExtension, QuestionType } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import { levelTextMap, typeTextMap } from "@/app/_constants";
import {
  JsQuestionGenerateService,
  QuestionLevel,
} from "@/app/_serevices/JsQuestionGenerateService";
import { ReactJsQuestionGenerateService } from "@/app/_serevices/ReactJsQuestionGenerateService";
import { SlackService } from "@/app/_serevices/SlackService";
import { buildPrisma } from "@/app/_utils/prisma";

/**
 * 難易度を "BASIC", "ADVANCED", "REAL_WORLD" の比率 5:3:2 で返す関数
 * @returns {("BASIC"|"ADVANCED"|"REAL_WORLD")} ランダムに選ばれた難易度
 */
const getRandomLevel = (): QuestionLevel => {
  const basicRate = 0.8;
  const advancedRate = 0.2;
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

const getTypeName = (type: QuestionType) => {
  return typeTextMap[type as keyof typeof typeTextMap];
};

const randomReviewer = async () => {
  const prisma = await buildPrisma();
  const reviewes = await prisma.reviewer.findMany({
    where: {
      fired: false,
    },
  });
  return reviewes[Math.floor(Math.random() * reviewes.length)];
};

const createQuestionTagRelations = async (
  questionId: string,
  tags: string[]
) => {
  const prisma = await buildPrisma();
  const allTags = await prisma.questionTag.findMany();
  await Promise.all(
    tags.map(async (tag) => {
      const tagId = allTags.find((t) => t.name === tag)?.id;
      if (!tagId) return;
      await prisma.questionTagRelation.create({
        data: {
          questionId,
          tagId,
        },
      });
    })
  );
};

export const maxDuration = 180;

const generageJsQuestion = async () => {
  const prisma = await buildPrisma();
  const reviewer = await randomReviewer();

  const response = await JsQuestionGenerateService.generateQuestion({
    level: getRandomLevel(),
    reviewer,
  });

  if (!response) throw new Error("Failed to generate question.");

  const question = await prisma.question.create({
    data: {
      id: nanoid(10),
      type: QuestionType.JAVA_SCRIPT,
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

  await createQuestionTagRelations(question.id, response.tags);

  return question;
};

const generageReactJsQuestion = async () => {
  const prisma = await buildPrisma();
  const reviewer = await randomReviewer();

  const response = await ReactJsQuestionGenerateService.generateQuestion({
    level: "BASIC", // Reactは一旦BASICのみ出す
    reviewer,
  });

  if (!response) throw new Error("Failed to generate question.");

  const question = await prisma.question.create({
    data: {
      id: nanoid(10),
      type: QuestionType.REACT_JS,
      content: response.content,
      title: response.title,
      inputCode: "",
      outputCode: "",
      level: response.level,
      reviewerId: reviewer.id,
      questionFiles: {
        create: [response].map((file) => ({
          name: "index",
          template: file.template,
          ext: FileExtension.JSX,
          exampleAnswer: file.exampleAnswer,
          isRoot: true,
        })),
      },
    },
  });

  await createQuestionTagRelations(question.id, response.tags);

  return question;
};

export const GET = async () => {
  try {
    const [question1, question2, question3, question4] = await Promise.all([
      generageJsQuestion(),
      generageJsQuestion(),
      generageReactJsQuestion(),
      generageReactJsQuestion(),
    ]);

    const question1Text = `[${getTypeName(question1.type)} ${getLevelName(
      question1.level
    )}] ${question1.title}\nhttps://jsgym.shiftb.dev/q/${question1.id}\n\n`;
    const question2Text = `[${getTypeName(question2.type)} ${getLevelName(
      question2.level
    )}] ${question2.title}\nhttps://jsgym.shiftb.dev/q/${question2.id}\n\n`;
    const question3Text = `[${getTypeName(question3.type)} ${getLevelName(
      question3.level
    )}] ${question3.title}\nhttps://jsgym.shiftb.dev/q/${question3.id}\n\n`;
    const question4Text = `[${getTypeName(question4.type)} ${getLevelName(
      question4.level
    )}] ${question4.title}\nhttps://jsgym.shiftb.dev/q/${question4.id}\n\n`;

    const slack = new SlackService();
    await slack.postMessage({
      channel: "js-gym",
      message: `JS Gymに問題が追加されました！


${question1Text}
${question2Text}
${question3Text}
${question4Text}`,
    });

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
