"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "../(lp)/_components/logo";
import { useMe } from "../(member)/_hooks/useMe";
import { signIn } from "../_utils/auth";
import { supabase } from "../_utils/supabase";
import { Button } from "./Button";

export const Header: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId;
  const { data, isLoading, mutate } = useMe();
  const { replace } = useRouter();
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      mutate();
      replace("/");
    } catch (e) {
      alert(`ログアウトに失敗しました:${e}`);
      console.error(e);
    }
  };

  const rightContent = () => {
    if (isLoading) return <div className=""></div>;
    if (data)
      return (
        <div className="flex items-center gap-4">
          <Link href="/settings/profile">
            <Button type="button" variant="text-black">
              設定
            </Button>
          </Link>
          <Button type="button" onClick={logout} variant="text-black">
            ログアウト
          </Button>
        </div>
      );
    return (
      <button
        onClick={() => signIn({ redirectQid: questionId as string })}
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
