import React, { useState, useRef, useEffect } from "react";

export const ChatInput: React.FC = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="pl-9 sticky bottom-0">
      <textarea
        ref={textareaRef}
        className="w-full text-sm py-2 px-3 rounded-lg outline-none border border-gray-200 shadow-lg"
        value={text}
        onChange={handleChange}
        style={{ overflow: "hidden" }}
        rows={2}
        placeholder="追加の質問"
      />
    </div>
  );
};
