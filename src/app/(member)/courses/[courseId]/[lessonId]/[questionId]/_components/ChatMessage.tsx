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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 font-bold">
        <div className={`${circleColor} size-6 rounded-full`}></div>
        <div>{senderLabel}</div>
      </div>
      <div className="whitespace-pre-wrap pl-8">{formattedMessage}</div>
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

  matches.forEach((match) => {
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
          className="flex items-center justify-between rounded-t-md bg-gray-300 p-1"
        >
          <div className="pl-2 text-sm">{language}</div>
          <button
            type="button"
            onClick={() => handleCopy(code)}
            className="rounded px-2 py-1 text-sm font-light"
          >
            <FontAwesomeIcon className="pr-1 text-sm" icon={faCopy} />
            Code copy
          </button>
        </div>
      );
    }

    formattedMessage.push(
      <pre
        key={`code-${matchIndex}`}
        className="w-full rounded-b-md bg-black p-2 text-white"
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
