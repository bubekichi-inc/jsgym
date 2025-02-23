import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { Message } from "../_types/Message";
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
        message: z.string(),
      })
    ),
  });

  public static buildPrompt({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) {
    return `
# 概要
コードレビューしてJSON形式で出力してください。

# 問題と回答
問題は${question}で、回答は${answer}です。

# レビューの方針
・正しく動作すること
・処理の順番が
  1. 引数になる定数の定義
  2. 関数の定義
  3. 関数に引数を渡して実行した結果をconsole.log
  の順で記述されていること
・アロー関数を用いていること
・配列メソッド（mapやfilterなど）で書ける部分をfor文などで書いていないこと（可読性のため）
・省略記法を用いていること（「1行でreturnするだけの関数場合、{}とreturnを省略する」など）
・変数名や関数名が適切であること(適切でなければ適切な命名例を書いてください。)

# 補足
・stringで返すものは、適切に改行コードも含めてください。
・レビュー方針というワードは使ってほしくないです。
・すべて日本語でお願いします。`;
  }

  public static async getCodeReview({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }): Promise<AIReviewJsonResponse | null> {
    const response = await this.openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "user", content: this.buildPrompt({ question, answer }) },
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
    openAIMessages: Message[];
  }) {
    const messages: Message[] = [
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

    console.log(response.choices[0]?.message?.content);
    return response.choices[0]?.message?.content || "";
  }
}
