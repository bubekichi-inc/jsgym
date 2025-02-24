import { CodeReviewResult } from "@prisma/client";
import React, { useMemo } from "react";
import Image from "next/image";

interface Props {
  codeReview: {
    id: string;
    overview: string;
    result: CodeReviewResult;
    comments: {
      id: string;
      targetCode: string;
      message: string;
      createdAt: Date;
    }[];
  };
}

export const CodeReviewPreview: React.FC<Props> = ({ codeReview }) => {
  const resultText = useMemo(() => {
    switch (codeReview.result) {
      case "APPROVED":
        return "合格";
      case "REJECTED":
        return "もう少し";
    }
  }, []);

  const icon = useMemo(() => {
    switch (codeReview.result) {
      case "APPROVED":
        return "🎉🎉";
      case "REJECTED":
        return "🙏🙏";
    }
  }, []);

  return (
    <div className="rounded bg-white p-4 space-y-4">
      <div className="flex items-center gap-1">
        <Image
          src="/images/AI.svg"
          height={80}
          width={80}
          alt="review"
          className="size-[18px]"
        />
        <p className="text-blue-500 text-xs font-bold">レビュー結果</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-orange-500">
            {resultText}
          </span>
          <span className="text-sm font-bold">です {icon}</span>
        </div>
        <div className="whitespace-pre-wrap break-words">
          {codeReview?.overview}
        </div>
      </div>
    </div>
  );
};
