"use client";
import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSessoin";

export const useFetch = <T>(path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const { token } = useSupabaseSession();
  const fetcher = async () => {
    if (!token) return;
    const prams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };
    const resp = await fetch(`${baseUrl}${path}`, prams);
    if (resp.status !== 200) {
      const errorData = await resp.json();
      throw new Error(
        errorData.message || "An error occurred while fetching the data."
      );
    }
    const data: T = await resp.json();
    return data;
  };
  const results = useSWR(token ? `${baseUrl}${path}` : null, fetcher);
  return results;
};
