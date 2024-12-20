import { NextRequest, NextResponse } from "next/server";
import { MessagesReasponse, MessageRequest } from "../../_types/Messages";
import { AIReviewService } from "@/app/_serevices/AIReviewService";
import { Message } from "@/app/_types/Message";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
interface Props {
  params: Promise<{
    answerId: string;
  }>;
}
export const GET = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { answerId } = await params;
  try {
    const { id: currentUserId } = await getCurrentUser({ request });

    const messages = await prisma.message.findMany({
      where: {
        answerId: answerId,
        answer: {
          userId: currentUserId,
        },
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
        messages: messages,
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};

export const POST = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { answerId } = await params;
  try {
    const { id: currentUserId } = await getCurrentUser({ request });
    const { message }: MessageRequest = await request.json();
    const answer = await prisma.answer.findUnique({
      where: {
        id: answerId,
        userId: currentUserId,
      },
    });
    const messageHistory = await prisma.message.findMany({
      where: {
        answerId,
      },
      orderBy: { createdAt: "desc" },
      //履歴は最大10個送る
      take: 10,
    });

    const openAIMessages: Message[] = messageHistory.map((message) => ({
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
    return buildError(e);
  }
};
