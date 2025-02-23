import { CodeReviewResult, MessageType, Sender } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { AIReviewService } from "@/app/_serevices/AIReviewService";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

const prisma = await buildPrisma();

export type Message = {
  id: string;
  message: string;
  sender: Sender;
  createdAt: Date;
  type: MessageType;
  codeReview: {
    id: string;
    overview: string;
    result: CodeReviewResult;
    comments: {
      id: string;
      targetCode: string;
      message: string;
    }[];
  } | null;
};

export const GET = async (request: NextRequest, { params }: Props) => {
  const questionId = Number((await params).questionId);

  try {
    const { id: currentUserId } = await getCurrentUser({ request });

    const messages = await prisma.message.findMany({
      where: {
        answer: {
          userId: currentUserId,
          questionId,
        },
      },
      select: {
        id: true,
        message: true,
        sender: true,
        createdAt: true,
        type: true,
        codeReview: {
          select: {
            id: true,
            overview: true,
            result: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json<{ messages: Message[] }>(
      {
        messages,
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};

export type PostMessageBody = {
  message: string;
};

export const POST = async (request: NextRequest, { params }: Props) => {
  const { questionId } = await params;
  try {
    const { id: currentUserId } = await getCurrentUser({ request });
    const { message }: PostMessageBody = await request.json();
    const answer = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: currentUserId,
          questionId,
        },
      },
    });

    const messageHistory = await prisma.message.findMany({
      where: {
        answer: {
          userId: currentUserId,
          questionId,
        },
      },
      orderBy: { createdAt: "desc" },
      //履歴は最大10個送る
      take: 10,
    });

    const openAIMessages = messageHistory.map((message) => ({
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
