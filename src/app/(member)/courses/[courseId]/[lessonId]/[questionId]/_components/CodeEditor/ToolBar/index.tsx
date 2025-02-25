import { faPaperPlane, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useMessages } from "../../../_hooks/useMessages";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { api } from "@/app/_utils/api";
import { CodeReviewRequest } from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";

interface Props {
  answer: string;
  onExecuteCode: () => void;
}

export const ToolBar: React.FC<Props> = ({ answer, onExecuteCode }) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { mutate: mutateMessages } = useMessages({
    questionId,
  });
  const { mutate: mutateQuestion } = useQuestion({
    questionId,
  });

  const saveDraft = async () => {
    try {
      await api.post<Draft, { message: string }>(
        `/api/questions/${questionId}/draft`,
        {
          answer,
        }
      );
      mutateQuestion();
      toast.success("下書き保存しました");
    } catch (e) {
      console.error(e);
      toast.error("下書き保存に失敗しました");
    }
  };

  const review = async () => {
    try {
      // setIsSubmitting(true);
      await api.post<CodeReviewRequest>(
        `/api/questions/${questionId}/code_review`,
        {
          answer,
        }
      );
      // setIsSubmitting(false);
      mutateMessages();
      mutateQuestion();
    } catch (e) {
      console.error(e);
      toast.error("提出に失敗しました");
    }
  };

  return (
    <div className="absolute bottom-4 right-4 flex gap-4 rounded-full border border-gray-700 bg-black px-6 py-4 text-white">
      <button
        type="button"
        onClick={onExecuteCode}
        className="flex items-center gap-2 rounded-full bg-gray-400 px-4 py-[10px] text-sm font-bold text-textMain"
      >
        <span>コードを実行</span>
        <FontAwesomeIcon icon={faPlay} className="size-3" />
      </button>
      <button
        type="button"
        onClick={review}
        className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-[10px] text-sm font-bold"
      >
        <span>提出してレビューを受ける</span>
        <FontAwesomeIcon icon={faPaperPlane} className="size-3" />
      </button>
      <button type="button" onClick={saveDraft} className="text-sm">
        下書き保存
      </button>
      {/* <EllipsisButton /> */}
    </div>
  );
};
