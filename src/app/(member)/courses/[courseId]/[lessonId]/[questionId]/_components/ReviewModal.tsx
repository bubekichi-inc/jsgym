import { ChatMessage } from "../_types/ChatMessage";
import { ReviewResult } from "./ReviewResult";
import { Modal } from "@/app/_components/Modal";

interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  isCorrect: boolean;
  isSubmitting: boolean;
  answerId: string | null;
  chatMessages: ChatMessage[];
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}
export const ReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isSubmitting,
  answerId,
  chatMessages,
  setChatMessages,
}) => {
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    if (isSubmitting) return;
    onClose(event);
  };
  //コードレビューの場合→!answerId、レビュー開く場合→isSubmitting
  const isLoading = !answerId || isSubmitting;
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {isLoading ? (
        <div className="flex size-full items-center justify-center">
          <p className="text-4xl font-bold text-white">レビュー中・・・</p>
        </div>
      ) : (
        <ReviewResult
          answerId={answerId}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      )}
    </Modal>
  );
};
