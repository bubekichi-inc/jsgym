"use client";

import React from "react";
import { Editor } from "@/app/_components/CodeEditor/Editor";

interface SimpleCodeViewerProps {
  code: string;
  fileName?: string;
  ext?: string;
}

export const SimpleCodeViewer: React.FC<SimpleCodeViewerProps> = ({
  code,
  fileName = "index",
  ext = "js",
}) => {
  const getLanguage = (extension: string): "javascript" | "typescript" => {
    const ext = extension.toLowerCase();
    switch (ext) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
      case "jsx":
      default:
        return "javascript";
    }
  };

  return (
    <Editor
      height="100%"
      fontSize={14}
      language={getLanguage(ext)}
      theme="slack-ochin"
      value={code}
      onChange={() => {}}
      fileName={`${fileName}.${ext.toLowerCase()}`}
    />
  );
};
