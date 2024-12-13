import { Message, StatusType } from "@prisma/client";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { KeyedMutator } from "swr";
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
  answerId: string | null;
  mutate: KeyedMutator<QuestionResponse>;
  setValue: (value: string) => void;
  status: StatusType | undefined;
}
export const ButtonArea: React.FC<Props> = ({
  question,
  answer,
  answerId,
  mutate,
  setValue,
  status,
}) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post, del } = useApi();
  const { questionId } = useParams();
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
      toast.success("削除しました");
    } catch (e) {
      console.error(e);
    }
  };

  //合格済OR未提出の場合はやり直すボタン出さない
  const startOverButton = status !== "DRAFT" && status !== undefined;

  //提出済みの場合のみレビューを見るボタン表示
  const reviewModalOpen = status === "PASSED" || status === "REVISION_REQUIRED";
  return (
    <>
      <div className="pl-20 flex gap-7">
        <Toaster position="top-right" />
        {startOverButton && (
          <button type="button" className=" text-red-500" onClick={startOver}>
            やり直す
          </button>
        )}
        {reviewModalOpen && (
          <button
            type="button"
            className=" text-blue-500"
            onClick={() => setIsOpen(true)}
          >
            レビューを見る
          </button>
        )}
        <button
          type="button"
          className="bg-[#777777] w-[162px] h-[46px] rounded-md text-white"
          onClick={saveDraft}
        >
          下書き保存
        </button>
        <button
          type="button"
          className="bg-[#4E89FF] w-[162px] h-[46px] rounded-md text-white"
          onClick={review}
        >
          この内容で提出
        </button>
      </div>
      {answerId && (
        <ReviewModal
          isCorrect={isCorrect}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
          answerId={answerId}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      )}
    </>
  );
};
