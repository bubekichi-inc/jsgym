import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
interface Props {
  params: Promise<{
    answerId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { answerId } = await params;
  try {
    const messages = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        messages: true,
      },
    });
    if (!messages)
      return NextResponse.json(
        { error: "メッセージデータの取得に失敗しました" },
        { status: 404 }
      );

    return NextResponse.json(
      {
        status: messages.status,
        answer: messages.answer,
        //最初の質問が含まれるので最初の要素は除く
        messages: messages.messages.slice(1),
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
