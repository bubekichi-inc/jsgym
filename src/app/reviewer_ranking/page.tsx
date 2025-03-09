"use client";

import Image from "next/image";
import { useState } from "react";
import { useFetch } from "../_hooks/useFetch";
import {
  ReviewerRanking,
  ReviewerRankingResponse,
} from "../api/reviewer_ranking/route";
import { ReviewerModal } from "../q/[questionId]/_components/ReviewerModal";

// ReviewerModalに必要な型
type Reviewer = {
  id: number;
  name: string;
  bio: string;
  profileImageUrl: string;
};

export default function ReviewerRankingPage() {
  const { data, error, isLoading } = useFetch<ReviewerRankingResponse>(
    "/api/reviewer_ranking"
  );
  const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReviewerClick = (reviewer: ReviewerRanking) => {
    // ReviewerRankingからReviewerに変換
    const reviewerData: Reviewer = {
      id: reviewer.id,
      name: reviewer.name,
      bio: reviewer.bio,
      profileImageUrl: reviewer.profileImageUrl,
    };
    setSelectedReviewer(reviewerData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-y-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">エラー：</strong>
          <span className="block sm:inline">データの取得に失敗しました。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        レビュワーランキング
      </h1>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                順位
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                レビュワー
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                レビュー数
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data?.reviewers.map((reviewer, index) => (
              <tr
                key={reviewer.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {index === 0 && (
                        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-yellow-400 text-white">
                          1
                        </span>
                      )}
                      {index === 1 && (
                        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-gray-300 text-white">
                          2
                        </span>
                      )}
                      {index === 2 && (
                        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-yellow-600 text-white">
                          3
                        </span>
                      )}
                      {index > 2 && (
                        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={() => handleReviewerClick(reviewer)}
                  >
                    <div className="relative size-10 shrink-0 ">
                      <Image
                        className="size-10 rounded-full transition-opacity hover:opacity-80"
                        src={reviewer.profileImageUrl}
                        alt={reviewer.name}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {reviewer.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {reviewer.reviewCount}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* レビュワーモーダル */}
      <ReviewerModal
        reviewer={selectedReviewer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
