"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export const SidePanel: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  width = "500px",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[${width}] transform bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute right-2 top-2 p-3"
          onClick={onClose}
        >
          <FontAwesomeIcon
            className="text-[34px] text-[#ACAAA9]"
            icon={faXmark}
          />
        </button>
        <div className="h-full overflow-auto pt-6">{children}</div>
      </div>
    </>
  );
};
