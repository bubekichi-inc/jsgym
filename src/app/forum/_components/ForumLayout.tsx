"use client";

import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { MainLayout } from "@/app/_components/MainLayout";

export const ForumLayout: React.FC<{
  children: React.ReactNode;
  showHeader?: boolean;
}> = ({ children, showHeader = true }) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {showHeader && (
          <div className="mb-8">
            <h1 className="flex items-center text-2xl font-bold text-gray-800 md:text-3xl">
              <FontAwesomeIcon icon={faComments} className="mr-3 text-blue-500" />
              フォーラム
            </h1>
            <p className="mt-2 text-gray-600">
              プログラミングの質問や情報共有、交流の場としてご利用ください。
            </p>
          </div>
        )}
        {children}
      </div>
    </MainLayout>
  );
};