import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { questionNumber } from "../../_utils/quetionNumber";
import { StatusBadge } from "../StatusBadge";
import { DropdownMenu } from "./DropdownMenu";
import { Modal } from "@/app/_components/Modal";
import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { language } from "@/app/_utils/language";

export const TitleSection: React.FC = () => {
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });

  if (!data) return <Skeleton height={36} />;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            問題{" "}
            {questionNumber(
              data.question.lesson.course.name,
              data.question.lesson.id,
              data.question.id
            )}
          </p>
          <h1 className="text-2xl font-bold">{data.question.title}</h1>
          <StatusBadge status={data.userQuestion?.status || null} />
        </div>
        <DropdownMenu onShowAnswer={() => setShowAnswerModal(true)} />
      </div>

      <Modal isOpen={showAnswerModal} onClose={() => setShowAnswerModal(false)}>
        <div className="w-[800px] space-y-4">
          <p className="text-lg font-bold">{data.question.title}の回答コード</p>
          <Editor
            className="bg-editorDark py-6"
            height="300px"
            defaultLanguage={language(
              data.question.lesson.course.name || "JAVA_SCRIPT"
            )}
            value={data.question.exampleAnswer}
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
      </Modal>
    </>
  );
};
