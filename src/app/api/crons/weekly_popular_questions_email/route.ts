import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import { levelTextMap } from "../../../_constants";
import { SendGridService } from "../../../_serevices/SendGridService";
import { buildPrisma } from "../../../_utils/prisma";
import { buildError } from "../../_utils/buildError";

export const maxDuration = 180;

const getLevelName = (level: string) => {
  return levelTextMap[level as keyof typeof levelTextMap];
};

export const GET = async () => {
  try {
    const prisma = await buildPrisma();

    const oneWeekAgo = subDays(new Date(), 7);

    const popularQuestions = await prisma.question.findMany({
      where: {
        userQuestions: {
          some: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            userQuestions: true,
          },
        },
        userQuestions: {
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        },
      },
      orderBy: {
        userQuestions: {
          _count: "desc",
        },
      },
      take: 7,
    });

    const questionTexts = popularQuestions
      .map(
        (question) =>
          `[${getLevelName(question.level)}] ${question.title}
https://jsgym.shiftb.dev/q/${question.id}`
      )
      .join("\n\n");

    const htmlContent = `
      <h1>JS Gymの今週の人気問題</h1>
      <p>直近1週間のJS Gymで人気のあった問題をお届けします！</p>
      ${popularQuestions
        .map(
          (question) => `
        <div style="margin-bottom: 20px;">
          <h2>[${getLevelName(question.level)}] ${question.title}</h2>
          <p>取り組んだユーザー数: ${question._count.userQuestions}人</p>
          <a href="https://jsgym.shiftb.dev/q/${
            question.id
          }" style="display: inline-block; padding: 10px 15px; background-color: #4b5563; color: white; text-decoration: none; border-radius: 4px;">問題を見る</a>
        </div>
      `
        )
        .join("")}
      <p>引き続きJS Gymでスキルアップしましょう！</p>
    `;

    const textContent = `
JS Gymの今週の人気問題

直近1週間のJS Gymで人気のあった問題をお届けします！

${questionTexts}

引き続きJS Gymでスキルアップしましょう！
    `;

    const usersWithNotifications = await prisma.user.findMany({
      where: {
        receiveNewQuestionNotification: true,
        email: { not: null },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const sendGrid = new SendGridService();

    const emailPromises = usersWithNotifications.map((user) => {
      if (user.email) {
        return sendGrid.sendEmail({
          to: user.email,
          subject: "【JS Gym】今週の人気問題をお届けします",
          text: textContent,
          html: htmlContent,
        });
      }
      return Promise.resolve();
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
