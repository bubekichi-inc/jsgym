import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";
import { faCaretDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@monaco-editor/react";
import { CodeReviewResult } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
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
        <div className="flex"></div>
        <div className="whitespace-pre-wrap break-words">
          {codeReview?.overview}
        </div>
      </div>
    </div>
  );
};
