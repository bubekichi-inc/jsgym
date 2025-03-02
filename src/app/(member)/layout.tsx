"use client";
import "react-toastify/dist/ReactToastify.css";
import { useRouteGuard } from "../_hooks/useRouteGuard";
export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useRouteGuard();
  return (
    <>
      <div className="">{children}</div>
    </>
  );
}
