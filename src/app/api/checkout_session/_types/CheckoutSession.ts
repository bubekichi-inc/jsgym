// 購入可能なポイントパックの列挙型
export const enum PointPack {
  PACK_10 = 10,
  PACK_30 = 30,
  PACK_100 = 100,
}

// POSTリクエストのボディ
export type CheckoutSessionRequest = {
  pointPack: PointPack;
};

export type CheckoutSessionResponse = {
  checkoutSessionUrl: string; // 支払いページのURL
};
