"use client";

import { EditorTheme } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import {
  CodeEditorFile,
  CodeEditorFilesForm,
} from "../../q/[questionId]/_hooks/useCodeEditor";
import { Editor } from "./Editor";
import { FileTabs } from "./FileTabs";
import { Terminal } from "./Terminal";
import { ToolBar } from "./ToolBar";
import { useEditorSetting } from "@/app/(member)/_hooks/useEditorSetting";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
import { useDevice } from "@/app/_hooks/useDevice";
import { useLocalStorage } from "@/app/_hooks/useLocalStorage";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";

interface Props {
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
  onReviewComplete: () => void;
  showTerminal: boolean;
}

export const CodeEditor: React.FC<Props> = ({
  reviewBusy,
  setReviewBusy,
  onReviewComplete,
  showTerminal,
}) => {
  const { watch, reset, setValue } = useFormContext<CodeEditorFilesForm>();
  const [touched, setTouched] = useState(false);
  const { isSp } = useDevice();
  const params = useParams();
  const { data: editorSettingData } = useEditorSetting();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const { iframeRef, executeCode, executionResult, resetLogs } =
    useCodeExecutor();

  // パネルサイズをローカルストレージで管理
  const [editorPanelSize, setEditorPanelSize] = useLocalStorage<number>(
    "editor-panel-size",
    70
  );
  const [terminalPanelSize, setTerminalPanelSize] = useLocalStorage<number>(
    "terminal-panel-size",
    30
  );

  const editorHeight = useMemo(() => {
    if (!showTerminal) {
      if (isSp) return "calc(100vh - 48px - 44px - 36px)";
      return "calc(100vh - 48px - 36px)";
    }
    return "100%";
  }, [isSp, showTerminal]);

  const theme = useMemo(() => {
    switch (editorSettingData?.editorSetting.editorTheme) {
      case EditorTheme.LIGHT:
        return "slack-ochin";
      case EditorTheme.DARK:
        return "slack-dark";
      default:
        return "slack-dark";
    }
  }, [editorSettingData]);

  useEffect(() => {
    if (!data) return;
    const answerFiles: CodeEditorFile[] | undefined =
      data.answer?.answerFiles.map(({ id, name, content, ext, isRoot }) => ({
        id,
        name,
        ext,
        content,
        isRoot,
      }));

    const questionFiles: CodeEditorFile[] = data.question.questionFiles.map(
      ({ id, name, template, ext, isRoot }) => ({
        id,
        name,
        ext,
        content: template,
        isRoot,
      })
    );

    reset({
      files: answerFiles || questionFiles,
    });
    setSelectedFileId(answerFiles?.[0].id || data.question.questionFiles[0].id);
  }, [data, reset]);

  const selectedFile = useMemo(() => {
    if (!data) return null;
    return (data.answer?.answerFiles || data.question.questionFiles).find(
      (file) => file.id === selectedFileId
    );
  }, [data, selectedFileId]);

  const fontSize = useMemo(() => {
    switch (editorSettingData?.editorSetting.editorFontSize) {
      case "SMALL":
        return 14;
      case "MEDIUM":
        return 16;
      case "LARGE":
        return 18;
      default:
        return 16;
    }
  }, [editorSettingData]);

  if (!data) return null;
  if (!editorSettingData) return null;

  const resetCode = () => {
    reset({
      files: data.question.questionFiles.map((f) => ({
        ...f,
        content: f.template,
      })),
    });
  };

  const change = (value?: string) => {
    if (!value) return;
    setTouched(true);
    const fileIndex = watch("files").findIndex(
      (file) => file.id === selectedFile?.id
    );
    if (fileIndex === -1) return;
    setValue(`files.${fileIndex}`, {
      ...watch("files")[fileIndex],
      content: value,
    });
  };

  // パネルのリサイズイベントハンドラ
  const handlePanelResize = (sizes: number[]) => {
    setEditorPanelSize(sizes[0]);
    setTerminalPanelSize(sizes[1]);
  };

  return (
    <div className="h-[calc(100vh-48px)]">
      {showTerminal ? (
        <PanelGroup direction="vertical" onLayout={handlePanelResize}>
          <Panel defaultSize={editorPanelSize} minSize={10}>
            <div className="relative h-full">
              <FileTabs
                files={(
                  data.answer?.answerFiles || data.question.questionFiles
                ).map((file) => ({
                  id: file.id,
                  name: file.name,
                  ext: file.ext,
                }))}
                selectedFileId={selectedFileId}
                setSelectedFileId={setSelectedFileId}
              />
              <Editor
                height={editorHeight}
                fontSize={fontSize}
                language={language(selectedFile?.ext)}
                theme={theme}
                value={
                  watch("files").find((file) => file.id === selectedFile?.id)
                    ?.content
                }
                onChange={change}
                fileName={`${
                  selectedFile?.name
                }.${selectedFile?.ext.toLowerCase()}`}
              />
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
                <ToolBar
                  onExecuteCode={() =>
                    executeCode(
                      watch("files").find((file) => file.id === selectedFileId)
                        ?.content || ""
                    )
                  }
                  reviewBusy={reviewBusy}
                  setReviewBusy={setReviewBusy}
                  touched={touched}
                  onReset={resetCode}
                  onReviewComplete={onReviewComplete}
                  showExecuteButton={showTerminal}
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="flex h-1 cursor-row-resize items-center justify-center bg-gray-800 hover:bg-blue-500">
            <div className="h-1 w-8 rounded-full bg-gray-400"></div>
          </PanelResizeHandle>

          <Panel defaultSize={terminalPanelSize} minSize={10}>
            <Terminal
              executionResult={executionResult}
              iframeRef={iframeRef}
              onClear={resetLogs}
            />
          </Panel>
        </PanelGroup>
      ) : (
        <div className="relative">
          <FileTabs
            files={(
              data.answer?.answerFiles || data.question.questionFiles
            ).map((file) => ({
              id: file.id,
              name: file.name,
              ext: file.ext,
            }))}
            selectedFileId={selectedFileId}
            setSelectedFileId={setSelectedFileId}
          />
          <Editor
            height={editorHeight}
            fontSize={fontSize}
            language={language(selectedFile?.ext)}
            theme={theme}
            value={
              watch("files").find((file) => file.id === selectedFile?.id)
                ?.content
            }
            onChange={change}
            fileName={`${
              selectedFile?.name
            }.${selectedFile?.ext.toLowerCase()}`}
          />
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
            <ToolBar
              onExecuteCode={() =>
                executeCode(
                  watch("files").find((file) => file.id === selectedFileId)
                    ?.content || ""
                )
              }
              reviewBusy={reviewBusy}
              setReviewBusy={setReviewBusy}
              touched={touched}
              onReset={resetCode}
              onReviewComplete={onReviewComplete}
              showExecuteButton={showTerminal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
