"use client";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../(lp)/_components/logo";
import { useMe } from "../(member)/_hooks/useMe";
import { signIn } from "../_utils/autu";
import { supabase } from "../_utils/supabase";
import { Button } from "./Button";

export const Header: React.FC = () => {
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
        onClick={signIn}
        className="inline-flex h-8 items-center justify-center rounded-md bg-yellow-300 px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        ログイン
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 z-10 flex h-[48px] w-full items-center justify-between bg-white/50 p-6 shadow-sm">
        <Link className="font-bold" href={"/q"}>
          <Logo />
        </Link>
        <a
          href="https://docs.google.com/spreadsheets/d/1tNUMeAZxxfQEe4PFOD8v-jlzeWHNCOke_-jM2GnLEPI/edit?usp=sharing"
          target="_blank"
          className="flex items-center rounded-lg bg-blue-500 px-4 py-1 text-sm font-bold text-white"
        >
          フィードバックはこちら
          <FontAwesomeIcon icon={faExternalLink} className="ml-2 size-4" />
        </a>
        {rightContent()}
      </header>
    </>
  );
};
