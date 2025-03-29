"use client";

import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionTagValue } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQuestionTags } from "../_hooks/useQuestionTags";
import QuestionTagForm from "./QuestionTagForm";
import { api } from "@/app/_utils/api";

// QuestionTagValueの表示名マッピング
const TAG_LABEL_MAP: Record<string, string> = {
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

export default function QuestionTagList() {
  const { tags, isLoading, error, refresh } = useQuestionTags();
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<{
    id: number;
    name: QuestionTagValue;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  const handleEdit = (tag: { id: number; name: QuestionTagValue }) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleDelete = async (tagId: number) => {
    if (isDeleting) return;

    if (confirm("このタグを削除してもよろしいですか？")) {
      setIsDeleting(true);
      setDeletingTagId(tagId);

      try {
        await api.del(`/api/question_tags/${tagId}`);
        toast.success("タグが削除されました");
        refresh();
      } catch (error) {
        console.error("Error:", error);
        toast.error("タグの削除に失敗しました");
      } finally {
        setIsDeleting(false);
        setDeletingTagId(null);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTag(null);
    refresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTag(null);
  };

  if (isLoading) {
    return <div className="py-4 text-center">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">エラーが発生しました</div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">問題タグ一覧</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            新規タグ作成
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">
            {editingTag ? "タグを編集" : "新規タグ作成"}
          </h3>
          <QuestionTagForm
            tag={editingTag || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {tags.length === 0 ? (
        <div className="rounded-md bg-gray-50 py-4 text-center">
          タグが存在しません
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  タグ名
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  作成日
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  更新日
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {tag.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {TAG_LABEL_MAP[tag.name] || tag.name} ({tag.name})
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(tag.createdAt).toLocaleString("ja-JP")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(tag.updatedAt).toLocaleString("ja-JP")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="mr-3 text-blue-600 hover:text-blue-900"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isDeleting && deletingTagId === tag.id}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      {isDeleting && deletingTagId === tag.id
                        ? "削除中..."
                        : "削除"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
