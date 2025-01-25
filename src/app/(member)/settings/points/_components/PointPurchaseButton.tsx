import React from "react";

interface Props {
  amount: number; // ポイント数
  price: number; // 価格 (日本円)
  onClick: (amount: number) => void;
}

export const PointPurchaseButton: React.FC<Props> = ({
  amount,
  price,
  onClick,
}) => {
  return (
    <button
      className="w-28 rounded-md border border-indigo-500 bg-indigo-50 py-3 hover:bg-indigo-100"
      onClick={() => onClick(amount)}
    >
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold">{amount.toLocaleString()}pt</div>
        <div className="text-sm">{price.toLocaleString()}円</div>
      </div>
    </button>
  );
};
