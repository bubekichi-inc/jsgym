"use client";

import { useEffect, useRef } from "react";

interface Props {
  files: Record<string, string>;
}

export const BrowserPreview: React.FC<Props> = ({ files }) => {
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!previewIframeRef.current?.contentWindow) return;

    const timer = setTimeout(() => {
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
            src="/preview/index.html"
            className="size-full border-0"
            title="React Preview"
          />
        </div>
      </div>
    </div>
  );
};
