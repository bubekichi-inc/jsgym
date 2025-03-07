import { Sender } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { Message } from "@/app/api/questions/[questionId]/messages/route";

interface Props {
  sender: Sender;
  reviewer?: Message["reviewer"];
}

export const SenderIcon: React.FC<Props> = ({ sender, reviewer }) => {
  const { data } = useMe();

  const classNames = "rounded-full min-w-6 max-w-6 h-6";

  if (sender === Sender.SYSTEM) {
    return (
      <div className={`${classNames} overflow-hidden bg-blue-500`}>
        {reviewer && (
          <Image
            src={reviewer.profileImageUrl}
            height={80}
            width={80}
            className="size-full object-cover"
            alt="review"
          />
        )}
      </div>
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
