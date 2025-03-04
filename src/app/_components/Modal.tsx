"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, ReactNode } from "react";
import ReactModal from "react-modal";
interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  onRequestClose?: () => void;
}

export const Modal: FC<Props> = ({
  isOpen,
  onClose,
  children,
  onRequestClose = onClose,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal"
      closeTimeoutMS={300}
      ariaHideApp={false}
      className={`relative z-[99] w-full max-w-[800px] rounded-2xl bg-white p-4 md:p-8`}
      overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-[99] duration-300 px-2 md:px-4"
    >
      <div className="overflow-auto">
        <button
          type="button"
          className={`absolute right-2 top-2 z-[999] p-3`}
          onClick={onClose}
        >
          <FontAwesomeIcon
            className="text-[34px] text-[#ACAAA9]"
            icon={faXmark}
          />
        </button>
        <div className="pt-6">{children}</div>
      </div>
    </ReactModal>
  );
};
