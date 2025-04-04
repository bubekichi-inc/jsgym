"use client";

import { useEffect, useState } from "react";

export const ServiceWorkerRegistration: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Service Workerの登録
    async function registerServiceWorker() {
      if (!("serviceWorker" in navigator)) {
        setError("このブラウザはService Workerをサポートしていません。");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register(
          "/preview-sw.js",
          {
            scope: "/",
          }
        );

        if (registration.installing) {
          console.log("Service Workerをインストール中...");
        } else if (registration.waiting) {
          console.log("Service Workerのインストールが終了し、待機中...");
        } else if (registration.active) {
          console.log("Service Workerがアクティブです");
        }

        // すべてのクライアントを更新
        if ("navigationPreload" in registration) {
          await registration.navigationPreload.enable();
        }

        setIsRegistered(true);
        console.log("Service Workerの登録が完了しました:", registration.scope);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "不明なエラー";
        setError(`Service Workerの登録に失敗しました: ${errorMessage}`);
        console.error("Service Workerの登録エラー:", error);
      }
    }

    registerServiceWorker();

    return () => {
      // クリーンアップは通常Service Workerには不要
    };
  }, []);

  return (
    <div style={{ display: "none" }}>
      {/* このコンポーネントはUIを表示しません */}
      {error && <div hidden>{error}</div>}
    </div>
  );
};
