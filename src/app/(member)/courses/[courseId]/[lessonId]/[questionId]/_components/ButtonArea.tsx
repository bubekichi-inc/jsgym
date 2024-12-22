import { StatusType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { KeyedMutator } from "swr";
import { ChatMessage } from "../_types/ChatMessage";
import { ReviewModal } from "./ReviewModal";
import { Button } from "@/app/_components/Button";
import { api } from "@/app/_utils/api";
import {
  CodeReviewResponse,
  CodeReviewRequest,
} from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";
import { QuestionResponse } from "@/app/api/questions/_types/QuestionResponse";
interface Props {
  question: string;
  answer: string;
  answerId: string | null;
  setAnswerId: (answerId: string | null) => void;
  setAnswerCode: (value: string) => void;
  mutate: KeyedMutator<QuestionResponse | undefined>;
  status: StatusType | undefined;
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
  const [isCorrect, setIsCorrect] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(true);
      const reviewContent = await api.post<
        CodeReviewRequest,
        CodeReviewResponse
      >(`/api/questions/${questionId}/code_review`, {
        question,
        answer,
      });
      setIsCorrect(reviewContent.isCorrect);
      setChatMessages(reviewContent.messages);
      setAnswerId(reviewContent.answerId);
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
      setIsCorrect(false);
      setChatMessages([]);
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
  const startOverButton = status !== StatusType.DRAFT && status !== undefined;

  //提出済みの場合のみレビューを見るボタン表示
  const reviewModalOpen =
    status === StatusType.PASSED || status === StatusType.REVISION_REQUIRED;
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
          {reviewModalOpen && (
            <Button
              type="button"
              variant="text-blue"
              onClick={() => setIsOpen(true)}
              disabled={isSubmitting}
            >
              レビューを見る
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

      <ReviewModal
        isCorrect={isCorrect}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isSubmitting={isSubmitting}
        answerId={answerId}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </>
  );
};
