"use client";

import { QuestionTagValue } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/app/_utils/api";
import { UpdateQuestionTagRequest } from "@/app/api/question_tags/[questionTagId]/route";
import { CreateQuestionTagRequest } from "@/app/api/question_tags/route";

// QuestionTagValueの表示名マッピング
const TAG_LABEL_MAP: Record<QuestionTagValue, string> = {
  VALUE: "値",
  ARRAY: "配列",
  OBJECT: "オブジェクト",
  FUNCTION: "関数",
  CLASS: "クラス",
  STATE: "ステート",
  PROPS: "プロップス",
  HOOK: "フック",
  ERROR_HANDLING: "エラーハンドリング",
  ASYNC: "非同期",
};

interface Props {
  tag?: {
    id: number;
    name: QuestionTagValue;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuestionTagForm({ tag, onSuccess, onCancel }: Props) {
  const [name, setName] = useState<QuestionTagValue | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 編集モードの場合、初期値をセット
  useEffect(() => {
    if (tag) {
      setName(tag.name);
    }
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("タグ名を選択してください");
      return;
    }

    setIsSubmitting(true);

    try {
      if (tag) {
        // 更新
        await api.put<UpdateQuestionTagRequest, undefined>(
          `/api/question_tags/${tag.id}`,
          { name }
        );
        toast.success("タグを更新しました");
      } else {
        // 新規作成
        await api.post<CreateQuestionTagRequest>("/api/question_tags", {
          name,
        });
        toast.success("タグを作成しました");
      }
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-4 shadow"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          タグ名
        </label>
        <select
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value as QuestionTagValue)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          disabled={isSubmitting}
        >
          <option value="">タグを選択してください</option>
          {Object.entries(TAG_LABEL_MAP).map(([value, label]) => (
            <option key={value} value={value}>
              {label} ({value})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "処理中..." : tag ? "更新" : "作成"}
        </button>
      </div>
    </form>
  );
}
