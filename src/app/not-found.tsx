import Link from "next/link";

export const metadata = {
  title: "notfound - ページが見つかりません｜ShiftB",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bgMain text-center">
      <h1 className="mb-4 text-xl font-bold">404 _ ページが見つかりません🙇</h1>
      <Link href="/" color="primary" className="px-4">
        ホームに戻る
      </Link>
    </div>
  );
}
