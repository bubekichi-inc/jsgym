"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
type Tab = {
  label: string;
  href: string;
};

const Layout: React.FC<Props> = ({ children }) => {
  const settingsPageTabs: Tab[] = [
    { label: "プロフィール", href: "/settings/profile" },
    // { label: "ポイント購入", href: "/settings/points" },
    // { label: "通知設定", href: "/settings/notifications" },
  ];

  const pathname = usePathname();
  const selectedTabStyle = "border-b-2 border-black pb-1 text-black";

  return (
    <>
      <div className="mx-auto my-10 w-full max-w-2xl px-4 md:mt-[110px]">
        <div className="flex flex-col">
          <h2 className="mb-6 text-base font-bold md:text-2xl">各種設定</h2>
          <div className="mb-10 flex gap-x-12 text-xl font-bold text-gray-500">
            {settingsPageTabs.map((link) => (
              <div
                key={link.href}
                className={pathname === link.href ? selectedTabStyle : ""}
              >
                <NextLink
                  href={link.href}
                  className="px-6 text-sm md:text-base"
                >
                  {link.label}
                </NextLink>
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
