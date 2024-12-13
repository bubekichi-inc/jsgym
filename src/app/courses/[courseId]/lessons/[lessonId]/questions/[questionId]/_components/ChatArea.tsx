import { Message } from "@prisma/client";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { ChatMessage } from "./ChatMessage";
import { useApi } from "@/app/_hooks/useApi";
import {
  MessageRequest,
  MessagesReasponse,
} from "@/app/api/messages/_types/Messages";
interface Props {
  messages: Message[];
  chatMessages: Message[];
  setChatMessages: (chatMessages: Message[]) => void;
  answerId: string;
  mutate: KeyedMutator<MessagesReasponse>;
}
export const ChatArea: React.FC<Props> = ({
  messages,
  chatMessages,
  setChatMessages,
  answerId,
  mutate,
}) => {
  const [message, setMessage] = useState("");
  const { post } = useApi();

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
    await post<MessageRequest, { messageContent: string }>(
      `/api/messages/${answerId}`,
      { message }
    );
    setChatMessages([]);
    mutate();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Enterキーのみで送信
      event.preventDefault();
      sendMessage();
    }
  };
  return (
    <div className="h-[70%]">
      <div className="h-full">
        <div className="h-full overflow-y-scroll">
          {messages.map((message, index) => (
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
  );
};
