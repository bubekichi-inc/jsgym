import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  message: string;
}

export const ChatPreview: React.FC<Props> = ({ message }) => {
  return (
    <div className="rounded bg-white p-4 whitespace-pre-wrap break-words">
      <MarkdownWrapper>{message}</MarkdownWrapper>
    </div>
  );
};
