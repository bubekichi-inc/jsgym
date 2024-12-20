import OpenAI from "openai";
import { Message } from "../_types/Message";
import { CodeReviewResponse } from "../api/questions/[questionId]/code_review/_types/CodeReview";
export class AIReviewService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static buildPrompt({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) {
    return `
# 概要
コードレビューしてJSON形式で出力してください。
1行目はレビュー方針に沿って回答出来ていて、かつ処理が正しいかをboolean型(isCorrect)で,
2行目はレビュー内容のstring型(reviewComment)で一問一答形式ではなく文章として問題点があれば問題点を答えてください。

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
・reviewCommentの中には、適切に改行コードも含めてください。
・reviewCommentの記載順は以下の通りとしてください。
  1. 合格or不合格の判断理由と全体コメント
  2. 問題点の列挙と詳細説明。
  3. その他コメント（あれば）
  4. 改善後のコード
・レビュー方針というワードは使ってほしくないです。
・すべて日本語でお願いします。`;
  }

  public static async getCodeReview({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }): Promise<CodeReviewResponse> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "user", content: this.buildPrompt({ question, answer }) },
      ],
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
