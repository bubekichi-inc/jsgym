import { CodeReviewResult, Sender } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
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
  codeReview: {
    id: string;
    overview: string;
    result: CodeReviewResult;
    comments: {
      id: string;
      targetCode: string;
      message: string;
      createdAt: Date;
    }[];
  } | null;
  answer: {
    id: string;
    answer: string;
    createdAt: Date;
  } | null;
};

export const GET = async (request: NextRequest, { params }: Props) => {
  const questionId = Number((await params).questionId);

  try {
    const { id: currentUserId } = await getCurrentUser({ request });

    const messages = await prisma.message.findMany({
      where: {
        userQuestion: {
          userId: currentUserId,
          questionId,
        },
      },
      select: {
        id: true,
        message: true,
        sender: true,
        createdAt: true,
        codeReview: {
          select: {
            id: true,
            overview: true,
            result: true,
            comments: true,
            createdAt: true,
          },
        },
        answer: {
          select: {
            id: true,
            answer: true,
            createdAt: true,
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
  const questionId = Number((await params).questionId);

  try {
    const { id: currentUserId } = await getCurrentUser({ request });
    const { message }: PostMessageBody = await request.json();
    const userQuestion = await prisma.userQuestion.findUnique({
      where: {
        userId_questionId: {
          userId: currentUserId,
          questionId,
        },
      },
    });

    if (!userQuestion) return buildError(new Error("UserQuestion not found"));

    const messageHistory = await prisma.message.findMany({
      where: {
        userQuestion: {
          userId: currentUserId,
          questionId,
        },
      },
      select: {
        id: true,
        message: true,
        sender: true,
        createdAt: true,
        codeReview: {
          select: {
            id: true,
            overview: true,
            result: true,
            comments: true,
          },
        },
        answer: {
          select: {
            id: true,
            answer: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      //履歴は最大10個送る
      take: 10,
    });

    const openAIMessages: ChatCompletionMessageParam[] = messageHistory.map(
      (message) => ({
        role: message.sender === Sender.USER ? "user" : "assistant",
        content: message.message,
      })
    );

    // openAIMessages.unshift({ role: "user", content: answer.answer });

    openAIMessages.push({
      role: "user",
      content: message,
    });

    const systemMessageContent = await AIReviewService.getChatResponse({
      openAIMessages,
    });

    await prisma.message.create({
      data: {
        message,
        sender: Sender.USER,
        userQuestionId: userQuestion.id,
      },
    });

    await prisma.message.create({
      data: {
        message: systemMessageContent,
        sender: Sender.SYSTEM,
        userQuestionId: userQuestion.id,
      },
    });

    return NextResponse.json(
      {
        message: "succcess",
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
