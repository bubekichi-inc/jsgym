"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Logo } from "../(lp)/_components/logo";
import { useMe } from "../(member)/_hooks/useMe";
import { useQuestionDetailRedirect } from "../_hooks/useQuestionDetailRedirect";
import { signIn } from "../_utils/auth";
import { UserDropdownMenu } from "./UserDropdownMenu";

export const Header: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId;
  const { data, isLoading } = useMe();
  const { setRedirectQid } = useQuestionDetailRedirect();

  const rightContent = () => {
    if (isLoading) return <div className=""></div>;
    if (data) return <UserDropdownMenu />;
    return (
      <button
        onClick={() => {
          if (questionId) setRedirectQid(questionId as string);
          signIn();
        }}
        className="inline-flex h-8 items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        ログイン
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 z-10 flex h-[48px] w-full items-center justify-between bg-white/50 p-4 shadow-sm backdrop-blur-sm md:p-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link className="font-bold" href={data ? "/q" : "/"}>
            <Logo />
          </Link>
          <span className="rounded-full bg-green-600 px-3 pb-[5px] pt-1 text-xs font-bold text-white md:text-sm">
            β版
          </span>
        </div>

        {rightContent()}
      </header>
    </>
  );
};
