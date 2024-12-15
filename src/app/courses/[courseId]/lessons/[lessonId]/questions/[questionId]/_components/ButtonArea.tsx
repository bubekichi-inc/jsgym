import { StatusType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { KeyedMutator } from "swr";
import { ChatMessage } from "../_types/ChatMessage";
import { ReviewModal } from "./ReviewModal";
import { useApi } from "@/app/_hooks/useApi";
import {
  CodeReviewResponse,
  CodeReviewRequest,
} from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";
import { QuestionResponse } from "@/app/api/questions/_types/QuestionResponse";

interface Props {
  question: string;
  answer: string;
  answerId: string;
  setAnswerId: (answerId: string) => void;
  mutate: KeyedMutator<QuestionResponse>;
  setValue: (value: string) => void;
  status: StatusType | undefined;
}
export const ButtonArea: React.FC<Props> = ({
  question,
  answer,
  answerId,
  setAnswerId,
  mutate,
  setValue,
  status,
}) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post, del } = useApi();
  const { courseId, lessonId, questionId } = useParams();
  const router = useRouter();
  const saveDraft = async () => {
    try {
      await post<Draft, { message: string }>(
        `/api/questions/${questionId}/draft`,
        {
          answer,
        }
      );
      toast.success("下書き保存しました");
    } catch (e) {
      console.error(e);
      toast.success("下書き保存に失敗しました");
    }
  };

  const review = async () => {
    try {
      setIsSubmitting(true);
      setIsOpen(true);
      const reviewContent = await post<CodeReviewRequest, CodeReviewResponse>(
        `/api/questions/${questionId}/code_review`,
        {
          question,
          answer,
        }
      );
      setIsCorrect(reviewContent.isCorrect);
      setChatMessages(reviewContent.messages);
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
      await del(`/api/answer/${answerId}`);
      mutate();
      setValue("");
      setIsCorrect(false);
      setChatMessages([]);
      setAnswerId("");
      toast.success("削除しました");
    } catch (e) {
      console.error(e);
    }
  };

  const prev = () => {
    router.replace(`/courses/${courseId}/lessons/${lessonId}`);
  };

  //合格済OR未提出の場合はやり直すボタン出さない
  const startOverButton = status !== "DRAFT" && status !== undefined;

  //提出済みの場合のみレビューを見るボタン表示
  const reviewModalOpen = status === "PASSED" || status === "REVISION_REQUIRED";
  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white px-6 flex gap-7 fixed bottom-0 h-[91px] justify-between items-center w-full">
        <button type="button" onClick={prev}>{`< 問題一覧に戻る`}</button>
        <div className="flex gap-7">
          {startOverButton && (
            <button
              type="button"
              className=" text-red-500 w-[162px] h-[46px]"
              onClick={startOver}
              disabled={isSubmitting}
            >
              やり直す
            </button>
          )}
          {reviewModalOpen && (
            <button
              type="button"
              className=" text-blue-500 w-[162px] h-[46px]"
              onClick={() => setIsOpen(true)}
              disabled={isSubmitting}
            >
              レビューを見る
            </button>
          )}
          <button
            type="button"
            className="bg-[#777777] w-[162px] h-[46px] rounded-md text-white"
            disabled={isSubmitting}
            onClick={saveDraft}
          >
            下書き保存
          </button>
          <button
            type="button"
            className="bg-[#4E89FF] w-[162px] h-[46px] rounded-md text-white"
            disabled={isSubmitting}
            onClick={review}
          >
            この内容で提出
          </button>
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
