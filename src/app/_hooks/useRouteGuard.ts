"use client";
import { useEffect } from "react";
import { useSupabaseSession } from "./useSupabaseSessoin";
import { useRouter } from "next/navigation";
export const useRouteGuard = () => {
  const { session, isLoading } = useSupabaseSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (session) return;
    router.replace("/");
  }, [isLoading, router, session]);
};
