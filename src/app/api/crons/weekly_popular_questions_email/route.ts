import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import { levelTextMap, questionTypeTextMap } from "../../../_constants";
import { SendGridService } from "../../../_serevices/SendGridService";
import { buildPrisma } from "../../../_utils/prisma";
import { buildError } from "../../_utils/buildError";

export const maxDuration = 180;

// タイプごとの背景色をTailwindクラス名からCSS色コードに変換
const typeStyleColorMap: Record<string, string> = {
  REACT_JS: "#38bdf8", // bg-sky-400相当
  REACT_TS: "#2563eb", // bg-blue-600相当
  JAVA_SCRIPT: "#fbbf24", // bg-amber-400相当
  TYPE_SCRIPT: "#2563eb", // bg-blue-600相当
};

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
        questions: {
          include: {
            tag: true,
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
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">JS Gymの今週の人気問題</h1>
      <p style="margin-bottom: 24px;">直近1週間のJS Gymで人気のあった問題をお届けします！</p>
      <div style="display: grid; gap: 24px;">
        ${popularQuestions
          .map(
            (question) => `
          <div style="position: relative; display: flex; flex-direction: column; border-radius: 8px; border: 1px solid #e5e7eb; background-color: white; padding: 24px; padding-top: 40px; padding-bottom: 20px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
            <div style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <div style="font-size: 14px;">
                  <span style="display: inline-flex; align-items: center; white-space: nowrap; border-radius: 9999px; border: 1px solid transparent; padding: 2.5px 10px; font-size: 14px; font-weight: bold; color: white; background-color: ${
                    question.type && typeStyleColorMap[question.type]
                      ? typeStyleColorMap[question.type]
                      : "#4b5563"
                  };">
                    ${
                      question.type &&
                      questionTypeTextMap[
                        question.type as keyof typeof questionTypeTextMap
                      ]
                        ? questionTypeTextMap[
                            question.type as keyof typeof questionTypeTextMap
                          ]
                        : ""
                    } ${getLevelName(question.level)}
                  </span>
                  ${
                    new Date(question.createdAt).toDateString() ===
                    new Date().toDateString()
                      ? `<span style="margin-left: 8px; display: inline-flex; align-items: center; border-radius: 9999px; font-size: 16px; font-weight: bold; color: #dc2626;">NEW</span>`
                      : ""
                  }
                </div>
              </div>
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 4px;">${
                question.title
              }</h3>
              <p style="color: #6b7280; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${
                question.content || ""
              }</p>
            </div>
            <div>
              <a href="https://jsgym.shiftb.dev/q/${
                question.id
              }" style="display: inline-flex; width: 100%; justify-content: center; align-items: center; border-radius: 6px; background-color: black; padding: 8px 16px; font-size: 14px; font-weight: 500; color: white; text-decoration: none;">
                問題に挑戦する
              </a>
            </div>
            <div style="position: absolute; top: 0; left: 0; border-top-left-radius: 8px; border-bottom-right-radius: 8px; padding: 4px 8px; font-size: 14px; color: white; background-color: #4b5563;">
              取り組んだユーザー数: ${question._count.userQuestions}人
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <p style="margin-top: 24px;">引き続きJS Gymでスキルアップしましょう！</p>
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
