import OpenAI from "openai";
import { Message } from "../_types/Message";
import { CodeReviewResponse } from "../api/questions/[questionId]/code_review/_types/CodeReview";
export class AIReviewService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  public static async getCodeReview({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }): Promise<CodeReviewResponse> {
    const message = `コードレビューしてJSON形式で出力してくださいください。1行目はレビュー方針に沿って回答出来ていて、かつ処理が正しいかをboolean型(isCorrect)で, 2行目はレビュー内容のstring型(reviewComment)で一問一答形式ではなく文章として問題点があれば問題点を答えてください。レビューの方針は「①正しく動作すること②1. 引数になる定数の定義 → 2. 関数の定義 → 3. 関数に引数を渡して実行した結果をconsole.logの形になっていること③アロー関数を用いていること④配列メソッド（mapやfilterなど）で書ける部分をfor文などで書いていないこと（可読性のため）④省略記法を用いていること」です。すべての方針に対してコメントする必要はないです。問題点を中心に、完璧ならその旨をコメントしてください。レビュー方針というワードは使ってほしくないです。すべて日本語でお願いします。問題は${question},回答は${answer}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: message }],
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  }

  public static async getChatResponse({
    openAIMessages,
  }: {
    openAIMessages: Message[];
  }) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: openAIMessages,
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0]?.message?.content || "";
  }
}
