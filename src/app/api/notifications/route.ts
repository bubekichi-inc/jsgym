import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { NotificationResponse } from "./_types/notification";
import { buildPrisma } from "@/app/_utils/prisma";

// 通知設定取得用のAPI
export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  const currentUser = await getCurrentUser({ request });

  try {
    const notificationSettings = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        receiveNewQuestionNotification: true,
        receiveReminderNotification: true,
        receiveUsefulInfoNotification: true,
      },
    });

    if (!notificationSettings)
      return NextResponse.json<NotificationResponse>(null, { status: 200 });

    return NextResponse.json<NotificationResponse>(notificationSettings, {
      status: 200,
    });
  } catch (e) {
    return await buildError(e);
  }
};