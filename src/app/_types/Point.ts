// フロントエンド用のプロダクト（購入可能なポイントパッケージ）の情報
export type PointProduct = {
  name: string; // 表示名
  price: number; // 価格(円)
  point: number; // ポイント数
};

// バックエンド専用のプロダクト情報（Stripeの価格IDを追加）
export type StripePointProduct = PointProduct & {
  stripePriceId: string;
};
