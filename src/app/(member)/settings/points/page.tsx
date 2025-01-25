"use client";
import NextLink from "next/link";
import React from "react";
import { PointPurchaseButton } from "./_components/PointPurchaseButton";

const Page: React.FC = () => {
  const [points, setPoints] = React.useState(1000);

  const purchasePoints = (amount: number) => {
    console.log(`ポイント購入: ${amount}pt`);
    setPoints(points + amount);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <h2 className="text-3xl font-bold">各種設定</h2>
      <div className="flex gap-x-12">
        <NextLink
          href="/settings/profile"
          className="px-6 pb-1 text-xl font-bold text-gray-500"
        >
          プロフィール
        </NextLink>
        <div className="border-b-2 border-black pb-1">
          <h3 className="px-6 text-xl font-bold">ポイント購入</h3>
        </div>
        <NextLink
          href="#"
          className="px-6 pb-1 text-xl font-bold text-gray-500"
        >
          通知設定
        </NextLink>
      </div>

      <div className="mt-10 flex flex-col gap-y-12">
        <div className="flex items-center justify-between">
          <h4>保有ポイント</h4>
          <div className="flex items-end gap-x-2">
            <div className="text-3xl font-bold">{points}</div>
            <div className="font-bold">pt</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <h4>ポイント購入</h4>
          <div className="flex gap-x-3">
            <PointPurchaseButton
              amount={10}
              price={550}
              onClick={purchasePoints}
            />
            <PointPurchaseButton
              amount={30}
              price={1100}
              onClick={purchasePoints}
            />
            <PointPurchaseButton
              amount={100}
              price={3300}
              onClick={purchasePoints}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <h4>ポイントについて</h4>
          <div>1回のコードレビュー or 追加の質問で 1pt を消費します。</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
