"use client";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../_utils/supabase";
import { Button } from "./Button";

export const Header: React.FC = () => {
  const { replace } = useRouter();
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      replace("/");
    } catch (e) {
      alert(`ログアウトに失敗しました:${e}`);
      console.error(e);
    }
  };
  return (
    <header className="fixed top-0 z-10 flex h-[48px] w-full items-center justify-between bg-white/50 p-6 shadow-sm">
      <Link className="font-bold" href={"/courses/1/1"}>
        JS Gym
      </Link>
      <a
        href="https://docs.google.com/spreadsheets/d/1tNUMeAZxxfQEe4PFOD8v-jlzeWHNCOke_-jM2GnLEPI/edit?usp=sharing"
        target="_blank"
        className="flex items-center rounded-lg bg-blue-500 px-4 py-1 text-sm font-bold text-white"
      >
        フィードバックはこちら
        <FontAwesomeIcon icon={faExternalLink} className="ml-2 size-4" />
      </a>
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
    </header>
  );
};
