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

    return NextResponse.json(
      {
        answer: messages?.answer,
        messages: messages?.messages,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
