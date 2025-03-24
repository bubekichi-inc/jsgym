import { faCaretDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnswerFile } from "@prisma/client";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FileTabs } from "../../../../_components/CodeEditor/FileTabs";

interface Props {
  files: AnswerFile[];
}

export const SubmitPreview: React.FC<Props> = ({ files }) => {
  const [show, setShow] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(
    files[0]?.id || null
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("コードをコピーしました");
  };

  const selectedFile = useMemo(() => {
    return files.find((file) => file.id === selectedFileId);
  }, [files, selectedFileId]);

  return (
    <div className="space-y-2 pb-4 pl-4">
      <div className="flex justify-between text-gray-600">
        <p>コードを提出しました。</p>
        <button
          className="flex items-center gap-1 py-1"
          onClick={() => setShow((prev) => !prev)}
        >
          <span className="text-xs">提出したコード</span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`size-3 duration-300 ${show && "rotate-180"}`}
          />
        </button>
      </div>

      {show && (
        <div className="relative w-full overflow-auto">
          <div className="relative">
            <FileTabs
              files={files.map((file) => ({
                id: file.id,
                name: file.name,
                content: file.content,
                ext: file.ext,
              }))}
              selectedFileId={selectedFileId}
              setSelectedFileId={setSelectedFileId}
              showCog={false}
            />
            {selectedFileId && (
              <div className="relative overflow-auto bg-gray-900 p-4">
                <pre className="text-sm text-white">
                  <code>{selectedFile?.content}</code>
                </pre>
              </div>
            )}

            <button
              className="absolute bottom-2 right-2 size-6 rounded-full text-gray-600"
              onClick={() => handleCopy(selectedFile?.content || "")}
            >
              <FontAwesomeIcon icon={faCopy} className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
