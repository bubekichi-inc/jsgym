import { QuestionTagValue, QuestionType, Reviewer } from "@prisma/client";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { GPT_4_5 } from "../_constants/openAI";
import {
  lesson1Example,
  lesson2Example,
  lesson3Example,
} from "../_constants/questionExamples/javascript";
import { buildReviewerSettingPrompt } from "../_utils/buildReviewerSettingPrompt";
import { buildPrisma } from "../_utils/prisma";

type GenerateQuestionJsonResponse = {
  title: string;
  inputCode: string;
  outputCode: string;
  content: string;
  template: string;
  level: QuestionLevel;
  exampleAnswer: string;
  tags: QuestionTagValue[];
};

export type QuestionLevel = "BASIC" | "ADVANCED" | "REAL_WORLD";

export class AIQuestionGenerateService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static Question = z.object({
    title: z.string(),
    inputCode: z.string(),
    outputCode: z.string(),
    template: z.string(),
    content: z.string(),
    level: z.enum(["BASIC", "ADVANCED", "REAL_WORLD"]),
    exampleAnswer: z.string(),
    tags: z.array(
      z.enum([
        "VALUE",
        "ARRAY",
        "OBJECT",
        "FUNCTION",
        "CLASS",
        "STATE",
        "PROPS",
        "HOOK",
        "ERROR_HANDLING",
        "ASYNC",
      ])
    ),
  });

  public static buildPrompt({
    type,
    level,
    titleContentList,
  }: {
    type: QuestionType;
    level: QuestionLevel;
    titleContentList: string[];
  }) {
    return `
# 概要
${type}の問題を作成してください。
これから、JavaScriptを自走して書けるようになるための問題です。
アプリケーションのユーザーが、その問題を解いて、提出して、判定を得ることで、学習を進めることができます。

${type === "JAVA_SCRIPT" && level === "BASIC" && lesson1Example}
${type === "JAVA_SCRIPT" && level === "ADVANCED" && lesson2Example}
${type === "JAVA_SCRIPT" && level === "REAL_WORLD" && lesson3Example}

# 出力型の説明
* title: 問題のタイトル
* inputCode: 入力コード
* outputCode: 出力コード
* content: 問題の内容(何をすれば良いのか、具体的に)
* level: 問題の難易度
* template: ユーザーが回答するコードのテンプレートです。デフォルト値として表示します。#のコメント文で、次行に何を書いたら良いのかの説明をしてください。
* exampleAnswer: 模範的な解答
* tags: 問題のタグ（複数可）

# 補足
・説明は、すべて日本語でお願いします。
・以下の問題とは、タイトル・解法・アプローチ・概念が明確に異なる問題を作成してください。
・すでに出題された概念の単純な変形や類似問題は避け、新しい視点や学びがある問題を作成してください。
・これまでに出題されていない概念や応用方法を取り入れてください。
・以下に、これまでに出題された問題のタイトルと内容を示します。
${titleContentList.join("\n")}

# 特に避けるべき類似パターン
1. 単純に変数名や値を変えただけの問題
2. 同じ関数やメソッドを使った似たような処理
3. 類似した入出力パターンを持つ問題
4. 同じ解法が適用できる問題

# 新規性を高めるヒント
1. 実務でよく遭遇する具体的なユースケースを取り入れる
2. 複数の概念を組み合わせた問題にする
3. エッジケースや例外処理を意識させる問題にする
4. 特定のJavaScriptの新機能を活用した問題にする`}

  public static async generateQuestion({
    type,
    level,
    reviewer,
  }: {
    type: QuestionType;
    level: QuestionLevel;
    reviewer: Reviewer;
  }): Promise<GenerateQuestionJsonResponse | null> {
    const prisma = await buildPrisma();
    const questions = await prisma.question.findMany({
      select: {
        title: true,
        content: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const titleContentList = questions.map(
      (question) => `  - タイトル:${question.title} 内容:${question.content}`
    );

    const response = await this.openai.beta.chat.completions.parse({
      model: GPT_4_5,
      messages: [
        {
          role: "developer",
          content: buildReviewerSettingPrompt({ reviewer }),
        },
        {
          role: "user",
          content: this.buildPrompt({ type, level, titleContentList }),
        },
      ],
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: zodResponseFormat(this.Question, "event"),
    });

    const content = response.choices[0].message.parsed;

    return content;
  }
}
