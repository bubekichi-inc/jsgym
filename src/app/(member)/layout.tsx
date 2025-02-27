"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
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
      <div className="pt-[48px]">{children}</div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        theme="colored"
        toastStyle={{ background: "#0E77B8" }}
      />
    </>
  );
}
