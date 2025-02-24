import { useParams } from "next/navigation";
import React from "react";
import { questionNumber } from "../_utils/quetionNumber";
import { StatusBadge } from "./StatusBadge";
import { EllipsisButton } from "@/app/_components/EllipsisButton";
import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";

export const TitleSection: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={36} />;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          問題{" "}
          {questionNumber(
            data.question.lesson.course.name,
            data.question.lesson.id,
            data.question.id
          )}
        </p>
        <h1 className="text-2xl font-bold">{data.question.title}</h1>
        <StatusBadge status={data.answer?.status || null} />
      </div>
      <EllipsisButton />
    </div>
  );
};
