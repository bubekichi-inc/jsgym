import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CodeReviewRequest, CodeReviewResponse } from "./_types/CodeReview";
import { buildPrisma } from "@/app/_utils/prisma";
import { Sender, StatusType } from "@prisma/client";
interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const POST = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;
  //プロトタイプ用のtestアカウントID
  const userId = "aa47a833-3bd9-4ad3-92f5-dcea9f9fab7e";
  try {
    const body = await req.json();
    const { question, answer }: CodeReviewRequest = body;
    const message = `コードレビューしてJSON形式で出力してくださいください。1行目はレビュー方針に沿って回答出来ていて、かつ処理が正しいかをboolean型(isCorrect)で, 2行目はレビュー内容のstring型(reviewComment)で一問一答形式ではなく文章として問題点があれば問題点を答えてください。レビューの方針は「①正しく動作すること②1. 引数になる定数の定義 → 2. 関数の定義 → 3. 関数に引数を渡して実行した結果をconsole.logの形になっていること③アロー関数を用いていること④配列メソッド（mapやfilterなど）で書ける部分をfor文などで書いていないこと（可読性のため）④省略記法を用いていること」です。すべての方針に対してコメントする必要はないです。問題点を中心に、完璧ならその旨をコメントしてください。レビュー方針というワードは使ってほしくないです。すべて日本語でお願いします。問題は${question},回答は${answer}`;
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
    const { isCorrect, reviewComment }: CodeReviewResponse = JSON.parse(string);
    const status = isCorrect ? StatusType.PASSED : StatusType.REVISION_REQUIRED;

    //ステータスを更新する
    const answerResponse = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: userId,
          questionId: parseInt(questionId, 10),
        },
      },
    });

    //回答が既にあったら削除
    if (answerResponse) {
      await prisma.answer.delete({
        where: {
          id: answerResponse.id,
        },
      });
    }

    const answerData = await prisma.answer.create({
      data: {
        questionId: parseInt(questionId, 10),
        answer,
        status,
        userId,
      },
    });

    const systemMessage = {
      message: reviewComment,
      sender: Sender.SYSTEM,
      answerId: answerData.id,
    };

    //メッセージにも登録(履歴送るときに備えて、回答なども含める)
    //同時に回答履歴登録
    await Promise.all([
      prisma.message.createMany({
        data: [
          { message, sender: Sender.USER, answerId: answerData.id },
          systemMessage,
        ],
      }),
      prisma.answerHistory.create({
        data: {
          userId: userId,
          questionId: parseInt(questionId, 10),
          answer,
        },
      }),
    ]);

    return NextResponse.json(
      {
        isCorrect,
        reviewComment,
        messages: [systemMessage],
        answerId: answerData.id,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
