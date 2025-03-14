import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { FetchNotificationRequest, UpdateNotificationRequest } from "./_types/notification";
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
    const body: UpdateNotificationRequest = await request.json();

    if (Object.keys(body).length !== 1) {
      throw new Error(
        "更新できるのは1件のみです"
      );
    }

    const [key, value] = Object.entries(body)[0] as [keyof UpdateNotificationRequest, boolean];
    const updateData = { [key]: value };

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: updateData,
    });
    
    return NextResponse.json({ message: "success" },{status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
