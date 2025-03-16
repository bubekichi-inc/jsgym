"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { BookmarkButton } from "../BookmarkButton";
import { ExampleAnswerModal } from "../ExampleAnswerModal";
import { StatusBadge } from "../StatusBadge";
import { DropdownMenu } from "./DropdownMenu";
import { Skeleton } from "@/app/_components/Skeleton";
import { lessonStyleMap, lessonTextMap } from "@/app/_constants";
import { useQuestion } from "@/app/_hooks/useQuestion";

export const TitleSection: React.FC = () => {
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={36} />;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="items-start space-y-2 md:flex md:items-center md:gap-3 md:space-y-0">
          <span
            className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold text-white ${
              lessonStyleMap[
                data.question.lesson.id as keyof typeof lessonTextMap
              ]
            }`}
          >
            {
              lessonTextMap[
                data.question.lesson.id as keyof typeof lessonTextMap
              ]
            }
          </span>
          <h1 className="text-base font-bold md:text-lg">
            {data.question.title}
          </h1>
        </div>
        <div className="flex flex-col items-center gap-1 md:flex-row">
          <div className="px-1">
            <StatusBadge status={data.userQuestion?.status || null} />
          </div>
          <BookmarkButton />
          <DropdownMenu onShowAnswer={() => setShowAnswerModal(true)} />
        </div>
      </div>

      <ExampleAnswerModal
        title={data.question.title}
        answer={data.question.exampleAnswer}
        isOpen={showAnswerModal}
        onClose={() => setShowAnswerModal(false)}
        courseType={data.question.lesson.course.name}
      />
    </>
  );
};
