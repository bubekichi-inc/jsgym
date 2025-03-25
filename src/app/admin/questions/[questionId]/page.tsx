"use client";

import {
  faPlus,
  faSave,
  faTrash,
  faArrowLeft,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { QuestionFileEditor } from "./_components/QuestionFileEditor";
import { Editor } from "@/app/_components/CodeEditor/Editor";
import {
  useAdminQuestion,
  UpdateQuestionRequest,
} from "@/app/admin/questions/[questionId]/_hooks/useAdminQuestion";

// QuestionFileの型をimportする
type QuestionFile = {
  id?: string;
  name: string;
  ext: "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";
  exampleAnswer: string;
  template: string;
  isRoot: boolean;
};

export default function Page() {
  const params = useParams();
  const questionId = params.questionId as string;

  const {
    question,
    questionFiles,
    tags,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    updateQuestion,
    deleteQuestion,
  } = useAdminQuestion(questionId);

  const [formData, setFormData] = useState<
    Omit<UpdateQuestionRequest, "tagIds"> & { tagIds: number[] }
  >({
    title: "",
    content: "",
    inputCode: "",
    outputCode: "",
    level: "BASIC",
    type: "JAVA_SCRIPT",
    reviewerId: 1,
    questionFiles: [],
    tagIds: [],
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (question && questionFiles) {
      setFormData({
        title: question.title,
        content: question.content,
        inputCode: question.inputCode,
        outputCode: question.outputCode,
        level: question.level,
        type: question.type,
        reviewerId: question.reviewerId,
        questionFiles: questionFiles,
        tagIds: tags.map((tag) => tag.tagId),
      });
    }
  }, [question, questionFiles, tags]);

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | boolean | QuestionFile[] | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionFileChange = (
    index: number,
    updatedFile: QuestionFile
  ) => {
    const newFiles = [...formData.questionFiles];
    newFiles[index] = updatedFile;
    handleChange("questionFiles", newFiles);
  };

  const handleAddNewFile = () => {
    const newFile = {
      name: "new-file",
      ext: "JS" as const,
      exampleAnswer: "// 解答例を入力してください",
      template: "// テンプレートを入力してください",
      isRoot: false,
    };
    handleChange("questionFiles", [...formData.questionFiles, newFile]);
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = [...formData.questionFiles];
    newFiles.splice(index, 1);
    handleChange("questionFiles", newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateQuestion(formData);
    if (success) {
      setSuccessMessage("問題が正常に更新されました");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    await deleteQuestion();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-xl font-semibold">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>
            エラーが発生しました:{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
        <Link
          href="/admin/questions"
          className="flex items-center text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          問題一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/questions"
          className="flex items-center text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          問題一覧に戻る
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          {isDeleting ? "削除中..." : "問題を削除"}
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">問題編集: {formData.title}</h1>

        <Link href={`/q/${questionId}`} className="underline" target="_blank">
          問題ページを開く
          <FontAwesomeIcon icon={faExternalLink} className="ml-2" />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">基本情報</h2>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">タイトル</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                レビュアーID
              </label>
              <input
                type="number"
                value={formData.reviewerId}
                onChange={(e) =>
                  handleChange("reviewerId", parseInt(e.target.value))
                }
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">レベル</label>
              <select
                value={formData.level}
                onChange={(e) => handleChange("level", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              >
                <option value="BASIC">基本</option>
                <option value="ADVANCED">応用</option>
                <option value="REAL_WORLD">実践</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">タイプ</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              >
                <option value="JAVA_SCRIPT">JavaScript</option>
                <option value="TYPE_SCRIPT">TypeScript</option>
                <option value="REACT_JS">React (JS)</option>
                <option value="REACT_TS">React (TS)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">問題内容</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="h-32 w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                入力コード
              </label>
              <div className="rounded border border-gray-300">
                <Editor
                  fontSize={14}
                  height="100px"
                  value={formData.inputCode}
                  onChange={(value) => handleChange("inputCode", value || "")}
                  language={
                    formData.type === "TYPE_SCRIPT" ||
                    formData.type === "REACT_TS"
                      ? "typescript"
                      : "javascript"
                  }
                  fileName="input.js"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                出力コード
              </label>
              <div className="rounded border border-gray-300">
                <Editor
                  fontSize={14}
                  height="100px"
                  value={formData.outputCode}
                  onChange={(value) => handleChange("outputCode", value || "")}
                  language={
                    formData.type === "TYPE_SCRIPT" ||
                    formData.type === "REACT_TS"
                      ? "typescript"
                      : "javascript"
                  }
                  fileName="output.js"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">問題ファイル</h2>
            <button
              type="button"
              onClick={handleAddNewFile}
              className="flex items-center rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              新規ファイル追加
            </button>
          </div>

          {formData.questionFiles.map((file, index) => (
            <QuestionFileEditor
              key={file.id || `new-${index}`}
              file={file}
              onChange={(updatedFile) =>
                handleQuestionFileChange(index, updatedFile)
              }
              onDelete={
                formData.questionFiles.length > 1
                  ? () => handleDeleteFile(index)
                  : undefined
              }
              isNew={!file.id}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isUpdating ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
