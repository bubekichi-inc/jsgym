"use client";

import React from "react";
import { CheckBox } from "./_components/CheckBox";
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

    const updatedData: Partial<UpdateNotificationRequest> = {
      [selectItem]: !data[selectItem],
    }

    try {
      await api.put<Partial<UpdateNotificationRequest>, UpdateNotificationResponse>(
        "/api/notifications", 
        updatedData
      ); 
      mutate();
      alert("通知設定を更新しました。");     
    } catch (e) {
      console.log("通知設定の更新に失敗:", e);
      alert("通知設定の更新に失敗しました。");     
    }
  };

  if (!data) return <p>読み込み中...</p>;
  if (error)
    return <p className="text-red-500">データ取得に失敗: {error.message}</p>;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-y-6">
        <div>
          <CheckBox 
            label="新着問題"
            id="new-question" 
            type="checkbox"
            onClick={() => handleChangeSetting("receiveNewQuestionNotification")}
            defaultChecked={data.receiveNewQuestionNotification}
            disabled={false}
          />
          <p>
            新しい問題の通知を受け取る
          </p>
        </div>

        <div>
          <CheckBox 
            label="お役立ち情報"
            id="useful-information" 
            type="checkbox"
            onClick={() => handleChangeSetting("receiveUsefulInfoNotification")}
            defaultChecked={data.receiveUsefulInfoNotification}
            disabled={false}
          />
          <p>
          プログラミングに関する役立つ情報を受け取る
          </p>
        </div>

        <div>
          <CheckBox
            label="リマインダー＆その他"
            id="reminder" 
            type="checkbox"
            onClick={() => handleChangeSetting("receiveReminderNotification")}
            defaultChecked={data.receiveReminderNotification}
            disabled={false}
          />
          <p>
            学習のリマインド、その他のニュースを受け取る
          </p>
        </div>

        <div>
          <CheckBox
            label="重要なお知らせ"
            id="importantInfo" 
            type="checkbox"
            defaultChecked={data.receiveReminderNotification}
            disabled={true}
          />
        <p>
          セキュリティや法的処置等、運営からの重要なお知らせを受け取る<br />
          セキュリティ上OFFにはできません
        </p>
        </div>
      </div>
    </div>
  )
};

export default Page;
