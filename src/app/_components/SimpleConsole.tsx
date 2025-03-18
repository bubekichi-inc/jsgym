"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  sendConsoleLog,
  sendTestLog,
  clearConsole,
  executeCode,
  evaluateTSX,
} from "../_utils/simpleConsole";

interface FileContent {
  content: string;
  type: string;
}

interface Props {
  files?: Record<string, FileContent>;
}

const SimpleConsole: React.FC<Props> = ({ files = {} }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isConsoleReady, setIsConsoleReady] = useState(false);
  const [logCount, setLogCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("コンソールを初期化中...");

  // コンソールの準備状態を監視
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (data && data.type === "CONSOLE_READY") {
        setIsConsoleReady(true);
        setStatusMessage("コンソール準備完了");

        // 5秒後にステータスメッセージをクリア
        setTimeout(() => {
          setStatusMessage("");
        }, 5000);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // ファイルの変更を監視して評価結果をコンソールに表示
  useEffect(() => {
    if (isConsoleReady && files && Object.keys(files).length > 0) {
      const fileNames = Object.keys(files);
      evaluateTSX(iframeRef.current, {
        fileCount: fileNames.length,
        fileNames,
        firstFileContent:
          fileNames.length > 0
            ? files[fileNames[0]].content.substring(0, 100) + "..."
            : "",
      });
    }
  }, [isConsoleReady, files]);

  // コンソールにログを送信
  const handleSendLog = (
    message: unknown,
    type: "log" | "info" | "warn" | "error" = "log"
  ) => {
    if (!isConsoleReady) {
      setStatusMessage("コンソールが準備できていません");
      return;
    }

    const success = sendConsoleLog(iframeRef.current, message, type);

    if (success) {
      setStatusMessage(`${type}メッセージを送信しました`);
    } else {
      setStatusMessage("メッセージの送信に失敗しました");
    }

    // 5秒後にステータスメッセージをクリア
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  // テストログを送信
  const handleTestLog = () => {
    if (!isConsoleReady) {
      setStatusMessage("コンソールが準備できていません");
      return;
    }

    const newCount = logCount + 1;
    setLogCount(newCount);

    const success = sendTestLog(iframeRef.current, newCount);

    if (success) {
      setStatusMessage(`テストログ #${newCount} を送信しました`);
    } else {
      setStatusMessage("テストログの送信に失敗しました");
    }

    // 5秒後にステータスメッセージをクリア
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  // コンソールをクリア
  const handleClearConsole = () => {
    if (!isConsoleReady) {
      setStatusMessage("コンソールが準備できていません");
      return;
    }

    const success = clearConsole(iframeRef.current);

    if (success) {
      setStatusMessage("コンソールをクリアしました");
    } else {
      setStatusMessage("コンソールのクリアに失敗しました");
    }

    // 5秒後にステータスメッセージをクリア
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  // コードを実行
  const handleExecuteCode = (code: string) => {
    if (!isConsoleReady) {
      setStatusMessage("コンソールが準備できていません");
      return;
    }

    const success = executeCode(iframeRef.current, code);

    if (success) {
      setStatusMessage("コードを実行しました");
    } else {
      setStatusMessage("コードの実行に失敗しました");
    }

    // 5秒後にステータスメッセージをクリア
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded overflow-hidden bg-gray-100">
      <div className="flex items-center justify-between p-2 bg-gray-200 border-b border-gray-300">
        <div className="text-sm font-medium text-gray-700">
          シンプルコンソール {isConsoleReady ? "✅" : "⏳"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearConsole}
            disabled={!isConsoleReady}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            コンソールをクリア
          </button>
          <button
            onClick={handleTestLog}
            disabled={!isConsoleReady}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            テストログを送信
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="px-2 py-1 text-xs text-blue-600 bg-blue-50">
          {statusMessage}
        </div>
      )}

      <div className="flex-grow relative">
        <iframe
          ref={iframeRef}
          src="/simple-console/index.html"
          className="absolute inset-0 w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
          title="シンプルコンソール"
        />
      </div>
    </div>
  );
};

export default SimpleConsole;
