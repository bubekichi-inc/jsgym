"use client";

import React from "react";
import { Modal } from "@/app/_components/Modal";
import { SimpleCodeViewer } from "./SimpleCodeViewer";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: {
    id: string;
    question: {
      id: string;
      title: string;
    };
    answerFiles: {
      id: string;
      name: string;
      ext: string;
      content: string;
    }[];
    questionFiles: {
      id: string;
      name: string;
      ext: string;
      exampleAnswer: string;
    }[];
    codeReview: {
      id: string;
      result: "APPROVED" | "REJECTED";
      score: number;
    } | null;
  } | null;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  answer,
}) => {
  if (!answer) return null;

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    onClose();
  };

  const exampleFile = answer.questionFiles[0] || null;
  const userFile = answer.answerFiles[0] || null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="1200px">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-bold">{answer.question.title}</h2>
        
        <div className="mb-6">
          <div className="mb-2 flex items-center">
            <span className="mr-2 font-bold">ステータス:</span>
            {answer.codeReview?.result === "APPROVED" ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                合格
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                不合格
              </span>
            )}
            {answer.codeReview?.score && (
              <span className="ml-2 text-sm text-gray-600">
                スコア: {answer.codeReview.score}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-bold">模範回答</h3>
          <div className="h-80 overflow-hidden rounded border border-gray-200">
            {exampleFile && (
              <SimpleCodeViewer
                code={exampleFile.exampleAnswer}
                fileName={exampleFile.name}
                ext={exampleFile.ext}
              />
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-bold">ユーザーの回答</h3>
          <div className="h-80 overflow-hidden rounded border border-gray-200">
            {userFile && (
              <SimpleCodeViewer
                code={userFile.content}
                fileName={userFile.name}
                ext={userFile.ext}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
