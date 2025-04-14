"use client";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../_components/Modal";

interface Props {
  fileName: string;
  fileExt: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewModal: React.FC<Props> = ({
  fileName,
  fileExt,
  content,
  isOpen,
  onClose,
}) => {
  const getExtensionLabel = (ext: string) => {
    switch (ext) {
      case "JS":
        return "JavaScript";
      case "TS":
        return "TypeScript";
      case "JSX":
        return "JSX";
      case "TSX":
        return "TSX";
      case "CSS":
        return "CSS";
      case "HTML":
        return "HTML";
      case "JSON":
        return "JSON";
      default:
        return ext;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[800px] space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">
            {fileName}.{fileExt.toLowerCase()} ({getExtensionLabel(fileExt)})
          </p>
        </div>
        <div className="relative">
          <div className="relative overflow-auto bg-gray-900 p-4">
            <pre className="text-sm text-white">
              <code>{content}</code>
            </pre>

            <button
              className="absolute bottom-2 right-2 size-6 rounded-full text-gray-400 hover:text-white"
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast.success("コードをコピーしました");
              }}
            >
              <FontAwesomeIcon icon={faCopy} className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
