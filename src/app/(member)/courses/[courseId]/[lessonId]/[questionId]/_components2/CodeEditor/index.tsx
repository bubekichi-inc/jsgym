"use client";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToolBar } from "./ToolBar";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";

export const CodeEditor: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!data) return;
    setValue(data.answer?.answer || data.question.template);
  }, [data]);

  if (!data) return null;

  return (
    <div className="relative">
      <Editor
        className="bg-[#1e1e1e] py-6"
        height="50vh"
        defaultLanguage={language(data.question.lesson.course.name)}
        value={value}
        onChange={(value) => value && setValue(value)}
        theme="vs-dark"
        options={{
          fontSize: 16,
          tabSize: 2,
        }}
      />
      <ToolBar answer={value} />
    </div>
  );
};
