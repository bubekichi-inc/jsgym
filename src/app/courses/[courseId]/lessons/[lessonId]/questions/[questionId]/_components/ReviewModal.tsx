import { Message } from "@prisma/client";
import { ChatArea } from "./ChatArea";
import { Modal } from "@/app/_components/Model";

interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  isCorrect: boolean;
  isSubmitting: boolean;
  answerId: string | null;
  chatMessages: Message[];
  setChatMessages: (chatMessages: Message[]) => void;
}
export const ReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isSubmitting,
  answerId,
  chatMessages,
  setChatMessages,
}) => {
  //コードレビューの場合→!answerId、レビュー開く場合→isSubmitting
  const isLoading = !answerId || isSubmitting;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-white font-bold text-4xl">レビュー中・・・</p>
        </div>
      ) : (
        <ChatArea
          answerId={answerId}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      )}
    </Modal>
  );
};
