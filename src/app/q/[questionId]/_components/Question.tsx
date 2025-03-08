"use client";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("コピーしました");
      },
      (err) => {
        toast.error("コピー失敗:", err);
      }
    );
  };

  if (!data) return <Skeleton height={300} />;

  return (
    <>
      <div className="space-y-6 rounded-lg bg-white p-4">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3">
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
          <div className="whitespace-pre-wrap break-words text-sm md:text-base">
            {data.question.content}
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-orange-50 p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold">入力例</p>
              <button
                onClick={() => copyToClipboard(data.question.inputCode)}
                className="text-xs"
              >
                <FontAwesomeIcon icon={faCopy} className="mr-1" />
              </button>
            </div>
            <div className="whitespace-pre-wrap break-words rounded bg-editorDark px-3 py-2 text-xs font-semibold text-white">
              {data.question.inputCode}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold">出力例</p>
              <button
                onClick={() => copyToClipboard(data.question.outputCode)}
                className="text-xs"
              >
                <FontAwesomeIcon icon={faCopy} className="mr-1" />
              </button>
            </div>
            <div className="whitespace-pre-wrap break-words rounded bg-editorDark px-3 py-2 text-xs font-semibold text-white">
              {data.question.outputCode}
            </div>
          </div>
        </div>
      </div>

      <ReviewerModal
        isOpen={showReviewerModal}
        onClose={() => setShowReviewerModal(false)}
        reviewer={data.question.reviewer}
      />
    </>
  );
};
