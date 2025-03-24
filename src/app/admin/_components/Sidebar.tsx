"use client";

import {
  faChartLine,
  faClipboardList,
  faUsers,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "ダッシュボード",
    href: "/admin/dashboard",
    icon: faChartLine,
  },
  {
    title: "問題一覧",
    href: "/admin/questions",
    icon: faClipboardList,
  },
  {
    title: "ユーザー一覧",
    href: "/admin/users",
    icon: faUsers,
  },
  {
    title: "レビュワー一覧",
    href: "/admin/reviewers",
    icon: faUserGroup,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed min-h-screen w-[200px] border-r border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">管理者ページ</h1>
      </div>
      <nav className="space-y-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors duration-150`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`mr-3 size-5 ${
                  isActive ? "text-blue-700" : "text-gray-500"
                }`}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
