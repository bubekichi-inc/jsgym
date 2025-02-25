"use client";

import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Terminal } from "./Terminal";
import { ToolBar } from "./ToolBar";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";

interface Props {
  setReviewBusy: (busy: boolean) => void;
}

export const CodeEditor: React.FC<Props> = ({ setReviewBusy }) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });
  const [value, setValue] = useState("");
  const { iframeRef, executeCode, executionResult } = useCodeExecutor();

  useEffect(() => {
    if (!data) return;
    setValue(data.answer?.answer || data.question.template);
  }, [data]);

  if (!data) return null;

  return (
    <div className="">
      <div className="relative">
        <Editor
          className="bg-editorDark py-6"
          height="calc(100vh - 48px - 320px)"
          defaultLanguage={language(data.question.lesson.course.name)}
          value={value}
          onChange={(value) => value && setValue(value)}
          theme="vs-dark"
          options={{
            fontSize: 16,
            tabSize: 2,
          }}
        />
        <ToolBar
          answer={value}
          onExecuteCode={() => executeCode(value)}
          setReviewBusy={setReviewBusy}
        />
      </div>
      <Terminal executionResult={executionResult} iframeRef={iframeRef} />
    </div>
  );
};
