"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabaseSession } from "./useSupabaseSessoin";

export const useRouteGuard = () => {
  const { session, isLoading } = useSupabaseSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (pathname.startsWith("/q")) return;
    if (session) return;
    router.replace("/");
  }, [isLoading, pathname, router, session]);
};
