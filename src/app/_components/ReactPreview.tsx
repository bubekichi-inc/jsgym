// src/components/Preview.tsx
"use client";

import { useEffect, useState } from "react";

interface Props {
  files: Record<string, string>;
}

export const Preview: React.FC<Props> = ({ files }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Service Workerの登録を確認
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // ファイルの変更を検知してiframeをリフレッシュ
    saveFilesToIndexedDB(files).then(() => {
      setRefreshKey((prev) => prev + 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  async function saveFilesToIndexedDB(files: Record<string, string>) {
    const db = await openDatabase();
    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");

    // ファイルを保存
    const promises = Object.entries(files).map(([path, content]) => {
      return new Promise<void>((resolve, reject) => {
        const request = store.put({ path, content });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }

  async function openDatabase() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("CodeEditorDB", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "path" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return (
    <div className="h-full min-h-[500px] overflow-hidden rounded-md border border-gray-300 bg-white">
      <iframe
        key={refreshKey}
        src="/preview/index.html"
        title="プレビュー"
        sandbox="allow-scripts"
        className="size-full min-h-[500px] border-none"
      />
    </div>
  );
};
