import { supabase } from "./supabase";

export const signIn = async () => {
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
