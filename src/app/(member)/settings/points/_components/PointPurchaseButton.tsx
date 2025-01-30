import React from "react";
import { PointPack } from "@/app/api/checkout_session/_types/CheckoutSession";
interface Props {
  product: PointPack;
  price: number; // 価格 (日本円)
  onClick: (amount: number) => void;
}

export const PointPurchaseButton: React.FC<Props> = ({
  product,
  price,
  onClick,
}) => {
  return (
    <button
      className="w-28 rounded-md border border-indigo-500 bg-indigo-50 py-3 hover:bg-indigo-100"
      onClick={() => onClick(product)}
    >
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold">{product.toLocaleString()}pt</div>
        <div className="text-sm">{price.toLocaleString()}円</div>
      </div>
    </button>
  );
};
