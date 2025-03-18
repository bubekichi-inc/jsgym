"use client";

import { useState, useRef } from "react";

/**
 * シンプルコンソールを使用するためのカスタムフック
 *
 * @returns コンソールの状態とコントロール関数
 */
export const useDevtools = () => {
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // iframeの参照を設定
  const setIframeRef = (ref: HTMLIFrameElement | null) => {
    iframeRef.current = ref;
  };

  // コンソールログを送信
  const sendConsoleLog = (
    message: unknown,
    type: "log" | "info" | "warn" | "error" = "log"
  ) => {
    if (!iframeRef.current?.contentWindow) {
      setError("コンソールiframeが見つかりません");
      return false;
    }

    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "CONSOLE_LOG",
          logType: type,
          message,
        },
        "*"
      );
      return true;
    } catch (error) {
      setError(`ログの送信に失敗しました: ${error}`);
      return false;
    }
  };

  // テストログを送信
  const sendTestLog = (count?: number) => {
    if (!iframeRef.current?.contentWindow) {
      setError("コンソールiframeが見つかりません");
      return false;
    }

    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "TRIGGER_TEST_LOG",
          count,
        },
        "*"
      );
      return true;
    } catch (error) {
      setError(`テストログの送信に失敗しました: ${error}`);
      return false;
    }
  };

  // コンソールをクリア
  const clearConsole = () => {
    if (!iframeRef.current?.contentWindow) {
      setError("コンソールiframeが見つかりません");
      return false;
    }

    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "CLEAR_CONSOLE",
        },
        "*"
      );
      return true;
    } catch (error) {
      setError(`コンソールのクリアに失敗しました: ${error}`);
      return false;
    }
  };

  // コードを実行
  const executeCode = (code: string) => {
    if (!iframeRef.current?.contentWindow) {
      setError("コンソールiframeが見つかりません");
      return false;
    }

    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "EXECUTE_CODE",
          code,
        },
        "*"
      );
      return true;
    } catch (error) {
      setError(`コードの実行に失敗しました: ${error}`);
      return false;
    }
  };

  return {
    error,
    setIframeRef,
    sendConsoleLog,
    sendTestLog,
    clearConsole,
    executeCode,
  };
};
