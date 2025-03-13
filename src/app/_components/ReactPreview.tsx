// src/components/Preview.tsx
"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  files: Record<string, string>;
}

export const Preview: React.FC<Props> = ({ files }) => {
  const [refreshKey, setRefreshKey] = useState(0);
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
  }, [files, refreshKey]);

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
    <div className="h-full min-h-[500px] overflow-hidden rounded-md border border-gray-300 bg-white">
      <iframe
        ref={iframeRef}
        src="/preview/index.html"
        title="プレビュー"
        sandbox="allow-scripts"
        className="size-full min-h-[500px] border-none"
      />
    </div>
  );
};
