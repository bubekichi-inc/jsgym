"use client";

import {
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// 通知設定解除ページ
export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        setIsLoading(true);
        const userId = searchParams.get("user_id");
        const notificationType = searchParams.get("notification_type");

        if (!userId || !notificationType) {
          throw new Error("必要なパラメータが不足しています");
        }

        // 認証なしでDELETEリクエストを送信
        const endpoint = `/api/notifications?user_id=${encodeURIComponent(
          userId
        )}&notification_type=${encodeURIComponent(notificationType)}`;

        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "通知設定の解除に失敗しました");
        }

        setIsSuccess(true);
      } catch (error) {
        console.error("通知設定の解除に失敗しました", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "通知設定の解除に失敗しました"
        );
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    unsubscribe();
  }, [searchParams]);

  const getNotificationTypeText = () => {
    const type = searchParams.get("notification_type");
    switch (type) {
      case "receive_new_question_notification":
        return "新問題のお知らせ";
      case "receive_useful_info_notification":
        return "お役立ち情報";
      case "receive_reminder_notification":
        return "リマインダー";
      default:
        return "メール通知";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          メール通知設定
        </h1>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="mx-auto size-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">処理中...</p>
          </div>
        ) : isSuccess ? (
          <div className="py-6 text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mb-4 text-5xl text-green-500"
            />
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              通知を解除しました
            </h2>
            <p className="mb-6 text-gray-600">
              {getNotificationTypeText()}のメール通知の受信を停止しました。
            </p>
            <p className="text-sm text-gray-500">
              通知設定はマイページからいつでも変更できます。
            </p>
          </div>
        ) : (
          <div className="py-6 text-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="mb-4 text-5xl text-red-500"
            />
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              エラーが発生しました
            </h2>
            <p className="mb-6 text-gray-600">{errorMessage}</p>
            <p className="text-sm text-gray-500">
              問題が解決しない場合は、お問い合わせください。
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://jsgym.shiftb.dev"
            className="inline-block rounded-md bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
          >
            トップページに戻る
          </a>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© 2025 JS Gym. All rights reserved.</p>
      </footer>
    </div>
  );
}
