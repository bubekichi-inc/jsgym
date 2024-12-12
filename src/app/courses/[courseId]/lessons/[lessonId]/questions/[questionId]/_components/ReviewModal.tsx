import { ChatMessage } from "./ChatMessage";
import { Modal } from "@/app/_components/Model";

interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  isCorrect: boolean;
  reviewComment: string;
  isSubmitting: boolean;
}
export const ReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reviewComment,
  isCorrect,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isSubmitting ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-white font-bold text-4xl">レビュー中・・・</p>
        </div>
      ) : (
        <div className="bg-white max-w-[714px] h-4/5 p-10 relative">
          <h2 className="text-4xl font-bold pb-11 text-center">{`${
            isCorrect ? "合格" : "不合格"
          }です！！`}</h2>
          <div className="pb-9 font-bold">コードレビュー</div>
          <ChatMessage message={reviewComment} />
          <input
            type="text"
            className="absolute bottom-6 border py-4 pl-6 w-4/5 rounded-md"
            placeholder="メッセージを送る"
          />
        </div>
      )}
    </Modal>
  );
};
