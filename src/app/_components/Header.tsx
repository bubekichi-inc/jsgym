"use client";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "../(lp)/_components/logo";
import { useMe } from "../(member)/_hooks/useMe";
import { useQuestionDetailRedirect } from "../_hooks/useQuestionDetailRedirect";
import { SinginModal } from "./SinginModal";
import { UserDropdownMenu } from "./UserDropdownMenu";

export const Header: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId;
  const { data, isLoading } = useMe();
  const [open, setOpen] = useState(false);
  const { setRedirectQid } = useQuestionDetailRedirect();

  const rightContent = () => {
    if (isLoading) return <div className=""></div>;
    if (data)
      return (
        <div className="flex items-center gap-4">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeLy-YzsFnzUVdX-g5U3v4dLtN2QilTAZlvWjjzxW5rsYf_hg/viewform?usp=header"
            target="_blank"
            className="items-center text-xs font-bold text-blue-500"
          >
            フィードバック
            <FontAwesomeIcon icon={faExternalLink} className="ml-1 size-3" />
          </a>
          <UserDropdownMenu />
        </div>
      );
    return (
      <button
        onClick={() => {
          if (questionId) setRedirectQid(questionId as string);
          setOpen(true);
        }}
        className="inline-flex h-8 items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        ログイン
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-[48px] w-full items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-4">
            <Link className="font-bold" href={data ? "/q" : "/"}>
              <Logo width={80} />
            </Link>
            <span className="pt-1 text-xs font-black text-green-600 md:text-sm">
              β版
            </span>
          </div>

          {rightContent()}
        </div>
      </header>

      <SinginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
