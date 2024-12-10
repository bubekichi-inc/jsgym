"use client";
import { Editor } from "@monaco-editor/react";
import { Language } from "@/app/_types/Language";

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

export const CodeEditor: React.FC<Props> = ({ value, onChange, language }) => {
  return (
    <Editor
      height="50vh"
      defaultLanguage={language}
      value={value}
      onChange={value => value && onChange(value)}
      theme="vs-dark"
      options={{
        fontSize: 20,
        tabSize: 2,
      }}
    />
  );
};
