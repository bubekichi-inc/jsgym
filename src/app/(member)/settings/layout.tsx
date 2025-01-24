"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  return <div className="mx-auto mt-10 w-full max-w-2xl">{props.children}</div>;
};

export default Layout;
