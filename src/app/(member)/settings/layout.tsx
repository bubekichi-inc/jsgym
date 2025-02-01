"use client";
import { ReactNode } from "react";
import { Header } from "@/app/_components/Header";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="pt-[72px]">{children}</div>
    </>
  );
  // return <div className="mx-auto mt-10 w-full max-w-2xl">{children}</div>;
};

export default Layout;
