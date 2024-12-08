"use client";
import Editor from "@monaco-editor/react";

type Language = "javascript" | "typescript" | "html" | "css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

export const CodeEditor: React.FC<Props> = ({ value, onChange, language }) => {
  return (
    <Editor
      height="100%"
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
