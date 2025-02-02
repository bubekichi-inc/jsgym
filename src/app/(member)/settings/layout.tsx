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
};

export default Layout;
