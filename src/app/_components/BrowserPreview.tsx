"use client";

import { QuestionFile } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CodeEditorFilesForm } from "../q/[questionId]/_hooks/useCodeEditor";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { usePreviewFiles } from "../_hooks/usePreviewFiles";

type Props = {
  questionFiles: QuestionFile[];
};

export const BrowserPreview: React.FC<Props> = ({ questionFiles }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { control } = useFormContext<CodeEditorFilesForm>();
  const files = useWatch({
    control,
    name: "files",
  });
  const [tab, setTab] = useState<"EXAMPLE_ANSWER" | "USER_ANSWER">(
    "USER_ANSWER"
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const { saveFiles, isSaving, error, isReady } = usePreviewFiles();

  useEffect(() => {
    // ファイルが変更されたらisUpdatingをtrueにする
    setIsUpdating(true);

    // ファイルが変更されたらファイルを保存して更新
    const timer = setTimeout(async () => {
      if (!isReady) {
        // Service Workerが準備できていない場合は再試行
        setIsUpdating(false);
        return;
      }

      try {
        if (tab === "USER_ANSWER") {
          // ユーザーの回答ファイルを保存
          await saveFiles(files);
        } else {
          // 模範解答ファイルを保存
          const exampleFiles = questionFiles.map((file) => ({
            id: file.id,
            name: file.name,
            content: file.exampleAnswer,
            ext: file.ext,
            isRoot: file.isRoot,
          }));
          await saveFiles(exampleFiles);
        }

        // iframeをリフレッシュするためにkeyを更新
        setRefreshKey((prev) => prev + 1);
      } finally {
        setIsUpdating(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [files, questionFiles, tab, saveFiles, isReady]);

  // iframeのロードが完了したときにReloadメッセージを送信
  const handleIframeLoad = () => {
    const iframe = previewIframeRef.current;
    if (!iframe?.contentWindow) return;

    // リロードメッセージを送信
    iframe.contentWindow.postMessage(
      {
        type: "RELOAD_APP",
      },
      "*"
    );
  };

  return (
    <div className="flex h-full min-h-[500px] flex-col overflow-hidden bg-white">
      {/* Service Workerの登録 */}
      <ServiceWorkerRegistration />

      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2">
        <div className="flex items-center space-x-1">
          <div className="size-2 rounded-full bg-gray-300"></div>
          <div className="size-2 rounded-full bg-gray-300"></div>
          <div className="size-2 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-500">
          localhost:3000
        </div>
        {questionFiles[0]?.exampleAnswer && (
          <div className="flex overflow-hidden rounded-md border border-gray-300">
            <button
              onClick={() => setTab("USER_ANSWER")}
              className={`px-3 py-1 text-xs ${
                tab === "USER_ANSWER"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              あなたのコード
            </button>
            <button
              onClick={() => setTab("EXAMPLE_ANSWER")}
              className={`px-3 py-1 text-xs ${
                tab === "EXAMPLE_ANSWER"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              完成形
            </button>
          </div>
        )}
        <div
          className={`size-3 rounded-full ${
            isUpdating || isSaving ? "animate-pulse bg-blue-500" : "bg-gray-200"
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col">
        {error && (
          <div className="m-2 rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-600">
            {error}
          </div>
        )}
        <div className="min-h-[250px] flex-1 md:min-h-0">
          <iframe
            key={refreshKey}
            ref={previewIframeRef}
            sandbox="allow-scripts allow-modals allow-same-origin"
            src="/preview/index.html"
            className="size-full h-screen border-0"
            title="React Preview"
            allow="clipboard-write"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
};
