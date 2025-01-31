import React from "react";
import {
  PointPackage,
  POINT_PRODUCTS_MASTER,
} from "@/app/_constants/productMaster";

interface Props {
  pointPackage: PointPackage;
  onClick: (pointPack: PointPackage) => void;
}

export const PointPurchaseButton: React.FC<Props> = ({
  pointPackage,
  onClick,
}) => {
  const { price, point } = POINT_PRODUCTS_MASTER[pointPackage];

  return (
    <button
      className="w-28 rounded-md border border-indigo-500 bg-indigo-50 py-3 hover:bg-indigo-100"
      onClick={() => onClick(pointPackage)}
    >
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold">{point.toLocaleString()}pt</div>
        <div className="text-sm">{price.toLocaleString()}円</div>
      </div>
    </button>
  );
};
