import { useState, useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType } from "../_types/ChatMessage";
import { ChatMessage } from "./ChatMessage";
import { useApi } from "@/app/_hooks/useApi";
import { useFetch } from "@/app/_hooks/useFetch";
import { status } from "@/app/_utils/status";
import {
  MessageRequest,
  MessagesReasponse,
} from "@/app/api/messages/_types/Messages";
interface Props {
  chatMessages: ChatMessageType[];
  setChatMessages: (chatMessages: ChatMessageType[]) => void;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // chatMessagesが更新されるたびにスクロール
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (isLoading) return;
    if (!data) return;
    setChatMessages(data.messages);
  }, [data, setChatMessages, isLoading]);

  const [message, setMessage] = useState("");
  const { post } = useApi();

  if (isLoading)
    return <div className="text-center text-white text-4xl">読込み中... </div>;
  if (error)
    return (
      <div className="text-center text-white text-8xl">
        チャットデータの読み込みに失敗しました
      </div>
    );
  if (!data)
    return (
      <div className="text-center text-white text-8xl">データがありません</div>
    );

  const isCorrect = status(data.status);
  const sendMessage = async () => {
    setMessage("");
    const newMessage: ChatMessageType = {
      answerId,
      message,
      sender: "USER",
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    const { systemMessage } = await post<
      MessageRequest,
      { systemMessage: ChatMessageType }
    >(`/api/messages/${answerId}`, { message });
    setChatMessages([...updatedMessages, systemMessage]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Enterキーのみで送信
      event.preventDefault();
      sendMessage();
    }
  };
  const result = isCorrect === "合格済み" ? "合格です！！" : "不合格です！";
  return (
    <div
      className="bg-white w-4/5 h-5/6 p-10 relative"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-4xl font-bold pb-11 text-center">{result}</h2>
      <h3 className="pb-9 font-bold">コードレビュー</h3>
      <div className="h-[70%]">
        <div className="h-full overflow-y-scroll">
          {chatMessages.map((message, index) => (
            <ChatMessage
              message={message.message}
              sender={message.sender}
              key={index}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onClick={e => e.stopPropagation()}
            className="absolute bottom-6 border pt-2 pl-6 w-[90%] rounded-md h-auto"
            placeholder="メッセージを送る"
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  );
};
