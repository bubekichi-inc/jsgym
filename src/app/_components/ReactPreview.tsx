"use client";

import { useEffect, useRef, useState } from "react";
import { useDevtools } from "../_hooks/useDevtools";
import { clearConsole, evaluateJavaScript } from "../_utils/chobitsuCommands";

interface Props {
  files: Record<string, string>;
}

export const ReactPreview: React.FC<Props> = ({ files }) => {
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const devtoolsIframeRef = useRef<HTMLIFrameElement>(null);
  const devtoolsUrl = useDevtools();
  const [isDevtoolsReady, setIsDevtoolsReady] = useState(false);

  // Chobitsuメッセージの処理
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // プレビューiframeからのChobitsuメッセージを受け取る
      if (
        event.data.type === "CHOBITSU_MESSAGE" &&
        devtoolsIframeRef.current?.contentWindow &&
        isDevtoolsReady
      ) {
        // デベロッパーツールiframeに転送
        devtoolsIframeRef.current.contentWindow.postMessage(
          event.data.message,
          "*"
        );
      } else if (event.data.type === "DEVTOOLS_READY") {
        // デベロッパーツールの準備完了
        console.log("デベロッパーツールの準備完了を受信");
        setIsDevtoolsReady(true);

        // Runtime.enableを送信して初期化
        if (previewIframeRef.current?.contentWindow) {
          evaluateJavaScript(
            previewIframeRef.current,
            "console.log('デベロッパーツール接続完了')"
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isDevtoolsReady]);

  // デベロッパーツールの準備完了を検知
  useEffect(() => {
    const handleDevtoolsReady = () => {
      console.log("デベロッパーツールのiframeがロードされました");

      // iframeがロードされてから少し待ってからDEVTOOLS_READYメッセージを確認
      setTimeout(() => {
        if (!isDevtoolsReady) {
          console.log(
            "デベロッパーツールの準備完了メッセージがないため、手動で設定します"
          );
          setIsDevtoolsReady(true);
        }
      }, 3000);
    };

    // デベロッパーツールのiframeがロードされたら準備完了とする
    if (devtoolsIframeRef.current) {
      devtoolsIframeRef.current.addEventListener("load", handleDevtoolsReady);
    }

    return () => {
      if (devtoolsIframeRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        devtoolsIframeRef.current.removeEventListener(
          "load",
          handleDevtoolsReady
        );
      }
    };
  }, [devtoolsUrl, isDevtoolsReady]);

  // ファイルが変更されたときの処理
  useEffect(() => {
    if (!previewIframeRef.current?.contentWindow) return;

    const timer = setTimeout(() => {
      // コンソールをクリア
      clearConsole(previewIframeRef.current);

      // コードを更新
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

  // ツールバーのボタンハンドラー
  // const handleClearLocalStorage = () => {
  //   clearLocalStorage(previewIframeRef.current);
  // };

  // const handleClearConsole = () => {
  //   clearConsole(previewIframeRef.current);
  // };

  // テストログを送信
  // const handleTestLog = () => {
  //   if (previewIframeRef.current) {
  //     evaluateJavaScript(
  //       previewIframeRef.current,
  //       `
  //       console.log('テストログ');
  //       console.warn('テスト警告');
  //       console.error('テストエラー');
  //       console.info('テスト情報');
  //     `
  //     );
  //   }
  // };

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

      <div className="flex flex-1 flex-col md:flex-row">
        {/* プレビュー */}
        <div className="min-h-[250px] flex-1 md:min-h-0">
          <iframe
            ref={previewIframeRef}
            src="/preview/index.html"
            className="size-full border-0"
            title="React Preview"
          />
        </div>

        {/* デベロッパーツール */}
        {/* <div className="min-h-[250px] flex-1 border-t border-gray-200 md:min-h-0 md:border-l md:border-t-0">
          {devtoolsUrl ? (
            <iframe
              ref={devtoolsIframeRef}
              src={devtoolsUrl}
              className="size-full border-0"
              title="Developer Tools"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              デベロッパーツールを読み込み中...
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
