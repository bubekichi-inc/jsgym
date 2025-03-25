"use client";

import { useState, useEffect, useCallback } from "react";
import { Editor } from "@/app/_components/CodeEditor/Editor";
import { EditorLanguage } from "@/app/_types/EditorLanguage";

type FileExtension = "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";

type QuestionFile = {
  id?: string;
  name: string;
  ext: FileExtension;
  exampleAnswer: string;
  template: string;
  isRoot: boolean;
};

interface Props {
  file: QuestionFile;
  onChange: (updatedFile: QuestionFile) => void;
  onDelete?: () => void;
  isNew?: boolean;
}

export const QuestionFileEditor = ({
  file,
  onChange,
  onDelete,
  isNew = false,
}: Props) => {
  // 個別のフィールド用のステートを作成して独立して管理する
  const [fileName, setFileName] = useState(file.name);
  const [fileExt, setFileExt] = useState(file.ext);
  const [isRoot, setIsRoot] = useState(file.isRoot);
  const [template, setTemplate] = useState(file.template);
  const [exampleAnswer, setExampleAnswer] = useState(file.exampleAnswer);

  // propsが変更されたときに各フィールドのステートを更新
  useEffect(() => {
    setFileName(file.name);
    setFileExt(file.ext);
    setIsRoot(file.isRoot);
    setTemplate(file.template);
    setExampleAnswer(file.exampleAnswer);
  }, [file]);

  // 値が変更されたときに親コンポーネントに通知する共通関数
  const notifyChange = useCallback(() => {
    const updatedFile: QuestionFile = {
      ...file,
      name: fileName,
      ext: fileExt,
      isRoot: isRoot,
      template: template,
      exampleAnswer: exampleAnswer,
    };
    onChange(updatedFile);
  }, [file, fileName, fileExt, isRoot, template, exampleAnswer, onChange]);

  // 各フィールドの変更ハンドラ
  const handleNameChange = (value: string) => {
    setFileName(value);
    // 即時通知は行わない
  };

  const handleExtChange = (value: FileExtension) => {
    setFileExt(value);
    // 即時通知は行わない
  };

  const handleIsRootChange = (value: boolean) => {
    setIsRoot(value);
    // 即時通知は行わない
  };

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    // 即時通知は行わない
  };

  const handleExampleAnswerChange = (value: string) => {
    setExampleAnswer(value);
    // 即時通知は行わない
  };

  // ステートが変更されたら親コンポーネントに通知
  useEffect(() => {
    // ステートの初期化時には実行しない
    if (
      fileName !== file.name ||
      fileExt !== file.ext ||
      isRoot !== file.isRoot ||
      template !== file.template ||
      exampleAnswer !== file.exampleAnswer
    ) {
      notifyChange();
    }
  }, [fileName, fileExt, isRoot, template, exampleAnswer, file]);

  // エディタで使用する言語を拡張子から決定
  const getEditorLanguage = (ext: FileExtension): EditorLanguage => {
    switch (ext) {
      case "TS":
      case "TSX":
        return "typescript";
      default:
        return "javascript";
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isNew ? "新規ファイル" : "ファイル編集"}
        </h3>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded border border-red-600 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          >
            削除
          </button>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">ファイル名</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">拡張子</label>
          <select
            value={fileExt}
            onChange={(e) => handleExtChange(e.target.value as FileExtension)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            required
          >
            <option value="JS">JS</option>
            <option value="TS">TS</option>
            <option value="CSS">CSS</option>
            <option value="HTML">HTML</option>
            <option value="JSX">JSX</option>
            <option value="TSX">TSX</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`isRoot-${file.id || "new"}`}
            checked={isRoot}
            onChange={(e) => handleIsRootChange(e.target.checked)}
            className="mr-2"
          />
          <label
            htmlFor={`isRoot-${file.id || "new"}`}
            className="text-sm font-medium"
          >
            ルートファイル
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium">テンプレート</label>
        <div className="rounded border border-gray-300">
          <Editor
            fontSize={14}
            height="400px"
            value={template}
            onChange={(value) => handleTemplateChange(value || "")}
            language={getEditorLanguage(fileExt)}
            fileName={`${fileName}.${fileExt.toLowerCase()}`}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">解答例</label>
        <div className="rounded border border-gray-300">
          <Editor
            fontSize={14}
            height="400px"
            value={exampleAnswer}
            onChange={(value) => handleExampleAnswerChange(value || "")}
            language={getEditorLanguage(fileExt)}
            fileName={`${fileName}_answer.${fileExt.toLowerCase()}`}
          />
        </div>
      </div>
    </div>
  );
};
