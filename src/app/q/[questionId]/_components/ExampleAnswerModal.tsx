"use client";

import React from "react";
import { toast } from "react-toastify";
import { Modal } from "@/app/_components/Modal";

interface Props {
  title: string;
  answer: string;
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const ExampleAnswerModal: React.FC<Props> = ({
  title,
  answer,
  isOpen,
  onClose,
  language,
}) => {
  console.log(language);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[800px] space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">「{title}」の模範回答例</p>
          <button
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            onClick={() => {
              navigator.clipboard.writeText(answer);
              toast.success("コードをコピーしました");
            }}
          >
            コピー
          </button>
        </div>
        <div className="relative overflow-auto rounded bg-gray-900 p-4">
          <pre className="text-sm text-white">
            <code>{answer}</code>
          </pre>
        </div>
      </div>
    </Modal>
  );
};
