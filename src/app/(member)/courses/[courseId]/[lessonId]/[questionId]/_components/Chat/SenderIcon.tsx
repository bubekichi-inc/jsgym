import { Sender } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { useMe } from "@/app/(member)/_hooks/useMe";

interface Props {
  sender: Sender;
}

export const SenderIcon: React.FC<Props> = ({ sender }) => {
  const { data } = useMe();

  const classNames = "rounded-full min-w-6 max-w-6 h-6";

  if (sender === Sender.SYSTEM) {
    return <div className={`${classNames} bg-blue-500`} />;
  }

  if (!data) return <div className={`${classNames} bg-gray-200`} />;

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
