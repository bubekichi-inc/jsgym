"use client";
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
    <div className="flex flex-col gap-y-12">
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
  );
};

export default Page;
