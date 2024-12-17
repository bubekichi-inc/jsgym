import { useState, useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType } from "../_types/ChatMessage";
import { api } from "@/app/_utils/api";
import { useFetch } from "@/app/_hooks/useFetch";
import {
  MessageRequest,
  MessagesReasponse,
} from "@/app/api/answers/_types/Messages";

export const useChat = (
  chatMessages: ChatMessageType[],
  setChatMessages: (chatMessages: ChatMessageType[]) => void,
  answerId: string
) => {
  const { data, error, isLoading } = useFetch<MessagesReasponse>(
    `/api/answers/${answerId}/messages`
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMessage = async () => {
    if (!message) return;
    setIsSubmitting(true);
    setMessage("送信中...");
    const newMessage: ChatMessageType = {
      answerId,
      message,
      sender: "USER",
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    const { systemMessage } = await api.post<
      MessageRequest,
      { systemMessage: ChatMessageType }
    >(`/api/answers/${answerId}`, { message });
    setChatMessages([...updatedMessages, systemMessage]);
    setMessage("");
    setIsSubmitting(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
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
    isSubmitting,
  };
};
