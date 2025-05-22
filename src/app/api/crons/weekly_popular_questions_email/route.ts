import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import { levelTextMap, questionTypeTextMap } from "../../../_constants";
import { SendGridService } from "../../../_serevices/SendGridService";
import { buildPrisma } from "../../../_utils/prisma";
import { buildError } from "../../_utils/buildError";

export const maxDuration = 300;

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

    const oneMonthAgo = subDays(new Date(), 30);

    const popularQuestions = await prisma.question.findMany({
      where: {
        createdAt: {
          gte: oneMonthAgo,
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
              gte: oneMonthAgo,
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

    const usersWithNotifications = await prisma.user.findMany({
      where: {
        receiveNewQuestionNotification: true,
        email: { not: null },
        NOT: {
          userQuestions: {
            some: {
              createdAt: {
                gte: oneMonthAgo,
              },
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_BASE_URL || "https://jsgym.shiftb.dev";

    const sendGrid = new SendGridService();

    const emailPromises = usersWithNotifications.map((user) => {
      if (user.email) {
        const htmlContent = `
          <div style="text-align: center; margin: 32px 0;">
            <img src="https://jsgym.shiftb.dev/images/logo.png" alt="JS Gym" width="180" style="max-width: 180px;" />
          </div>
          <p style="margin-bottom: 24px; max-width: 480px; margin: 24px auto;">いつもJS Gymをご利用いただきありがとうございます。直近1ヶ月のJS Gymで人気のあった問題をお届けします！</p>
          <div style="display: grid; gap: 24px; justify-content: center;">
            ${popularQuestions
              .map(
                (question) => `
              <div style="position: relative; display: flex; flex-direction: column; border-radius: 8px; border: 1px solid #e5e7eb; background-color: white; padding: 24px; padding-top: 40px; padding-bottom: 20px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); max-width: 400px;">
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
                  }" style="display: block; text-align: center; max-width: 100%; border-radius: 6px; background-color: black; padding: 8px 16px; font-size: 14px; font-weight: 500; color: white; text-decoration: none;">
                    問題に挑戦する
                  </a>
                </div>
                <div style="position: absolute; top: 0; left: 0; border-top-left-radius: 8px; border-bottom-right-radius: 8px; padding: 4px 8px; font-size: 14px; color: white; background-color: #4b5563;">
                  ${question._count.userQuestions}人が挑戦
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <p style="margin-top: 24px; margin-bottom: 24px; max-width: 480px; margin: 24px auto;">引き続きJS Gymでスキルアップしましょう！</p>

          <!-- 配信停止ボタン -->
          <div style="margin: 24px 0; text-align: center;">
            <a href="${appBaseUrl}/unsubscribe?user_id=${encodeURIComponent(
          user.id
        )}&amp;notification_type=receive_new_question_notification" style="display: inline-block; padding: 8px 16px; background-color: #f3f4f6; color: #4b5563; border-radius: 6px; text-decoration: none; font-size: 12px;">このメール配信を停止する</a>
          </div>

          <!-- フッター -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <div>
                <img src="https://jsgym.shiftb.dev/images/logo.png" alt="JS Gym" width="120" style="max-width: 120px;" />
              </div>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
                <a href="https://bubekichi.com" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; text-decoration: none;">
                  運営会社
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                    <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </a>
                <a href="https://shiftb.dev/?r=jg" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; text-decoration: none;">
                  運営スクール
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                    <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/bube.code" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; text-decoration: none;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></rect>
                    <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle>
                    <circle cx="18" cy="6" r="1" fill="currentColor"></circle>
                  </svg>
                  bube.code
                </a>
                <a href="${appBaseUrl}/privacy_policy" style="font-size: 12px; color: #6b7280; text-decoration: none;">
                  プライバシーポリシー
                </a>
              </div>
            </div>
            <div style="margin-top: 16px;">
              <p style="text-align: center; font-size: 12px; color: #6b7280;">
                © 2025 JS Gym. All rights reserved.
              </p>
            </div>
          </div>
        `;

        return sendGrid.sendEmail({
          to: user.email,
          subject: "【JS Gym】今月の人気問題をお届けします",
          html: htmlContent,
        });
      }
      return Promise.resolve();
    });

    await Promise.all(emailPromises);

    console.log(
      `${usersWithNotifications.length}人に「人気の問題」メールを送信しました。`
    );

    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
