import { faCaretDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

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
  };

  return (
    <div className="space-y-2 px-4 pb-4">
      <div className="flex justify-between text-gray-600">
        <p>レビュー依頼を提出しました</p>
        <button
          className="flex items-center gap-2 py-1"
          onClick={() => setShow((prev) => !prev)}
        >
          <span className="text-xs">提出したコード</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </div>

      {show && (
        <div className="relative">
          <button
            className="absolute right-4 top-4 text-gray-200"
            onClick={handleCopy}
          >
            <FontAwesomeIcon icon={faCopy} className="size-5" />
          </button>
          <pre className="rounded-md bg-editorDark p-4 text-white">
            {answer.answer}
          </pre>
        </div>
      )}
    </div>
  );
};
