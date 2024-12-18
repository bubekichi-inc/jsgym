"use client";
import { supabase } from "./_utils/supabase";
import { Button } from "./_components/Button";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "./_hooks/useSupabaseSessoin";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();
  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.replace("/courses");
    }
  }, [session, isLoading]);

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/courses`,
        },
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      alert(`ログインに失敗しました:${e}`);
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button type="button" onClick={signIn} variant="bg-blue">
        はじめる
      </Button>
    </div>
  );
}
