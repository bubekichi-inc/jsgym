"use client";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Language } from "@/app/_types/Language";
interface Props {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  editerHeight: string;
  setValidation: (validation: boolean) => void;
}

export const CodeEditor: React.FC<Props> = ({
  value,
  onChange,
  language,
  editerHeight,
  setValidation,
}) => {
  const handleEditorValidation = (markers: monaco.editor.IMarker[]) => {
    setValidation(markers.length === 0);
  };
  return (
    <Editor
      height={editerHeight}
      defaultLanguage={language}
      value={value}
      onChange={value => value && onChange(value)}
      theme="vs-dark"
      options={{
        fontSize: 20,
        tabSize: 2,
      }}
      onValidate={handleEditorValidation}
    />
  );
};
