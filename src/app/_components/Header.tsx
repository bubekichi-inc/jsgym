"use client";
import { supabase } from "../_utils/supabase";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
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
    <header className="w-full flex justify-between items-center h-[72px] p-6 shadow-sm fixed top-0 bg-white bg-opacity-50 z-10">
      <Link className="font-bold" href={"/"}>
        ShiftB code
      </Link>
      <a
        href="https://docs.google.com/spreadsheets/d/1tNUMeAZxxfQEe4PFOD8v-jlzeWHNCOke_-jM2GnLEPI/edit?usp=sharing"
        target="_blank"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold text-lg"
      >
        フィードバックはこちら
        <FontAwesomeIcon icon={faExternalLink} className="ml-2" />
      </a>
      <Button type="button" onClick={logout} variant="bg-blue">
        ログアウト
      </Button>
    </header>
  );
};
