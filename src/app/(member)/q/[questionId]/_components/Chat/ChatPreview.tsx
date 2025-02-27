import React from "react";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";

interface Props {
  message: string;
}

export const ChatPreview: React.FC<Props> = ({ message }) => {
  return (
    <div className="whitespace-pre-wrap break-words rounded bg-white p-4">
      <MarkdownWrapper>{message}</MarkdownWrapper>
    </div>
  );
};
