"use client";

import { useEffect, useRef } from "react";
import {
  clearConsole,
  executeCode,
  sendConsoleLog,
} from "../_utils/browserConsole";

interface Props {
  files: Record<string, string>;
}

export const BrowserPreview: React.FC<Props> = ({ files }) => {
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const devtoolsIframeRef = useRef<HTMLIFrameElement>(null);

  // ファイルが変更されたときの処理
  useEffect(() => {
    if (!previewIframeRef.current?.contentWindow) return;

    const timer = setTimeout(() => {
      if (devtoolsIframeRef.current) {
        clearConsole(devtoolsIframeRef.current);
      }

      previewIframeRef.current?.contentWindow?.postMessage(
        {
          type: "CODE_UPDATE",
          code: files["/App.tsx"] || "",
        },
        "*"
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [files]);

  // テストログを送信
  const handleTestLog = () => {
    if (!devtoolsIframeRef.current) return;

    // テストログを送信
    sendConsoleLog(devtoolsIframeRef.current, "テストログ", "log");
    sendConsoleLog(devtoolsIframeRef.current, "テスト警告", "warn");
    sendConsoleLog(devtoolsIframeRef.current, "テストエラー", "error");
    sendConsoleLog(devtoolsIframeRef.current, "テスト情報", "info");

    // もしくはJavaScriptコードを直接実行
    executeCode(
      devtoolsIframeRef.current,
      `
      console.log('テストログ - 実行コード');
      console.warn('テスト警告 - 実行コード');
      console.error('テストエラー - 実行コード');
      console.info('テスト情報 - 実行コード');
      `
    );
  };

  return (
    <div className="flex h-full min-h-[500px] flex-col overflow-hidden bg-white">
      <div className="flex flex-col border-b border-gray-200">
        <div className="flex items-center bg-gray-50 px-3 py-2">
          <div className="mr-2 flex items-center space-x-2">
            <div className="size-3 rounded-full bg-gray-300"></div>
            <div className="size-3 rounded-full bg-gray-300"></div>
            <div className="size-3 rounded-full bg-gray-300"></div>
          </div>
          <div className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-500">
            localhost:3000
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 p-2">
        <button
          onClick={handleTestLog}
          className="rounded bg-blue-500 px-2 py-1 text-xs text-white disabled:bg-blue-300"
        >
          テストログを送信
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        {/* プレビュー */}
        <div className="min-h-[250px] flex-1 md:min-h-0">
          <iframe
            ref={previewIframeRef}
            src="/preview/index.html"
            className="size-full border-0"
            title="React Preview"
          />
        </div>

        {/* シンプルコンソール */}
        <div className="min-h-[200px] flex-1 border-t border-gray-200 md:min-h-0 md:border-l md:border-t-0">
          <iframe
            ref={devtoolsIframeRef}
            src="/browser-console/index.html"
            className="size-full border-0"
            title="シンプルコンソール"
          />
        </div>
      </div>
    </div>
  );
};
