import { Sender } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { ReviewerModal } from "../ReviewerModal";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { Message } from "@/app/api/questions/[questionId]/messages/route";

interface Props {
  sender: Sender;
  reviewer: Message["reviewer"];
}

export const SenderIcon: React.FC<Props> = ({ sender, reviewer }) => {
  const { data } = useMe();
  const [isOpen, setIsOpen] = useState(false);

  const classNames = "rounded-full min-w-6 max-w-6 h-6";

  if (sender === Sender.SYSTEM) {
    return (
      <>
        <button
          className={`${classNames} overflow-hidden bg-blue-500`}
          onClick={() => setIsOpen(true)}
        >
          {reviewer && (
            <Image
              src={reviewer.profileImageUrl}
              height={80}
              width={80}
              className="size-full object-cover"
              alt="review"
            />
          )}
        </button>

        <ReviewerModal
          reviewer={reviewer}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  }

  if (!data?.iconUrl)
    return (
      <div
        className={`${classNames} flex items-center justify-center bg-gray-300 pb-1 text-sm`}
      >
        {data?.name?.slice(0, 1)}
      </div>
    );

  if (!data.iconUrl) return <div className={`${classNames} bg-gray-400`} />;

  return (
    <Image
      src={data.iconUrl}
      height={80}
      width={80}
      alt="user"
      className={`${classNames} object-cover`}
    />
  );
};
