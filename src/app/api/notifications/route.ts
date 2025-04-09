import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import {
  FetchNotificationRequest,
  UpdateNotificationRequest,
} from "./_types/notification";
import { buildPrisma } from "@/app/_utils/prisma";

// 通知設定取得用のAPI
export const GET = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });
    const {
      receiveNewQuestionNotification,
      receiveUsefulInfoNotification,
      receiveReminderNotification,
    } = currentUser;

    const notificationSettings = {
      receiveNewQuestionNotification,
      receiveUsefulInfoNotification,
      receiveReminderNotification,
    };

    return NextResponse.json<FetchNotificationRequest>(notificationSettings, {
      status: 200,
    });
  } catch (e) {
    return await buildError(e);
  }
};

// 通知設定更新用のAPI
export const PUT = async (request: NextRequest) => {
  const prisma = await buildPrisma();

  try {
    const currentUser = await getCurrentUser({ request });
    const body: UpdateNotificationRequest = await request.json();

    const {
      receiveNewQuestionNotification,
      receiveUsefulInfoNotification,
      receiveReminderNotification,
    } = body;

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        receiveNewQuestionNotification,
        receiveUsefulInfoNotification,
        receiveReminderNotification,
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};

// 通知設定をOFFにするAPI（認証不要）
export const DELETE = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  const url = new URL(request.url);

  try {
    const userId = url.searchParams.get("user_id");
    const notificationType = url.searchParams.get("notification_type");

    if (!userId || !notificationType) {
      return NextResponse.json(
        { message: "user_idとnotification_typeが必要です" },
        { status: 400 }
      );
    }

    const updateData: Record<string, boolean> = {};

    // 通知タイプに応じてデータを更新
    switch (notificationType) {
      case "receive_new_question_notification":
        updateData.receiveNewQuestionNotification = false;
        break;
      case "receive_useful_info_notification":
        updateData.receiveUsefulInfoNotification = false;
        break;
      case "receive_reminder_notification":
        updateData.receiveReminderNotification = false;
        break;
      default:
        return NextResponse.json(
          { message: "無効なnotification_typeです" },
          { status: 400 }
        );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    return NextResponse.json(
      { message: "通知設定を無効にしました" },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
