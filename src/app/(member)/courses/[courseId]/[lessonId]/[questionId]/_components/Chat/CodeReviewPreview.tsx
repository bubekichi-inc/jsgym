import { CodeReviewResult } from "@prisma/client";
import Image from "next/image";
import React, { useMemo } from "react";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";

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
  }, [codeReview.result]);

  const icon = useMemo(() => {
    switch (codeReview.result) {
      case "APPROVED":
        return "🎉🎉";
      case "REJECTED":
        return "🙏🙏";
    }
  }, [codeReview.result]);

  return (
    <div className="space-y-4 rounded bg-white p-4">
      <div className="flex items-center gap-1">
        <Image
          src="/images/AI.svg"
          height={80}
          width={80}
          alt="review"
          className="size-[18px]"
        />
        <p className="text-xs font-bold text-blue-500">レビュー結果</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-orange-500">
            {resultText}
          </span>
          <span className="text-sm font-bold">です {icon}</span>
        </div>
        <MarkdownWrapper>{codeReview?.overview}</MarkdownWrapper>
        {codeReview.result === "REJECTED" && (
          <div className="space-y-2 text-xs">
            {codeReview.comments.map((comment) => (
              <div
                key={comment.id}
                className="space-y-2 rounded bg-orange-50 p-3"
              >
                {comment.targetCode && (
                  <pre className="rounded bg-editorDark px-3 py-1 text-gray-100">
                    {comment.targetCode}
                  </pre>
                )}
                <MarkdownWrapper>{comment.message}</MarkdownWrapper>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
