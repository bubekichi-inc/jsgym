import { PointPackage } from "@/app/_constants/productMaster";

// POSTリクエストのボディ
export type CheckoutSessionRequest = {
  pointPackage: PointPackage;
};

export type CheckoutSessionResponse = {
  checkoutSessionUrl: string; // 支払いページのURL
};
