import { Message, Sender } from "@prisma/client";
import { useState, useEffect } from "react";
import { KeyedMutator } from "swr";
import { ChatMessage } from "./ChatMessage";
import { useApi } from "@/app/_hooks/useApi";
import {
  MessageRequest,
  MessagesReasponse,
} from "@/app/api/messages/_types/Messages";
import { useFetch } from "@/app/_hooks/useFetch";
import { status } from "@/app/_utils/status";
interface Props {
  chatMessages: Message[];
  setChatMessages: (chatMessages: Message[]) => void;
  answerId: string;
}
export const ChatArea: React.FC<Props> = ({
  chatMessages,
  setChatMessages,
  answerId,
}) => {
  const { data, error, isLoading } = useFetch<MessagesReasponse>(
    `/api/messages/${answerId}`
  );

  useEffect(() => {
    if (!data) return;
    console.log(data, data.messages);
    setChatMessages(data.messages);
  }, [data, setChatMessages]);

  const [message, setMessage] = useState("");
  const { post } = useApi();

  if (isLoading) return <div>読込み中... </div>;
  if (error) return <div>チャットデータの読み込みに失敗しました</div>;
  if (!data) return <div>データがありません</div>;

  const isCorrect = status(data.status);
  const sendMessage = async () => {
    setMessage("");
    const newMessage: Message = {
      answerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: "",
      message,
      sender: "USER",
    };

    setChatMessages([...chatMessages, newMessage]);
    const { systemMessage } = await post<
      MessageRequest,
      { systemMessage: Message }
    >(`/api/messages/${answerId}`, { message });
    setChatMessages([...chatMessages, newMessage, systemMessage]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Enterキーのみで送信
      event.preventDefault();
      sendMessage();
    }
  };
  console.log(chatMessages, answerId);
  return (
    <div className="bg-white w-4/5 h-5/6 p-10 relative">
      <h2 className="text-4xl font-bold pb-11 text-center">{`${isCorrect}です！！`}</h2>
      <h3 className="pb-9 font-bold">コードレビュー</h3>
      <div className="h-[70%]">
        <div className="h-full">
          <div className="h-full overflow-y-scroll">
            {chatMessages.map((message, index) => (
              <ChatMessage
                message={message.message}
                sender={message.sender}
                key={index}
              />
            ))}
          </div>
        </div>

        <form onSubmit={sendMessage}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onClick={e => e.stopPropagation()}
            className="absolute bottom-6 border pt-2 pl-6 w-4/5 rounded-md min-h-10"
            placeholder="メッセージを送る"
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  );
};
