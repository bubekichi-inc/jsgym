// "use client";
// import { useRouteGuard } from "../_hooks/useRouteGuard";
// export default function MemberLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   useRouteGuard();
//   return <div className="">{children}</div>;
// }
"use client";
import { Header } from "@/app/_components/Header";
export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-[72px]">{children}</div>
    </>
  );
}
