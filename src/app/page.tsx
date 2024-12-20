"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./_components/Button";
import { useSupabaseSession } from "./_hooks/useSupabaseSessoin";
import { supabase } from "./_utils/supabase";

export default function Home() {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();
  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.replace("/courses/6/2");
    }
  }, [session, isLoading, router]);

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/oauth/callback/google`,
        },
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      alert(`ログインに失敗しました:${e}`);
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Button type="button" onClick={signIn} variant="bg-blue">
        はじめる
      </Button>
    </div>
  );
}
