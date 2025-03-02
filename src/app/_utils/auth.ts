import { supabase } from "./supabase";

interface Props {
  redirectQid?: string;
}

export const signIn = async ({ redirectQid }: Props) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/oauth/callback/google?redirect_qid=${redirectQid}`,
      },
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    alert(`ログインに失敗しました:${e}`);
    console.error(e);
  }
};
