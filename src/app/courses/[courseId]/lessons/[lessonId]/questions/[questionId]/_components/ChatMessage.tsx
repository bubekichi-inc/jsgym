import { Sender } from "@prisma/client";
interface Props {
  sender?: Sender;
  message: string;
}
export const ChatMessage: React.FC<Props> = ({
  sender = "SYSTEM",
  message,
}) => {
  const isSystem = sender === "SYSTEM";
  const circleColor = isSystem ? "bg-[#40B18F]" : "bg-[#B4B4B4]";
  const senderLabel = isSystem ? "レビュワー" : "あなた";
  return (
    <>
      <div className="pb-2 font-bold flex gap-2">
        <div className="">
          <div className={`${circleColor} w-6 h-6 rounded-full`}></div>
        </div>
        <div>
          <div>{senderLabel}</div>

          <div>{message}</div>
        </div>
      </div>
    </>
  );
};
