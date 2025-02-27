import { Lesson, Question } from "@prisma/client";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { AIReviewJsonResponse } from "../api/questions/[questionId]/code_review/_types/CodeReview";

export class AIReviewService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static CodeReview = z.object({
    result: z.enum(["APPROVED", "REJECTED"]),
    overview: z.string(),
    comments: z.array(
      z.object({
        targetCode: z.string(),
        level: z.enum(["GOOD", "WARN", "ERROR"]),
        message: z.string(),
      })
    ),
  });

  public static buildPrompt({
    question,
    lesson,
    answer,
  }: {
    question: Question;
    lesson: Lesson;
    answer: string;
  }) {
    return `
# 概要
コードレビューしてJSON形式で出力してください。

# 問題文
${question.content}

# ユーザーの回答
${answer}

# 模範回答例（参考程度）
${question.exampleAnswer}

# レビューの方針
・正しく動作すること
・省略記法を用いていること（「1行でreturnするだけの関数場合、{}とreturnを省略する」など）
・「//」以降のコメント文はレビュー対象に入れないでください。
・模範解答と完全一致でなくてもOKです。
・関数名の命名はこだわらなくて良いです。
・関数の引数の命名はこだわらなくて良いです。
・模範解答は参考程度として、細かく比較しなくて良いです。
${lesson.caution}

# 補足
・stringで返すものは、適切に改行コードも含めてください。
・"レビューの方針"というワードは使ってほしくないです。
・模範解答はユーザーに見せたくないので、回答には含めないでください。
・JSONのcommentsは、良くない箇所だけコメントしてください。targetCodeは必ず入れてください。targetCodeには、ユーザーの回答コード以外のコードは入れないでください。
・resultがAPPROVEDの場合、commentsは空の配列で返してください。
・すべて日本語でお願いします。`;
  }

  public static async getCodeReview({
    question,
    lesson,
    answer,
  }: {
    question: Question;
    lesson: Lesson;
    answer: string;
  }): Promise<AIReviewJsonResponse | null> {
    const response = await this.openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "user",
          content: this.buildPrompt({ question, lesson, answer }),
        },
      ],
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: zodResponseFormat(this.CodeReview, "event"),
    });

    const content = response.choices[0].message.parsed;

    return content;
  }

  public static async getChatResponse({
    openAIMessages,
  }: {
    openAIMessages: ChatCompletionMessageParam[];
  }) {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "JSON形式で返さないでください。",
      },
      ...openAIMessages,
    ];
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages,
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0]?.message?.content || "";
  }
}
