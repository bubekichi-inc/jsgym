"use client";

import React from "react";
import { CheckBox } from "./_components/checkBox";
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
      <div>
        <CheckBox 
          label="新着問題"
          id="new-question" 
          type="checkbox"
          onClick={() => handleChangeSetting("receiveNewQuestionNotification")}
          defaultChecked={data.receiveNewQuestionNotification}
          disabled={false}
        />

        <CheckBox 
          label="お役立ち情報"
          id="useful-information" 
          type="checkbox"
          onClick={() => handleChangeSetting("receiveUsefulInfoNotification")}
          defaultChecked={data.receiveUsefulInfoNotification}
          disabled={false}
        />

        <CheckBox
          label="リマインダー＆その他"
          id="reminder" 
          type="checkbox"
          onClick={() => handleChangeSetting("receiveReminderNotification")}
          defaultChecked={data.receiveReminderNotification}
          disabled={false}
        />

        <CheckBox
          label="重要なお知らせ"
          id="importantInfo" 
          type="checkbox"
          defaultChecked={data.receiveReminderNotification}
          disabled={true}
        />
      </div>
    </>
  )
};

export default Page;
