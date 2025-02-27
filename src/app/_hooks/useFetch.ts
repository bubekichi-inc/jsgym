"use client";
import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { supabase } from "../_utils/supabase";

export const useFetch = <T>(path: string, configuration?: SWRConfiguration) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const fetcher = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const prams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.access_token || "",
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
  const results = useSWR(`${baseUrl}${path}`, fetcher, configuration);
  return results;
};
