"use client";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React from "react";
import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";

export const Question: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={300} />;

  return (
    <div className="space-y-6 rounded-lg bg-white p-4">
      <div className="space-y-2">
        <p className="font-bold">お題</p>
        <div className="whitespace-pre-wrap break-words text-sm">
          {data.question.content}
        </div>
      </div>

      {data.question.lesson.caution && (
        <div className="flex gap-3 rounded-lg bg-orange-50 p-3">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-orange-400"
          />
          <div className="whitespace-pre-wrap break-words text-xs">
            {data.question.lesson.caution}
          </div>
        </div>
      )}
    </div>
  );
};
