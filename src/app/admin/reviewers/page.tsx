"use client";
import {
  faPlus,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Reviewer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewerCard } from "./_components/ReviewerCard";
import { useReviewers } from "./_hooks/useReviewers";

export default function ReviewersPage() {
  const router = useRouter();
  const { reviewers: initialReviewers, isLoading, error } = useReviewers();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useEffect(() => {
    if (initialReviewers?.length > 0) {
      setReviewers(initialReviewers);
    }
  }, [initialReviewers]);

  // 新規レビュワー作成ページへ
  const handleCreateNew = () => {
    router.push("/admin/reviewers/new");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">レビュワー一覧</h1>
        <button
          onClick={handleCreateNew}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          新規レビュワー作成
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="2x"
            className="mb-4 text-blue-500"
          />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : error ? (
        <div className="mb-8 border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-500"
              />
            </div>
            <div className="ml-3">
              <p className="text-red-700">
                データの読み込み中にエラーが発生しました。ページを更新してください。
              </p>
            </div>
          </div>
        </div>
      ) : reviewers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="mb-4 text-gray-600">
            レビュワーがまだ登録されていません
          </p>
          <button
            onClick={handleCreateNew}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            最初のレビュワーを登録する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviewers.map((reviewer) => (
            <ReviewerCard key={reviewer.id} reviewer={reviewer} />
          ))}
        </div>
      )}
    </div>
  );
}
