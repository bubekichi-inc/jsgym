import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { MessagesReasponse } from "../../_types/Messages";
interface Props {
  params: Promise<{
    answerId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { answerId } = await params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        answerId: answerId,
      },
      include: {
        answer: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: 1,
    });

    return NextResponse.json<MessagesReasponse>(
      {
        status: messages[0].answer.status,
        answer: messages[0].answer.answer,
        //最初の質問が含まれるので最初の要素は除く
        messages: messages,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
