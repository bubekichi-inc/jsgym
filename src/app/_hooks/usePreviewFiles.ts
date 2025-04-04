"use client";

import { useState, useCallback, useEffect } from "react";
import { CodeEditorFile } from "../q/[questionId]/_hooks/useCodeEditor";

type PreviewFile = {
  name: string;
  content: string;
  ext: string;
  isRoot: boolean;
};

/**
 * プレビューファイルを管理するカスタムフック
 */
export const usePreviewFiles = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Service Workerが登録されているか確認
  useEffect(() => {
    const checkServiceWorker = async () => {
      if (!("serviceWorker" in navigator)) {
        setError("このブラウザはService Workerをサポートしていません。");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          setIsReady(true);
        } else {
          setTimeout(checkServiceWorker, 100);
        }
      } catch (err) {
        setError("Service Workerの準備ができていません。");
      }
    };

    checkServiceWorker();
  }, []);

  // Service Workerにメッセージを送信
  const sendMessageToSW = useCallback(
    async <T extends Record<string, unknown>>(message: T): Promise<any> => {
      if (
        !("serviceWorker" in navigator) ||
        !navigator.serviceWorker.controller
      ) {
        throw new Error("Service Workerが登録されていません。");
      }

      return new Promise((resolve, reject) => {
        // メッセージを送信
        navigator.serviceWorker.controller.postMessage(message);

        // レスポンスリスナーをセットアップ
        const messageHandler = (event: MessageEvent) => {
          // レスポンスのタイプをチェック
          if (
            event.data.type === `${message.type}_SUCCESS` ||
            event.data.type === `${message.type}_ERROR`
          ) {
            // リスナーを削除
            navigator.serviceWorker.removeEventListener(
              "message",
              messageHandler
            );

            if (event.data.type.endsWith("_ERROR")) {
              reject(event.data.error || "不明なエラー");
            } else {
              resolve(event.data);
            }
          }
        };

        // レスポンスリスナーを追加
        navigator.serviceWorker.addEventListener("message", messageHandler);

        // タイムアウト処理
        setTimeout(() => {
          navigator.serviceWorker.removeEventListener(
            "message",
            messageHandler
          );
          reject(new Error("Service Workerからの応答がタイムアウトしました。"));
        }, 5000);
      });
    },
    []
  );

  // ファイルをIndexedDBに保存
  const saveFiles = useCallback(
    async (files: CodeEditorFile[]) => {
      setIsSaving(true);
      setError(null);

      try {
        if (!isReady) {
          throw new Error("Service Workerが準備できていません。");
        }

        // ファイル形式を変換
        const previewFiles: PreviewFile[] = files.map((file) => ({
          name: file.name,
          content: file.content,
          ext: file.ext.toLowerCase(),
          isRoot: file.isRoot,
        }));

        // Service Workerにファイルを保存するメッセージを送信
        await sendMessageToSW({
          type: "SAVE_FILES",
          files: previewFiles,
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "不明なエラー";
        setError(`ファイルの保存に失敗しました: ${errorMessage}`);
        console.error("ファイル保存エラー:", err);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isReady, sendMessageToSW]
  );

  // キャッシュクリア
  const clearFiles = useCallback(async () => {
    setError(null);

    try {
      if (!isReady) {
        throw new Error("Service Workerが準備できていません。");
      }

      // Service Workerにファイルをクリアするメッセージを送信
      await sendMessageToSW({
        type: "CLEAR_FILES",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "不明なエラー";
      setError(`キャッシュのクリアに失敗しました: ${errorMessage}`);
      console.error("キャッシュクリアエラー:", err);
      return false;
    }
  }, [isReady, sendMessageToSW]);

  return {
    saveFiles,
    clearFiles,
    isSaving,
    error,
    isReady,
  };
};
