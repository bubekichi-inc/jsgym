"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";
import { Modal } from "@/app/_components/Modal";
import { useQuestion } from "@/app/_hooks/useQuestion";

interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
}

export const ReviewerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({ questionId });

  if (!data || !data.question.reviewer) return null;

  const { name, bio, profileImageUrl } = data.question.reviewer;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="">
      <div className="relative flex flex-col gap-4 md:flex-row md:items-start">
        <div className="md:w-1/2">
          <Image
            src={profileImageUrl}
            alt={name}
            width={500}
            height={500}
            className="size-full object-cover"
          />
        </div>
        <div className="space-y-4 md:w-1/2">
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">レビュワー</div>
            <h2 className="text-xl font-bold">{name}</h2>
          </div>
          <div className="text-left">
            <MarkdownWrapper>{bio}</MarkdownWrapper>
          </div>
        </div>
      </div>
    </Modal>
  );
};
