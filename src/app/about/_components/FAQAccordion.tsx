"use client";

import Image from "next/image";
import { useState } from "react";

export interface Question {
  question: string;
  answer: string;
}

export const FAQAccordion = ({ question, answer }: Question) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <li className="rounded-lg bg-white shadow-blue md:rounded-xl">
      <div onClick={() => setIsOpen(!isOpen)}>
        <p className="relative flex gap-1.5 py-3 pl-6 pr-14 md:gap-2 md:py-4 md:pr-[61px]">
          <span className="text-xl/[1] font-medium md:text-2xl">Q.</span>
          <span className="text-lg/[1.5] font-bold md:pt-0.5 md:text-xl/[1.5]">
            {question}
          </span>
          <Image
            src="/images/icon_arrow.svg"
            alt="arrow"
            width={24}
            height={24}
            className={`absolute right-6 top-1/2 size-6 -translate-y-1/2 transition-transform duration-300 md:size-8 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </p>
      </div>

      <div
        className={`grid duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="flex gap-1.5 pb-3 pl-6 pr-14 pt-1 text-gray-500 md:gap-2 md:pb-4 md:pr-[61px] md:pt-0">
            <span className="text-xl/[1] md:text-2xl/[1]">A.</span>
            <span className="text-sm/[1.5] md:text-base">{answer}</span>
          </p>
        </div>
      </div>
    </li>
  );
};
