"use client";
import NextLink from "next/link";
import React from "react";
import { PointPurchaseButton } from "./_components/PointPurchaseButton";
import { PointPackage } from "@/app/_constants/productMaster";
import { usePoints } from "@/app/_hooks/usePoints";
import { api } from "@/app/_utils/api";
import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
} from "@/app/api/checkout_session/_types/CheckoutSession";

const Page: React.FC = () => {
  const { data, error } = usePoints();
  if (error)
    return (
      <div className="text-center">
        ポイント残高の取得中にエラーが発生しました
      </div>
    );

  const purchasePoints = async (pointPackage: PointPackage) => {
    try {
      const { checkoutSessionUrl } = await api.post<
        CheckoutSessionRequest,
        CheckoutSessionResponse
      >("/api/checkout_session", { pointPackage });
      window.location.href = checkoutSessionUrl;
    } catch (error) {
      console.error(error);
      alert("ポイント購入に失敗しました");
    }
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
            {data ? (
              <div className="text-3xl font-bold">{data.points}</div>
            ) : (
              <div className="text-3xl text-gray-500">...取得中...</div>
            )}
            <div className="font-bold">pt</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <h4>ポイント購入</h4>
          <div className="flex gap-x-3">
            {Object.values(PointPackage).map((pointPackage) => (
              <PointPurchaseButton
                key={pointPackage}
                pointPackage={pointPackage}
                onClick={purchasePoints}
              />
            ))}
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
