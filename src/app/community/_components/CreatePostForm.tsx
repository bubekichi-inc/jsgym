"use client";

import { useState } from "react";
import { api } from "@/app/_utils/api";
import { CreatePostRequest } from "@/app/api/community/posts/route";

interface CreatePostFormProps {
  threadId: string;
  parentId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  threadId,
  parentId,
  onCancel,
  onSuccess,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("内容を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post<CreatePostRequest>(
        "/api/community/posts",
        {
          threadId,
          parentId,
          content: content.trim(),
        }
      );

      setIsSubmitting(false);
      setContent("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setIsSubmitting(false);
      setError("投稿の作成に失敗しました");
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${parentId ? "ml-8 mt-2" : ""}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {parentId ? "返信を投稿" : "投稿を作成"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={parentId ? "返信内容を入力してください" : "投稿内容を入力してください"}
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
            {isSubmitting ? "送信中..." : "投稿する"}
          </button>
        </div>
      </form>
    </div>
  );
};