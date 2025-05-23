"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/_utils/api";
import { CreateThreadRequest } from "@/app/api/community/threads/route";

interface CreateThreadFormProps {
  categoryId: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const CreateThreadForm: React.FC<CreateThreadFormProps> = ({
  categoryId,
  onCancel,
  onSuccess,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("タイトルと内容を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<CreateThreadRequest, { thread: { id: string } }>(
        "/api/community/threads",
        {
          categoryId,
          title: title.trim(),
          content: content.trim(),
        }
      );

      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the new thread
        router.push(`/community/threads/${response.thread.id}`);
      }
    } catch (error) {
      setIsSubmitting(false);
      setError("スレッドの作成に失敗しました");
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        新しいスレッドを作成
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="スレッドのタイトルを入力してください"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="スレッドの内容を入力してください"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "スレッドを作成"}
          </button>
        </div>
      </form>
    </div>
  );
};