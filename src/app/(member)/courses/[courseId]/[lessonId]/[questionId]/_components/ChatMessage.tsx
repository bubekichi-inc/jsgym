import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sender } from "@prisma/client";
import { JSX } from "react";

interface Props {
  chatMessage: {
    sender: Sender;
    message: string;
  };
}

export const ChatMessage: React.FC<Props> = ({ chatMessage }) => {
  const { sender, message } = chatMessage;
  const isSystem = sender === "SYSTEM";
  const circleColor = isSystem ? "bg-[#40B18F]" : "bg-[#B4B4B4]";
  const senderLabel = isSystem ? "レビュワー" : "あなた";

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches = Array.from(message.matchAll(codeBlockRegex));

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("コードがコピーされました！");
    } catch (e) {
      console.error(e);
      alert("コピーに失敗しました。");
    }
  };

  const formattedMessage = formatMessageWithCodeBlocks(
    message,
    matches,
    handleCopy
  );

  return (
    <div className="pb-2 font-bold flex gap-2">
      <div className="">
        <div className={`${circleColor} w-6 h-6 rounded-full`}></div>
      </div>
      <div className="w-full">
        <div>{senderLabel}</div>
        <div className="whitespace-pre-wrap">{formattedMessage}</div>
      </div>
    </div>
  );
};

const formatMessageWithCodeBlocks = (
  message: string,
  matches: RegExpMatchArray[],
  handleCopy: (code: string) => void
) => {
  let lastIndex = 0;
  const formattedMessage: JSX.Element[] = [];

  matches.forEach(match => {
    const matchIndex = match.index ?? 0;

    // 通常のテキスト部分
    if (matchIndex > lastIndex) {
      formattedMessage.push(
        <span key={lastIndex}>{message.slice(lastIndex, matchIndex)}</span>
      );
    }

    // 言語部分とコード部分
    const language = match[1];
    const code = match[2];

    if (language) {
      formattedMessage.push(
        <div
          key={`header-${matchIndex}`}
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
        key={`code-${matchIndex}`}
        className="bg-black text-white p-2 rounded-b-md w-full"
      >
        <code className="block">{code}</code>
      </pre>
    );

    lastIndex = matchIndex + match[0].length;
  });

  // 通常テキスト
  if (lastIndex < message.length) {
    formattedMessage.push(
      <span key={lastIndex}>{message.slice(lastIndex)}</span>
    );
  }

  return formattedMessage;
};
