"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAdminQuestion } from "@/app/admin/questions/[questionId]/_hooks/useAdminQuestion";
import {
  QuestionForm,
  QuestionFormData,
} from "@/app/admin/questions/_components/QuestionForm";

export default function EditQuestionPage() {
  const params = useParams();
  const questionId = params.questionId as string;

  const {
    question,
    questionFiles,
    tags,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    updateQuestion,
    deleteQuestion,
  } = useAdminQuestion(questionId);

  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    content: "",
    inputCode: "",
    outputCode: "",
    level: "BASIC",
    type: "JAVA_SCRIPT",
    reviewerId: 1,
    questionFiles: [],
    tagIds: [],
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (question && questionFiles) {
      setFormData({
        title: question.title,
        content: question.content,
        inputCode: question.inputCode,
        outputCode: question.outputCode,
        level: question.level,
        type: question.type,
        reviewerId: question.reviewerId,
        questionFiles: questionFiles,
        tagIds: tags.map((tag) => tag.tagId),
      });
    }
  }, [question, questionFiles, tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateQuestion(formData);
    if (success) {
      setSuccessMessage("問題が正常に更新されました");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    await deleteQuestion();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-xl font-semibold">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>
            エラーが発生しました:{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <QuestionForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      successMessage={successMessage}
      isEdit={true}
      questionId={questionId}
    />
  );
}
