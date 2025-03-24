import axios from "axios";
import { supabase } from "./supabase";
const baseURL = process.env.NEXT_PUBLIC_APP_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
  },
});

// tokenが取得できる状態の場合はAuthrizationに追加
supabase.auth.onAuthStateChange((_event, session) => {
  const token = session?.access_token;
  if (token) {
    api.defaults.headers.common["Authorization"] = token;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
});
