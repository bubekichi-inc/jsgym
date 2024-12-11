// import { Server as SocketServer } from "socket.io";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CodeReviewResponse } from "./_types/CodeReviewResponse";
// import { buildPrisma } from "@/app/_utils/prisma";

export const POST = async (req: NextRequest) => {
  // const prisma = await buildPrisma();
  try {
    const body = await req.json();
    const { question, code }: { question: string; code: string } = body;
    const message = `コードレビューしてJSON形式で出力してくださいください。1行目はレビュー方針に沿って回答出来ていて、かつ処理が正しいかをboolean型(isCorrect)で, 2行目はレビュー内容のstring型(reviewComment)で一問一答形式ではなく文章として問題点があれば問題点を答えてください。レビューの方針は「①正しく動作すること②1. 引数になる定数の定義 → 2. 関数の定義 → 3. 関数に引数を渡して実行した結果をconsole.logの形になっていること③アロー関数を用いていること④配列メソッド（mapやfilterなど）で書ける部分をfor文などで書いていないこと（可読性のため）④省略記法を用いていること」です。すべての方針に対してコメントする必要はないです。問題点を中心に、完璧ならその旨をコメントしてください。レビュー方針というワードは使ってほしくないです。問題は${question},回答は${code}`;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_SECRET_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" },
    });
    const string = response.choices[0].message.content || "{}";
    const json: CodeReviewResponse = JSON.parse(string);
    return NextResponse.json({ review: json }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
