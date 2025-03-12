import { Question, Reviewer } from "@prisma/client";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { GPT_4O_MINI } from "../_constants/openAI";
import { buildReviewerSettingPrompt } from "../_utils/buildReviewerSettingPrompt";
import { AIReviewJsonResponse } from "../api/questions/[questionId]/code_review/_types/CodeReview";
import { Message } from "../api/questions/[questionId]/messages/route";

export type Score =
  | "0"
  | "10"
  | "20"
  | "30"
  | "40"
  | "50"
  | "60"
  | "70"
  | "80"
  | "90"
  | "100";

const scores: [string, ...string[]] = [
  "0",
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100",
];

export class AIReviewService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static CodeReview = z.object({
    result: z.enum(["APPROVED", "REJECTED"]),
    score: z.enum(scores),
    overview: z.string(),
    comments: z.array(
      z.object({
        targetCode: z.string(),
        level: z.enum(["GOOD", "WARN", "ERROR"]),
        message: z.string(),
      })
    ),
  });
  private static Chat = z.object({
    message: z.string(),
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

# 入力例
${question.inputCode}

# 出力例
${question.outputCode}

# 模範解答例（参考程度）
${question.exampleAnswer}

# ユーザーの解答
${answer}

# レビューの方針
・正しく動作すること
・「//」以降のコメント文はレビュー対象に入れないでください。
・関数名や定数名や変数名の命名はこだわらなくて良いです。
・関数の引数の命名はこだわらなくて良いです。
・模範解答は参考程度として、細かく比較しなくて良いです。

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
    reviewer,
  }: {
    question: Question;
    answer: string;
    reviewer: Reviewer | null;
  }): Promise<AIReviewJsonResponse | null> {
    const response = await this.openai.beta.chat.completions.parse({
      model: GPT_4O_MINI,
      messages: [
        {
          role: "developer",
          content: buildReviewerSettingPrompt({ reviewer }),
        },
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
    reviewer,
  }: {
    openAIMessages: ChatCompletionMessageParam[];
    reviewer: Reviewer | null;
  }) {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "developer",
        content: buildReviewerSettingPrompt({ reviewer }),
      },
      ...openAIMessages,
    ];

    const response = await this.openai.beta.chat.completions.parse({
      model: GPT_4O_MINI,
      messages,
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: zodResponseFormat(this.Chat, "event"),
    });

    return response.choices[0].message.parsed?.message || "";
  }

  public static async getChatResponseWithWebSearch({
    openAIMessages,
    reviewer,
  }: {
    openAIMessages: ChatCompletionMessageParam[];
    reviewer: Reviewer | null;
  }) {
    const input = openAIMessages
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    const response = await this.openai.responses.create({
      model: GPT_4O_MINI,
      tools: [{ type: "web_search_preview" }],
      input,
      instructions: buildReviewerSettingPrompt({ reviewer }),
      max_output_tokens: 16384,
    });

    return response.output_text || "";
  }
}
