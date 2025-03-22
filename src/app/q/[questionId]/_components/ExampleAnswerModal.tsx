"use client";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionFile } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FileTabs } from "./CodeEditor/FileTabs";
import { Modal } from "@/app/_components/Modal";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  files: QuestionFile[];
}

export const ExampleAnswerModal: React.FC<Props> = ({
  title,
  files,
  isOpen,
  onClose,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0) {
      setSelectedFileId(files[0].id);
    }
  }, [files]);

  const selectedFile = useMemo(() => {
    return files.find((file) => file.id === selectedFileId);
  }, [files, selectedFileId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[800px] space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">「{title}」の模範回答例</p>
        </div>
        <div className="relative">
          <FileTabs
            files={files.map((file) => ({
              id: file.id,
              name: file.name,
              content: file.template,
              ext: file.ext,
            }))}
            selectedFileId={selectedFileId}
            setSelectedFileId={setSelectedFileId}
            showCog={false}
          />
          {selectedFileId && (
            <div className="relative overflow-auto bg-gray-900 p-4">
              <pre className="text-sm text-white">
                <code>{selectedFile?.template}</code>
              </pre>
            </div>
          )}

          <button
            className="absolute bottom-2 right-2 size-6 rounded-full text-gray-600"
            onClick={() => {
              navigator.clipboard.writeText(selectedFile?.template || "");
              toast.success("コードをコピーしました");
            }}
          >
            <FontAwesomeIcon icon={faCopy} className="size-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
