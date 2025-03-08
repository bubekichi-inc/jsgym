import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { Notification  } from "./_types/notification";
import { buildPrisma } from "@/app/_utils/prisma";

// 通知設定取得用のAPI
export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  
  try {
    const currentUser = await getCurrentUser({ request });
    const notificationSettings = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        receiveNewQuestionNotification: true,
        receiveUsefulInfoNotification: true,
        receiveReminderNotification: true,
      },
    });

    if (!notificationSettings)
      return NextResponse.json(
        { error : "通知設定の取得に失敗しました"},
        { status: 404 }
      );

    return NextResponse.json<Notification>(notificationSettings, {
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
    const body = await request.json(); 
    const { 
      receiveNewQuestionNotification, 
      receiveUsefulInfoNotification,
      receiveReminderNotification,
    } : Notification = body;

    const updateSettings = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        receiveNewQuestionNotification,
        receiveUsefulInfoNotification,
        receiveReminderNotification,
      },
      select: {
        receiveNewQuestionNotification: true,
        receiveUsefulInfoNotification: true,
        receiveReminderNotification: true,
      }
    });

    if (!updateSettings)
      return NextResponse.json(
        { error : "通知設定の更新に失敗しました"},
        { status: 404 }
      )

    return NextResponse.json<Notification>(updateSettings, {
      status: 200,
    });
  } catch (e) {
    return await buildError(e);
  }
}