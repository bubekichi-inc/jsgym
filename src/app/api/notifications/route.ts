import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { FetchNotificationRequest, UpdateNotificationResponse } from "./_types/notification";
import { buildPrisma } from "@/app/_utils/prisma";

// 通知設定取得用のAPI
export const GET = async (request: NextRequest) => {

  try {
    const currentUser = await getCurrentUser({ request });
    const {receiveNewQuestionNotification, receiveUsefulInfoNotification, receiveReminderNotification } = currentUser;

    const notificationSettings = {
      receiveNewQuestionNotification,
      receiveUsefulInfoNotification,
      receiveReminderNotification,
    }

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
    const body: UpdateNotificationResponse = await request.json();
    const keyName: string = Object.keys(body)[0];

    const updateSettings = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: body,
      select: {
        [keyName]: true,
      },
    });

    if (!updateSettings)
      return NextResponse.json(
        { error: "通知設定の更新に失敗しました" },
        { status: 404 }
      );

    return NextResponse.json<Partial<UpdateNotificationResponse>>(updateSettings, {
      status: 200,
    });
  } catch (e) {
    return await buildError(e);
  }
};
