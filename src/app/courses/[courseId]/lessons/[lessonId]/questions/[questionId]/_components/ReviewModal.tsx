import { Message } from "@prisma/client";
import { useEffect } from "react";
import { ChatArea } from "./ChatArea";
import { Modal } from "@/app/_components/Model";
import { useFetch } from "@/app/_hooks/useFetch";
import { status } from "@/app/_utils/status";
import { MessagesReasponse } from "@/app/api/messages/_types/Messages";

interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  isCorrect: boolean;
  isSubmitting: boolean;
  answerId: string;
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
  const { data, error, mutate, isLoading } = useFetch<MessagesReasponse>(
    `/api/messages/${answerId}`
  );

  useEffect(() => {
    if (!data) return;
    setChatMessages(data.messages);
  }, [data, setChatMessages, isSubmitting]);

  if (error) return <div>チャットデータの読み込みに失敗しました</div>;
  if (!data) return <div>データがありません</div>;

  const isCorrect = status(data.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoading && isSubmitting ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-white font-bold text-4xl">レビュー中・・・</p>
        </div>
      ) : (
        <div className="bg-white w-4/5 h-5/6 p-10 relative">
          <h2 className="text-4xl font-bold pb-11 text-center">{`${isCorrect}です！！`}</h2>
          <h3 className="pb-9 font-bold">コードレビュー</h3>
          <ChatArea
            messages={chatMessages}
            answerId={answerId}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            mutate={mutate}
          />
        </div>
      )}
    </Modal>
  );
};
