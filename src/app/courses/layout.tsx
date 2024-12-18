"use client";
import { Header } from "../_components/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSessoin";
export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();
  useEffect(() => {
    console.log(isLoading, session);
    if (isLoading) return;
    if (session) return;
    router.replace("/");
  }, [isLoading, router, session]);
  return (
    <>
      <Header />
      <div className="pt-[72px]">{children}</div>
    </>
  );
}
