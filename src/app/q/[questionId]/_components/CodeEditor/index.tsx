"use client";

import { Editor } from "@monaco-editor/react";
import { EditorTheme } from "@prisma/client";
import { shikiToMonaco } from "@shikijs/monaco";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createHighlighter } from "shiki";

import { Tabs } from "./Tabs";
import { ToolBar } from "./ToolBar";
import { useEditorSetting } from "@/app/(member)/_hooks/useEditorSetting";
import { Preview } from "@/app/_components/ReactPreview";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
import { useDevice } from "@/app/_hooks/useDevice";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";

interface Props {
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
  onReviewComplete: () => void;
}

export const CodeEditor: React.FC<Props> = ({
  reviewBusy,
  setReviewBusy,
  onReviewComplete,
}) => {
  const { isSp } = useDevice();
  const params = useParams();
  const { data: editorSettingData } = useEditorSetting();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const { iframeRef, executeCode, executionResult, resetLogs } =
    useCodeExecutor();
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.tsx": "",
  });

  const editorHeight = useMemo(() => {
    if (isSp) {
      return "calc(60vh)";
    }
    return "calc(100vh - 48px - 280px - 36px)";
  }, [isSp]);

  const theme = useMemo(() => {
    switch (editorSettingData?.editorSetting.editorTheme) {
      case EditorTheme.LIGHT:
        return "vs-light";
      case EditorTheme.DARK:
        return "vs-dark";
      default:
        return "vs-dark";
    }
  }, [editorSettingData]);

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

  useEffect(() => {
    if (!data) return;
    setValue(data.answer?.answer || data.question.template);
    setFiles({
      "/App.tsx": data.answer?.answer || data.question.template,
    });
  }, [data]);

  useEffect(() => {
    if (value !== data?.question.template) {
      setTouched(true);
    } else {
      setTouched(false);
    }
  }, [value, data]);

  if (!data) return null;
  if (!editorSettingData) return null;

  const reset = () => setValue(data.question.template);

  const change = (value?: string) => {
    if (!value) return;
    setValue(value);
    setFiles({
      "/App.tsx": value,
    });
  };

  return (
    <div className="">
      <div className="relative">
        <Tabs />
        <Editor
          className="bg-editorDark"
          height={editorHeight}
          defaultLanguage={language(data.question.lesson.course.name)}
          value={value}
          onChange={change}
          theme={theme}
          options={{
            fontSize,
            tabSize: 2,
          }}
          loading={
            <div className="text-sm font-bold text-gray-400">Loading...</div>
          }
          onMount={(editor, monaco) => {
            (async () => {
              const highlighter = await createHighlighter({
                themes: ["dark-plus"],
                langs: ["jsx", "tsx", "vue", "svelte"],
              });

              monaco.languages.register({ id: "jsx" });
              monaco.languages.register({ id: "tsx" });
              monaco.languages.register({ id: "vue" });
              monaco.languages.register({ id: "svelte" });
              shikiToMonaco(highlighter, monaco);
            })();
          }}
        />
        <ToolBar
          answer={value}
          onExecuteCode={() => executeCode(value)}
          reviewBusy={reviewBusy}
          setReviewBusy={setReviewBusy}
          touched={touched}
          onReset={reset}
          onReviewComplete={onReviewComplete}
        />
      </div>
      <Preview files={files} />
      {/* <Terminal
        executionResult={executionResult}
        iframeRef={iframeRef}
        onClear={resetLogs}
      /> */}
    </div>
  );
};
