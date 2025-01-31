// フロントエンド用のプロダクト情報
export type PointProduct = {
  name: string; // 表示名
  price: number; // 価格(円)
  point: number; // ポイント数
};

// バックエンド用のプロダクト情報
export type StripePointProduct = PointProduct & {
  stripePriceId: string;
};
