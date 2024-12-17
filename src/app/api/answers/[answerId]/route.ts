import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import OpenAI from "openai";
import { MessageRequest } from "../_types/Messages";
interface Props {
  params: Promise<{
    answerId: string;
  }>;
}

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
        id: answerId,
      },
      orderBy: { createdAt: "desc" },
      //履歴は最大10個送る
      take: 10,
    });

    type Message = { role: "user" | "assistant" | "system"; content: string };
    const openAIMessages: Message[] = messageHistory.map(message => ({
      role: message.sender === "USER" ? "user" : "assistant",
      content: message.message,
    }));

    openAIMessages.unshift({ role: "user", content: answer?.answer || "" });

    openAIMessages.push({
      role: "user",
      content: message,
    });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_SECRET_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: openAIMessages,
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const messageContent = response.choices[0].message.content || "";
    const systemMessage = {
      message: messageContent,
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

export const DELETE = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { answerId } = await params;
  try {
    await prisma.answer.delete({
      where: {
        id: answerId,
      },
    });
    return NextResponse.json({ message: "deleted!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
