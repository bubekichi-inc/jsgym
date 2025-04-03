"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { BookmarkButton } from "../BookmarkButton";
import { ExampleAnswerModal } from "../ExampleAnswerModal";
import { StatusBadge } from "../StatusBadge";
import { DropdownMenu } from "./DropdownMenu";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { Skeleton } from "@/app/_components/Skeleton";

import { useQuestion } from "@/app/_hooks/useQuestion";

export const TitleSection: React.FC = () => {
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const params = useParams();
  const questionId = params.questionId as string;
  const { data: me } = useMe();
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={36} />;

  return (
    <>
      <div className="flex items-center justify-between gap-1 md:gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold md:text-lg">
            {data.question.title}
          </h1>
          {me?.role === "ADMIN" && (
            <Link
              href={`/admin/questions/${data.question.id}`}
              className="text-xs font-bold underline"
            >
              管理画面で編集
            </Link>
          )}
        </div>
        <div className="flex items-center md:gap-1">
          <div className="px-1">
            <StatusBadge status={data.userQuestion?.status || null} />
          </div>
          <BookmarkButton />
          <DropdownMenu onShowAnswer={() => setShowAnswerModal(true)} />
        </div>
      </div>

      <ExampleAnswerModal
        title={data.question.title}
        isOpen={showAnswerModal}
        onClose={() => setShowAnswerModal(false)}
        files={data.question.questionFiles}
      />
    </>
  );
};
