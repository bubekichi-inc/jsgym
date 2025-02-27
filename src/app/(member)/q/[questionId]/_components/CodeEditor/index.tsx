"use client";

import { Editor } from "@monaco-editor/react";
import { EditorTheme } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Tabs } from "./Tabs";
import { Terminal } from "./Terminal";
import { ToolBar } from "./ToolBar";
import { useEditorSetting } from "@/app/(member)/_hooks/useEditorSetting";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";

interface Props {
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
}

export const CodeEditor: React.FC<Props> = ({ reviewBusy, setReviewBusy }) => {
  const params = useParams();
  const { data: editorSettingData } = useEditorSetting();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const { iframeRef, executeCode, executionResult } = useCodeExecutor();

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

  return (
    <div className="">
      <div className="relative">
        <Tabs />
        <Editor
          className="bg-editorDark"
          height="calc(100vh - 48px - 280px - 36px)"
          defaultLanguage={language(data.question.lesson.course.name)}
          value={value}
          onChange={(value) => value && setValue(value)}
          theme={theme}
          options={{
            fontSize,
            tabSize: 2,
          }}
          loading={
            <div className="text-sm font-bold text-gray-400">Loading...</div>
          }
        />
        <ToolBar
          answer={value}
          onExecuteCode={() => executeCode(value)}
          reviewBusy={reviewBusy}
          setReviewBusy={setReviewBusy}
          touched={touched}
          onReset={reset}
        />
      </div>
      <Terminal executionResult={executionResult} iframeRef={iframeRef} />
    </div>
  );
};
