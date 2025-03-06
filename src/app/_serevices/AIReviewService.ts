import { Question } from "@prisma/client";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { GPT_4O_MINI } from "../_constants/openAI";
import { AIReviewJsonResponse } from "../api/questions/[questionId]/code_review/_types/CodeReview";
import { Message } from "../api/questions/[questionId]/messages/route";

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
    answer,
  }: {
    question: Question;
    answer: string;
  }) {
    return `
# 概要
コードレビューしてJSON形式で出力してください。

# 問題タイトル
${question.title}

# 問題文
${question.content}

# ユーザーの解答
${answer}

# 模範解答例（参考程度）
${question.exampleAnswer}

# レビューの方針
・正しく動作すること
・「//」以降のコメント文はレビュー対象に入れないでください。
・関数名や定数名や変数名の命名はこだわらなくて良いです。
・関数の引数の命名はこだわらなくて良いです。
・模範解答は参考程度として、細かく比較しなくて良いです。
・===で書いた方が良いところは、==でなく、===で書くように指摘してください。

# 補足
・stringで返すものは、適切に改行コードも含めてください。
・"レビューの方針"というワードは使ってほしくないです。
・模範解答はユーザーに見せたくないので、解答には含めないでください。
・JSONのcommentsは、良くない箇所だけコメントしてください。targetCodeは必ず入れてください。targetCodeには、ユーザーの解答コード以外のコードは入れないでください。
・resultがAPPROVEDの場合、commentsは空の配列で返してください。
・すべて日本語でお願いします。`;
  }

  public static buildSystemMessageContent({
    message,
  }: {
    message: Message;
  }): string {
    if (message.codeReview) {
      const result = `レビューの結果は「${message.codeReview.result}」でした。`;
      const overview = message.codeReview.overview;
      const comments = message.codeReview.comments
        .map((comment) => {
          return `${comment.targetCode}について、${comment.message}`;
        })
        .join(" ");
      return `${result} ${overview} 以下、コードに対してのコメントです。 ${comments}`;
    }
    return message.message;
  }

  public static async getCodeReview({
    question,
    answer,
  }: {
    question: Question;
    answer: string;
  }): Promise<AIReviewJsonResponse | null> {
    const response = await this.openai.beta.chat.completions.parse({
      model: GPT_4O_MINI,
      messages: [
        {
          role: "user",
          content: this.buildPrompt({ question, answer }),
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
      model: GPT_4O_MINI,
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
