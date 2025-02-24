import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
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
        <div className="">
          <pre className="rounded-md bg-editorDark p-4 text-white">
            {answer.answer}
          </pre>
        </div>
      )}
    </div>
  );
};
