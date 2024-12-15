import { useState, useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType } from "../_types/ChatMessage";
import { useApi } from "@/app/_hooks/useApi";
import { useFetch } from "@/app/_hooks/useFetch";
import {
  MessageRequest,
  MessagesReasponse,
} from "@/app/api/messages/_types/Messages";

export const useModalContents = (
  chatMessages: ChatMessageType[],
  setChatMessages: (chatMessages: ChatMessageType[]) => void,
  answerId: string
) => {
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

  return {
    handleKeyDown,
    messagesEndRef,
    sendMessage,
    message,
    setMessage,
    isLoading,
    error,
    data,
  };
};
