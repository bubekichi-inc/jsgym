"use client";

import React from "react";
import { useNotifications } from "./_hooks/useNotifications";
import { api } from "@/app/_utils/api";
import { UpdateNotificationRequest, UpdateNotificationResponse} from "@/app/api/notifications/_types/notification";

type NotificationSettingKey =
  "receiveNewQuestionNotification"
  | "receiveReminderNotification"
  | "receiveUsefulInfoNotification"

const Page: React.FC = () => {
  const { error, data, mutate } = useNotifications();
  const handleChangeSetting = async(selectItem: NotificationSettingKey) => {
    if(!data) return;

    const updatedData: UpdateNotificationRequest = {
      ...data,
      [selectItem]: !data[selectItem],
    }

    try {
      await api.put<UpdateNotificationRequest, UpdateNotificationResponse>("/api/notifications", updatedData); 
      mutate();     
    } catch (e) {
      console.log("通知設定の更新に失敗:", e);
    }
  };

  if (!data) return <p>読み込み中...</p>;
  if (error)
    return <p className="text-red-500">データ取得に失敗: {error.message}</p>;

  return (
    <>
      <div className="">
        通知設定
      </div>

      <div>
        <div>
          <input 
            id="new-question" 
            type="checkbox"
            className="size-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            onClick={() => handleChangeSetting("receiveNewQuestionNotification")}
            defaultChecked={data.receiveNewQuestionNotification}
          />
          <label 
            htmlFor="new-question"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            新着問題
          </label>
        </div>

        <div>
          <input 
            id="useful-information" 
            type="checkbox"
            className="size-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            onClick={() => handleChangeSetting("receiveUsefulInfoNotification")}
            defaultChecked={data.receiveUsefulInfoNotification}
          />
          <label 
            htmlFor="useful-information"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            お役立ち情報
          </label>
        </div>

        <div>
          <input 
            id="reminder" 
            type="checkbox"
            className="size-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            onClick={() => handleChangeSetting("receiveReminderNotification")}
            defaultChecked={data.receiveReminderNotification}
          />
          <label 
            htmlFor="reminder"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            リマインダー&その他
          </label>
        </div>
      </div>
    </>
  )
};

export default Page;
