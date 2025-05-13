"use client";

import Image from "next/image";
import { useState } from "react";
import { SinginModal } from "./SinginModal";

export const CTAButton: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  return (
    <>
      <button
        className="inline-flex h-[68px] w-full items-center justify-center gap-1.5 rounded-lg bg-yellow-400 px-4 text-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 md:gap-3 md:rounded-xl md:px-5 md:text-[1.625rem]"
        onClick={() => setShowLoginDialog(true)}
      >
        無料ではじめる
        <Image
          src="/images/icon_black.svg"
          alt="logo"
          width={28}
          height={32}
          className="h-auto w-6 md:w-7"
        />
      </button>

      <SinginModal
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
};
