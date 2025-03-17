// src/components/Preview.tsx
"use client";

import { useEffect, useRef } from "react";

interface Props {
  files: Record<string, string>;
}

export const Preview: React.FC<Props> = ({ files }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ファイルが変更されたときの処理
  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current?.contentWindow) {
        // App.tsxのコードをiframeに送信
        iframeRef.current.contentWindow.postMessage(
          {
            type: "CODE_UPDATE",
            code: files["/App.tsx"] || "",
          },
          "*"
        );
      }
    };

    // iframeのloadイベントを監視
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, [files]);

  // コードが変更されたらリフレッシュする必要はない
  // コードの内容が変わったら直接postMessageで送信できる
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "CODE_UPDATE",
          code: files["/App.tsx"] || "",
        },
        "*"
      );
    }
  }, [files]);

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

      <div className="flex-1">
        <iframe
          ref={iframeRef}
          src="/preview/index.html"
          title="プレビュー"
          sandbox="allow-scripts"
          className="size-full min-h-[450px] border-none"
        />
      </div>
    </div>
  );
};
