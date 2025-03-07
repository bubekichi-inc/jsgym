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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-4 ">
        <div className="flex items-center justify-start gap-4">
          <Image
            src={profileImageUrl}
            alt={name}
            width={160}
            height={160}
            className="rounded-full"
          />
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        <div className="text-left">
          <MarkdownWrapper>{bio}</MarkdownWrapper>
        </div>
      </div>
    </Modal>
  );
};
