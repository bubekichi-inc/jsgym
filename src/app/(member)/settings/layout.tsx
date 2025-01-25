"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <div className="mx-auto mt-10 w-full max-w-2xl">{children}</div>;
};

export default Layout;
