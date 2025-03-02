"use client";

import { useState } from "react";
import { supabase } from "@/app/_utils/supabase";

export function HeroSection() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

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
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="items-center justify-center gap-10 space-y-6 lg:flex">
          <div className="flex flex-col justify-center space-y-4 lg:w-1/2">
            <div className="space-y-2">
              <h1 className="space-y-2 whitespace-nowrap text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl/none">
                <div className="">JavaScript開発の</div>
                <div className="">自走力を鍛える</div>
                <div className="">トレーニングジム</div>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-lg">
                JavaScriptに特化した、プログラミング学習サイトです。
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-300 px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => setShowLoginDialog(true)}
              >
                無料ではじめる
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="overflow-hidden rounded border bg-gray-100 shadow-card">
              <video
                className="size-full object-cover"
                src="/images/demo.mov"
                controls={false}
                autoPlay
                muted
                loop
                playsInline
              >
                お使いのブラウザは動画再生をサポートしていません。
              </video>
            </div>
          </div>
        </div>
      </div>

      {showLoginDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowLoginDialog(false);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-col space-y-1.5 pb-6">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                アカウント
              </h2>
              <p className="text-sm text-gray-500">
                Googleアカウントでログインして、JS
                Gymのすべての機能を利用しましょう。
              </p>
            </div>
            <div className="flex justify-center py-4">
              <button
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={signIn}
              >
                <svg
                  className="mr-2 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Googleでログイン
              </button>
            </div>
            <button
              onClick={() => setShowLoginDialog(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
