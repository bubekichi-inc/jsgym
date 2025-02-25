import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";
import { faCaretDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

interface Props {
  answer: {
    id: string;
    answer: string;
    createdAt: Date;
  };
}

export const SubmitPreview: React.FC<Props> = ({ answer }) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  const [show, setShow] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer.answer);
  };

  return (
    <div className="space-y-2 px-4 pb-4">
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
        <div className="relative">
          <button
            className="absolute right-4 top-4 text-gray-200"
            onClick={handleCopy}
          >
            <FontAwesomeIcon icon={faCopy} className="size-5" />
          </button>
          <Editor
            className="bg-editorDark py-6"
            height="300px"
            defaultLanguage={language(
              data?.question.lesson.course.name || "JAVA_SCRIPT"
            )}
            value={answer.answer}
            theme="vs-dark"
            options={{
              fontSize: 14,
              tabSize: 2,
              readOnly: true,
              readOnlyMessage: {
                value: "編集できません",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
