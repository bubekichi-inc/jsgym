import { NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

export async function GET() {
  const prisma = await buildPrisma();

  try {
    // 最新の問題を取得（最大10件）
    const recentQuestions = await prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        title: true,
      },
    });

    // マークダウンコンテンツを生成
    const content = `# JS Gym（β版）

> JS Gymは、JavaScriptの自走力を鍛えるためのトレーニングジムです。実務に近い課題を通じて、実践的なスキルを身につけることができます。

## サイト概要

- ［トップページ］(https://jsgym.shiftb.dev/)：JS Gymの概要や特徴を紹介しています。

## 問題一覧

${recentQuestions
  .map(
    (question) =>
      `- ［${question.title}］(https://jsgym.shiftb.dev/q/${question.id})：`
  )
  .join("\n")}

## ユーザーランキング

- ［ランキングページ］(https://jsgym.shiftb.dev/ranking)：

## 利用規約・ポリシー

- ［プライバシーポリシー］(https://jsgym.shiftb.dev/privacy_policy)：
- ［特定商取引法に基づく表記］(https://jsgym.shiftb.dev/legal)：

## お問い合わせ

- ［お問い合わせフォーム］(https://jsgym.shiftb.dev/contact)：
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new NextResponse("Error generating content", { status: 500 });
  }
}
