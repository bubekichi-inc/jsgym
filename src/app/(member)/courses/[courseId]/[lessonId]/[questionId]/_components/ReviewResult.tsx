import { useChat } from "../_hooks/useChat";
import { ChatMessage as ChatMessageType } from "../_types/ChatMessage";
import { ChatMessage } from "./ChatMessage";
import { answerStatus } from "@/app/_utils/answerStatus";
interface Props {
  chatMessages: ChatMessageType[];
  setChatMessages: (chatMessages: ChatMessageType[]) => void;
  answerId: string;
}
export const ReviewResult: React.FC<Props> = ({
  chatMessages,
  setChatMessages,
  answerId,
}) => {
  const {
    handleKeyDown,
    messagesEndRef,
    sendMessage,
    message,
    setMessage,
    isLoading,
    error,
    data,
    isSubmitting,
  } = useChat(chatMessages, setChatMessages, answerId);

  if (isLoading)
    return <div className="text-center text-4xl text-white">読込み中... </div>;
  if (error)
    return (
      <div className="text-center text-8xl text-white">
        チャットデータの読み込みに失敗しました
      </div>
    );
  if (!data)
    return (
      <div className="text-center text-8xl text-white">データがありません</div>
    );

  const isCorrect = answerStatus(data.status);
  const result = isCorrect === "合格済み" ? "合格です！！" : "不合格です！";
  return (
    <div
      className="relative h-[90%] max-w-[800px] bg-white p-10 text-black"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="pb-5 text-center text-4xl font-bold">{result}</h2>
      <h3 className="pb-5 font-bold">コードレビュー</h3>
      <div className="h-[70%]">
        <div className="h-full overflow-y-scroll">
          {chatMessages.map((message, index) => (
            <ChatMessage chatMessage={message} key={index} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-6 h-auto w-[90%] rounded-md border p-4"
            placeholder="メッセージを送る"
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};
