"use client";

import { useState } from "react";
import { useCreateQuestion } from "./_hooks/useCreateQuestion";
import {
  QuestionForm,
  QuestionFormData,
} from "@/app/admin/questions/_components/QuestionForm";

export default function CreateQuestionPage() {
  const { defaultQuestionData, isCreating, error, createQuestion } =
    useCreateQuestion();
  const [formData, setFormData] =
    useState<QuestionFormData>(defaultQuestionData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createQuestion(formData);
    if (success) {
      setSuccessMessage("問題が正常に作成されました");
      // 成功メッセージは表示されるが、すぐにリダイレクトするため見えない可能性が高い
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>エラーが発生しました: </p>
        </div>
      </div>
    );
  }

  return (
    <QuestionForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      isSubmitting={isCreating}
      successMessage={successMessage}
      isEdit={false}
    />
  );
}
