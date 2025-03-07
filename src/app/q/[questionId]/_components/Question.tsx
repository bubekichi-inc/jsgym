"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { ReviewerModal } from "./ReviewerModal";
import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";

export const Question: React.FC = () => {
  const params = useParams();
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={300} />;

  return (
    <>
      <div className="space-y-6 rounded-lg bg-white p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            {data.question.reviewer && (
              <button onClick={() => setShowReviewerModal(true)}>
                <Image
                  src={data.question.reviewer.profileImageUrl}
                  alt={data.question.reviewer.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>
            )}
            <p className="font-bold">お題</p>
          </div>
          <div className="whitespace-pre-wrap break-words text-sm">
            {data.question.content}
          </div>
        </div>

        <div className="space-y-1 rounded-lg bg-orange-50 p-3">
          <p className="text-xs font-bold">入出力例</p>
          <div className="whitespace-pre-wrap break-words text-xs">
            {data.question.example}
          </div>
        </div>
      </div>

      <ReviewerModal
        isOpen={showReviewerModal}
        onClose={() => setShowReviewerModal(false)}
      />
    </>
  );
};
