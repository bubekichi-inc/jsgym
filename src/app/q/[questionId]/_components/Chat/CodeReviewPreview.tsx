import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeReviewCommentLevel, CodeReviewResult } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ExampleAnswerModal } from "../ExampleAnswerModal";
import { CommentLevelBadge } from "./CommentLevelBadge";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";
import { levelTextMap, typeTextMap } from "@/app/_constants";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { clickButton } from "@/app/_utils/clickButton";
import { calculateScore } from "@/app/_utils/score";

interface Props {
  codeReview: {
    id: string;
    overview: string;
    result: CodeReviewResult;
    comments: {
      id: string;
      targetCode: string;
      fileName: string;
      message: string;
      createdAt: Date;
      level: CodeReviewCommentLevel | null;
    }[];
  };
}

export const CodeReviewPreview: React.FC<Props> = ({ codeReview }) => {
  const [showAnswerModal, setShowAnswerModal] = useState(false);
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

  const shareText = useMemo(() => {
    return `JS Gymで問題をクリアしました！%0a%0a${
      typeTextMap[data?.question.type as keyof typeof typeTextMap]
    }${levelTextMap[data?.question.level as keyof typeof levelTextMap]}%0a${
      data?.question.title
    }%0a%0a${location.origin}/q/${questionId}`;
  }, [data, questionId]);

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
          {data && codeReview.result === "APPROVED" && (
            <span className="text-sm font-bold">
              ({calculateScore(data.question.level, data.question.type)}
              点獲得)
            </span>
          )}
        </div>
        <MarkdownWrapper>{codeReview?.overview}</MarkdownWrapper>
        {codeReview.result === "REJECTED" && (
          <div className="space-y-2 text-xs">
            {codeReview.comments.map((comment) => (
              <div
                key={comment.id}
                className="space-y-1 rounded bg-orange-50 p-3"
              >
                <span className="text-xs italic text-gray-600">
                  {comment.fileName}
                </span>
                {comment.targetCode && (
                  <pre className="overflow-auto rounded bg-editorDark px-3 py-2 text-gray-100">
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
      {codeReview.result === "APPROVED" && (
        <div className="flex w-full items-end justify-end">
          <div className="flex w-full flex-col items-end gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-orange-500">
                成果をシェアしよう！
              </span>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&hashtags=JSGym`}
                target="_blank"
                className=""
              >
                <Image
                  src="/images/x_logo.svg"
                  height={50}
                  width={50}
                  alt="x"
                  className="size-5"
                />
              </a>
              <a
                href={`https://www.threads.net/intent/post?text=${shareText}`}
                target="_blank"
                className=""
              >
                <Image
                  src="/images/threads_logo.svg"
                  height={50}
                  width={50}
                  alt="x"
                  className="size-6"
                />
              </a>
            </div>
            <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
              <Link
                href={`/q`}
                className="flex items-center gap-1 py-1 text-sm text-gray-600 duration-150 hover:underline"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="size-3" />
                <span>問題一覧に戻る</span>
              </Link>
              <div className="flex items-center gap-6">
                <button
                  className="text-xs font-bold text-gray-500 hover:underline"
                  onClick={() => setShowAnswerModal(true)}
                >
                  模範解答例を見る
                </button>
                {data?.nextQuestion && (
                  <Link
                    href={`/q/${data.nextQuestion.id}`}
                    onClick={async () =>
                      await clickButton({ type: "NEXT_QUESTION" })
                    }
                    className="flex items-center gap-2 rounded border border-blue-500 bg-white px-3 py-2 text-sm font-bold text-blue-500 duration-150 hover:bg-blue-50"
                  >
                    <span>次の問題へ</span>
                    <FontAwesomeIcon icon={faChevronRight} className="size-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {data && (
        <ExampleAnswerModal
          title={data.question.title}
          isOpen={showAnswerModal}
          onClose={() => setShowAnswerModal(false)}
          files={data.question.questionFiles}
        />
      )}
    </div>
  );
};
