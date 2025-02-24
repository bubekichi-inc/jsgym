import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React from "react";

export const Question: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={300} />;

  return (
    <div className="bg-white rounded-lg p-4 space-y-6">
      <div className="space-y-3">
        <p className="font-bold">お題</p>
        <div className="text-sm whitespace-pre-wrap break-words">
          {data.question.content}
        </div>
      </div>

      {data.question.lesson.caution && (
        <div className="flex p-3 bg-orange-50 rounded-lg gap-3">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-orange-400"
          />
          <div className="text-xs whitespace-pre-wrap break-words">
            {data.question.lesson.caution}
          </div>
        </div>
      )}
    </div>
  );
};
