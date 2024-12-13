import { Sender } from "@prisma/client";
import { faC, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Props {
  sender: Sender;
  message: string;
}
export const ChatMessage: React.FC<Props> = ({
  sender = "SYSTEM",
  message,
}) => {
  const isSystem = sender === "SYSTEM";
  const circleColor = isSystem ? "bg-[#40B18F]" : "bg-[#B4B4B4]";
  const senderLabel = isSystem ? "レビュワー" : "あなた";

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  const matches = Array.from(message.matchAll(codeBlockRegex));
  const formattedMessage = [];
  let lastIndex = 0;
  const handleCopy = async (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      alert("コードがコピーされました！");
    } catch (e) {
      alert("コピーに失敗しました。");
    }
  };

  matches.forEach(match => {
    // 通常のテキスト
    if (match.index > lastIndex) {
      formattedMessage.push(
        <span key={lastIndex}>{message.slice(lastIndex, match.index)}</span>
      );
    }

    // 言語部分とコード部分
    const language = match[1];
    const code = match[2];

    if (language) {
      formattedMessage.push(
        <div
          key={match.index}
          className="bg-gray-300 p-1 rounded-t-md flex justify-between items-center"
        >
          <div className="text-sm pl-2">{language}</div>
          <button
            type="button"
            onClick={() => handleCopy(code)}
            className="text-sm px-2 py-1 rounded font-light"
          >
            <FontAwesomeIcon className="text-sm pr-1" icon={faCopy} />
            Code copy
          </button>
        </div>
      );
    }

    formattedMessage.push(
      <pre
        key={match.index + 1}
        className="bg-black text-white p-2 rounded-b-md"
      >
        <code>{code}</code>
      </pre>
    );

    lastIndex = match.index + match[0].length;
  });

  // 通常テキスト
  if (lastIndex < message.length) {
    formattedMessage.push(
      <span key={lastIndex}>{message.slice(lastIndex)}</span>
    );
  }

  return (
    <>
      <div className="pb-2 font-bold flex gap-2">
        <div className="">
          <div className={`${circleColor} w-6 h-6 rounded-full`}></div>
        </div>
        <div>
          <div>{senderLabel}</div>

          <div>{formattedMessage}</div>
        </div>
      </div>
    </>
  );
};
