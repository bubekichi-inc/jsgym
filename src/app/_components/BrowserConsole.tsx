"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  sendTestLog,
  clearConsole,
  evaluateTSX,
} from "../_utils/browserConsole";

interface FileContent {
  content: string;
  type: string;
}

interface Props {
  files?: Record<string, FileContent>;
}

export const BrowserConsole: React.FC<Props> = ({ files = {} }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [logCount, setLogCount] = useState(0);

  // ファイルの変更を監視して評価結果をコンソールに表示
  useEffect(() => {
    if (files && Object.keys(files).length > 0) {
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
  }, [files]);

  // テストログを送信
  const handleTestLog = () => {
    const newCount = logCount + 1;
    setLogCount(newCount);

    sendTestLog(iframeRef.current, newCount);
  };

  // コンソールをクリア
  const handleClearConsole = () => {
    clearConsole(iframeRef.current);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded border border-gray-300 bg-gray-100">
      <div className="flex items-center justify-between border-b border-gray-300 bg-gray-200 p-2">
        <div className="text-sm font-medium text-gray-700">
          シンプルコンソール
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearConsole}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            コンソールをクリア
          </button>
          <button
            onClick={handleTestLog}
            className="rounded bg-green-500 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:bg-green-300"
          >
            テストログを送信
          </button>
        </div>
      </div>

      <div className="relative grow">
        <iframe
          ref={iframeRef}
          src="/browser-console/index.html"
          className="absolute inset-0 size-full border-none"
          sandbox="allow-scripts"
          title="コンソール"
        />
      </div>
    </div>
  );
};
