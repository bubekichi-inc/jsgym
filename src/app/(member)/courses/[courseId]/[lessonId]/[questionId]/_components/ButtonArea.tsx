import { AnswerStatus } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { KeyedMutator } from "swr";
import { Button } from "@/app/_components/Button";
import { api } from "@/app/_utils/api";
import { CodeReviewRequest } from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";
import { QuestionResponse } from "@/app/api/questions/_types/QuestionResponse";
interface Props {
  question: string;
  answer: string;
  answerId: string | null;
  setAnswerId: (answerId: string | null) => void;
  setAnswerCode: (value: string) => void;
  mutate: KeyedMutator<QuestionResponse | undefined>;
  status: AnswerStatus | undefined;
  onResetSuccess: () => void;
}
export const ButtonArea: React.FC<Props> = ({
  question,
  answer,
  answerId,
  setAnswerId,
  setAnswerCode,
  status,
  onResetSuccess,
  mutate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { courseId, lessonId, questionId } = useParams();
  const router = useRouter();
  const saveDraft = async () => {
    try {
      await api.post<Draft, { message: string }>(
        `/api/questions/${questionId}/draft`,
        {
          answer,
        }
      );
      toast.success("下書き保存しました");
    } catch (e) {
      console.error(e);
      toast.error("下書き保存に失敗しました");
    }
  };

  const review = async () => {
    try {
      setIsSubmitting(true);
      await api.post<CodeReviewRequest>(
        `/api/questions/${questionId}/code_review`,
        {
          question,
          answer,
        }
      );
      setIsSubmitting(false);
      mutate();
    } catch (e) {
      console.error(e);
      toast.error("提出に失敗しました");
    }
  };

  const startOver = async () => {
    const dele = window.confirm("回答を削除して良いですか");
    if (!dele) return;
    try {
      await api.del(`/api/answers/${answerId}`);
      mutate();
      setAnswerCode("");
      setAnswerId("");
      onResetSuccess();
      toast.success("削除しました");
    } catch (e) {
      console.error(e);
      toast.error("削除に失敗しました");
    }
  };

  const prev = () => {
    router.replace(`/courses/${courseId}/${lessonId}`);
  };

  //合格済OR未提出の場合はやり直すボタン出さない
  const startOverButton = status !== AnswerStatus.DRAFT && status !== undefined;

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed bottom-0 flex h-[91px] w-full items-center justify-between gap-7 bg-white px-6">
        <button type="button" onClick={prev}>{`< 問題一覧に戻る`}</button>
        <div className="flex gap-7">
          {startOverButton && (
            <Button
              type="button"
              variant="text-red"
              onClick={startOver}
              disabled={isSubmitting}
            >
              やり直す
            </Button>
          )}

          <Button
            type="button"
            variant="bg-gray"
            disabled={isSubmitting}
            onClick={saveDraft}
          >
            下書き保存
          </Button>
          <Button
            type="button"
            variant="bg-blue"
            disabled={isSubmitting}
            onClick={review}
          >
            この内容で提出
          </Button>
        </div>
      </div>
    </>
  );
};
