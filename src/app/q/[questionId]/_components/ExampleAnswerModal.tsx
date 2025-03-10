import { Editor } from "@monaco-editor/react";
import { CourseType } from "@prisma/client";
import React from "react";
import { Modal } from "@/app/_components/Modal";
import { language } from "@/app/_utils/language";

interface Props {
  title: string;
  answer: string;
  isOpen: boolean;
  onClose: () => void;
  courseType: CourseType;
}

export const ExampleAnswerModal: React.FC<Props> = ({
  title,
  answer,
  isOpen,
  onClose,
  courseType,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[800px] space-y-4">
        <p className="text-lg font-bold">「{title}」の模範回答例</p>
        <Editor
          className="bg-editorDark py-6"
          height="300px"
          defaultLanguage={language(courseType || "JAVA_SCRIPT")}
          value={answer}
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
  );
};
