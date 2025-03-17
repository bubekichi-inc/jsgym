import { faCaretDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  answer: {
    id: string;
    answer: string;
    createdAt: Date;
  };
}

export const SubmitPreview: React.FC<Props> = ({ answer }) => {
  const [show, setShow] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer.answer);
    toast.success("コードをコピーしました");
  };

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
          <button
            className="absolute right-4 top-4 text-gray-200"
            onClick={handleCopy}
          >
            <FontAwesomeIcon icon={faCopy} className="size-5" />
          </button>
          <pre className="w-full overflow-auto rounded bg-editorDark p-4 text-sm text-white">
            <code>{answer.answer}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
