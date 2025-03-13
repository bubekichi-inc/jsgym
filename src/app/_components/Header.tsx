"use client";
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
    if (data) return <UserDropdownMenu />;
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
              <Logo />
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
