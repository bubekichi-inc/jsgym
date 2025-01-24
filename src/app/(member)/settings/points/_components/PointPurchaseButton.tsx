import React from "react";

interface Props {
  amount: number; // ポイント数
  price: number; // 価格
  onClick: (amount: number) => void;
}

export const PointPurchaseButton: React.FC<Props> = (props) => {
  return (
    <button
      className="w-28 rounded-md border border-indigo-500 bg-indigo-50 py-3 hover:bg-indigo-100"
      onClick={() => props.onClick(props.amount)}
    >
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold">
          {props.amount.toLocaleString()}pt
        </div>
        <div className="text-sm">{props.price.toLocaleString()}円</div>
      </div>
    </button>
  );
};
