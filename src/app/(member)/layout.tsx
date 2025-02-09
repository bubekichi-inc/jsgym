"use client";
import { Header } from "../_components/Header";
import { useRouteGuard } from "../_hooks/useRouteGuard";
export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useRouteGuard();
  return (
    <>
      <Header />
      <div className="">{children}</div>
    </>
  );
}
