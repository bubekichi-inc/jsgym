import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeReviewCommentLevel, CodeReviewResult } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { CommentLevelBadge } from "./CommentLevelBadge";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";
import { useQuestion } from "@/app/_hooks/useQuestion";

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
      level: CodeReviewCommentLevel | null;
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

  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({ questionId });

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
                className="space-y-1 rounded bg-orange-50 p-3"
              >
                {comment.targetCode && (
                  <pre className="rounded bg-editorDark px-3 py-1 text-gray-100">
                    {comment.targetCode}
                  </pre>
                )}
                <div className="flex items-center gap-2">
                  <CommentLevelBadge level={comment.level} />
                  <MarkdownWrapper>{comment.message}</MarkdownWrapper>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {data?.nextQuestion && codeReview.result === "APPROVED" && (
        <div className="flex justify-end">
          <Link
            href={`/c/${data.nextQuestion.id}`}
            className="flex items-center gap-1 rounded border border-blue-500 px-3 py-1 text-sm font-bold text-blue-500 duration-150 hover:bg-blue-50"
          >
            <span>次の問題へ進む</span>
            <FontAwesomeIcon icon={faArrowRight} className="size-3" />
          </Link>
        </div>
      )}
    </div>
  );
};
