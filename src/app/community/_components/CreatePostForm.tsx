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

      setContent("");
      setIsSubmitting(false);

      // 投稿作成成功時にmutateで返信一覧を更新
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
    <div className={`bg-white rounded-lg shadow p-4 ${parentId ? "ml-8 mt-2" : ""} relative`}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
          disabled={isSubmitting}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 7.293L12.854 2.44a.5.5 0 0 1 .707.707L8.707 8l4.854 4.854a.5.5 0 0 1-.707.707L8 8.707l-4.854 4.854a.5.5 0 0 1-.707-.707L7.293 8 2.44 3.146a.5.5 0 0 1 .707-.707L8 7.293z"/>
          </svg>
        </button>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {parentId ? "返信を投稿" : "投稿を作成"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={parentId ? "返信内容を入力してください" : "投稿内容を入力してください"}
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className=" bg-blue-500 p-2 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "送信中..."
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1.724 1.724a.5.5 0 0 1 .576-.017L14.5 8.5a.5.5 0 0 1 0 .894L2.3 16.276a.5.5 0 0 1-.576-.017.5.5 0 0 1-.17-.568L2.382 12H7.5a.5.5 0 0 0 0-1H2.382L1.554 7.309a.5.5 0 0 1 .17-.585z"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
