"use client";
import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { api } from "../_utils/api";

export const useFetch = <T>(path: string, configuration?: SWRConfiguration) => {
  const baseUrl = process.env.APP_BASE_URL;
  const fetcher = async () => await api.get<T>(path);
  const results = useSWR(`${baseUrl}${path}`, fetcher, configuration);
  return results;
};
