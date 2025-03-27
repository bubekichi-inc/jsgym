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
import { Editor } from "@/app/_components/CodeEditor/Editor";
import { QuestionFileEditor } from "@/app/admin/questions/[questionId]/_components/QuestionFileEditor";
import { TagMultiSelect } from "@/app/admin/questions/_components/TagMultiSelect";

// QuestionFileの型定義
export type QuestionFile = {
  id?: string;
  name: string;
  ext: "JS" | "TS" | "CSS" | "HTML" | "JSX" | "TSX" | "JSON";
  exampleAnswer: string;
  template: string;
  isRoot: boolean;
};

// フォームデータの型定義
export type QuestionFormData = {
  title: string;
  content: string;
  inputCode: string;
  outputCode: string;
  level: "BASIC" | "ADVANCED" | "REAL_WORLD";
  type: "JAVA_SCRIPT" | "TYPE_SCRIPT" | "REACT_JS" | "REACT_TS";
  reviewerId: number;
  questionFiles: QuestionFile[];
  tagIds: number[];
};

interface QuestionFormProps {
  formData: QuestionFormData;
  setFormData: (data: QuestionFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
  successMessage: string | null;
  isEdit: boolean;
  questionId?: string;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onDelete,
  isDeleting,
  successMessage,
  isEdit,
  questionId,
}) => {
  const handleChange = (
    field: keyof QuestionFormData,
    value: string | number | boolean | QuestionFile[] | number[]
  ) => {
    setFormData({ ...formData, [field]: value });
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

  return (
    <div className="">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/questions"
          className="flex items-center text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          問題一覧に戻る
        </Link>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            {isDeleting ? "削除中..." : "問題を削除"}
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">
          {isEdit ? `問題編集: ${formData.title}` : "新規問題作成"}
        </h1>

        {isEdit && questionId && (
          <Link href={`/q/${questionId}`} className="underline" target="_blank">
            問題ページを開く
            <FontAwesomeIcon icon={faExternalLink} className="ml-2" />
          </Link>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
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

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">タグ</label>
            <TagMultiSelect
              selectedTagIds={formData.tagIds}
              onChange={(tagIds) => handleChange("tagIds", tagIds)}
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
            disabled={isSubmitting}
            className="flex items-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isSubmitting ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
};
