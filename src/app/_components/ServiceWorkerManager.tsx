"use client";

import { useEffect } from "react";

/**
 * Next.jsでService Workerを登録するためのコンポーネント
 *
 * 注意: Next.jsアプリルートで一度だけ読み込む必要があります
 */
export const ServiceWorkerManager: React.FC = () => {
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === "undefined") return;

    async function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        try {
          // 開発モードではService Workerを無効化する場合
          if (process.env.NODE_ENV === "development") {
            // 既存のService Workerを解除
            const registrations =
              await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
            console.log("Service Worker disabled in development mode");
            return;
          }

          // 本番環境では通常通り登録
          const registration = await navigator.serviceWorker.register(
            "/preview-sw.js"
          );
          console.log("Service Worker registered successfully:", registration);
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    }

    registerServiceWorker();
  }, []);

  return null;
};
