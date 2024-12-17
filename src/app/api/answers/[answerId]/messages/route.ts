import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { MessagesReasponse } from "../../_types/Messages";
import { MessageRequest } from "../../_types/Messages";
import { AIReviewService } from "@/app/_serevices/AIReviewService";
import { Message } from "@/app/_types/Message";
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

export const POST = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { answerId } = await params;
  const { message }: MessageRequest = await req.json();
  try {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    });
    const messageHistory = await prisma.message.findMany({
      where: {
        answerId,
      },
      orderBy: { createdAt: "desc" },
      //履歴は最大10個送る
      take: 10,
    });

    const openAIMessages: Message[] = messageHistory.map(message => ({
      role: message.sender === "USER" ? "user" : "assistant",
      content: message.message,
    }));

    openAIMessages.unshift({ role: "user", content: answer?.answer || "" });

    openAIMessages.push({
      role: "user",
      content: message,
    });

    const systemMessageContent = await AIReviewService.getChatResponse({
      openAIMessages,
    });
    const systemMessage = {
      message: systemMessageContent,
      sender: "SYSTEM" as const,
      answerId,
    };
    await prisma.message.createMany({
      data: [
        {
          message,
          sender: "USER",
          answerId,
        },
        systemMessage,
      ],
    });

    return NextResponse.json(
      {
        systemMessage,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
