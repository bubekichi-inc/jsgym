"use client";
import {
  faSpinner,
  faExclamationTriangle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReviewerForm } from "../_components/ReviewerForm";
import { useReviewer } from "../_hooks/useReviewers";

export default function ReviewerEditPage() {
  const params = useParams();
  const reviewerId =
    typeof params.reviewerId === "string"
      ? parseInt(params.reviewerId)
      : Array.isArray(params.reviewerId)
      ? parseInt(params.reviewerId[0])
      : 0;

  const { reviewer, isLoading, error } = useReviewer(reviewerId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="2x"
            className="mb-4 text-blue-500"
          />
          <p className="text-gray-600">レビュワー情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !reviewer) {
    return (
      <div className="container mx-auto px-4 py-8">
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
                レビュワー情報の取得に失敗しました。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/admin/reviewers"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            レビュワー一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewerForm initialData={reviewer} />
    </div>
  );
}
