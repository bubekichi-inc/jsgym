"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  files: Record<string, string>;
}

export const Preview: React.FC<Props> = ({ files }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // iframeが読み込まれたら、コードを送信
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

  // ファイルが変更されたらiframeをリフレッシュ
  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [files]);

  return (
    <div className="h-full min-h-[500px] overflow-hidden rounded-md border border-gray-300 bg-white">
      <iframe
        ref={iframeRef}
        key={refreshKey}
        src="/preview/index.html"
        title="プレビュー"
        sandbox="allow-scripts"
        className="size-full min-h-[500px] border-none"
      />
    </div>
  );
};
