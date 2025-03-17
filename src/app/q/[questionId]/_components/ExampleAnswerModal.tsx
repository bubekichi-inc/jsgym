import { Editor } from "@monaco-editor/react";
import React from "react";
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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[800px] space-y-4">
        <p className="text-lg font-bold">「{title}」の模範回答例</p>
        <Editor
          className="bg-editorDark py-6"
          height="300px"
          defaultLanguage={language}
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
