"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { CodeEditorFilesForm } from "../q/[questionId]/_hooks/useCodeEditor";

export const BrowserPreview: React.FC = () => {
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { watch } = useFormContext<CodeEditorFilesForm>();

  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (!iframe?.contentWindow) return;

    const sendCode = () => {
      iframe.contentWindow?.postMessage(
        {
          type: "CODE_UPDATE",
          code: watch("files")[0].content || "",
        },
        "*"
      );
    };

    // iframeがロードされたら再度コードを送信
    const handleIframeLoad = () => sendCode();
    iframe.addEventListener("load", handleIframeLoad);

    // ファイルが変更されたらコードを送信（遅延付き）
    const timer = setTimeout(sendCode, 1000);

    return () => {
      clearTimeout(timer);
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [watch]);

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

      <div className="flex flex-1 flex-col">
        <div className="min-h-[250px] flex-1 md:min-h-0">
          <iframe
            ref={previewIframeRef}
            sandbox="allow-scripts allow-modals"
            src="/preview/index.html"
            className="size-full border-0"
            title="React Preview"
          />
        </div>
      </div>
    </div>
  );
};
