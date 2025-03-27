"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CodeEditorFilesForm } from "../q/[questionId]/_hooks/useCodeEditor";

export const BrowserPreview: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { control } = useFormContext<CodeEditorFilesForm>();
  const files = useWatch({
    control,
    name: "files",
  });

  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (!iframe?.contentWindow) return;

    const sendCode = () => {
      iframe.contentWindow?.postMessage(
        {
          type: "CODE_UPDATE",
          code: files[0]?.content || "", // FIXME: 複数ファイル問題になったら、filex[0]でなく考える
        },
        "*"
      );
      setIsUpdating(false);
    };

    // iframeがロードされたら再度コードを送信
    const handleIframeLoad = () => sendCode();
    iframe.addEventListener("load", handleIframeLoad);

    // ファイルが変更されたらisUpdatingをtrueにする
    setIsUpdating(true);

    // ファイルが変更されたらコードを送信（遅延付き）
    const timer = setTimeout(sendCode, 1000);

    return () => {
      clearTimeout(timer);
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [files]);

  return (
    <div className="flex h-full min-h-[500px] flex-col overflow-hidden bg-white">
      <div className="flex flex-col border-b border-gray-200">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className="size-3 rounded-full bg-gray-300"></div>
            <div className="size-3 rounded-full bg-gray-300"></div>
            <div className="size-3 rounded-full bg-gray-300"></div>
          </div>
          <div className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-500">
            localhost:3000
          </div>
          <div
            className={`size-3 rounded-full ${
              isUpdating ? "animate-pulse bg-blue-500" : "bg-gray-200"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="min-h-[250px] flex-1 md:min-h-0">
          <iframe
            ref={previewIframeRef}
            sandbox="allow-scripts allow-modals"
            src="/preview/index.html"
            className="size-full h-screen border-0"
            title="React Preview"
          />
        </div>
      </div>
    </div>
  );
};
