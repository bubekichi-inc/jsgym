import { PointProduct } from "@/app/_types/Point";

/**
 * プロダクト（ポイントパッケージ）は、以下の手順で追加すること。
 *
 * 0. Stripeポータルで商品を作成。価格ID (price_XXX) を取得
 * 1. 環境変数 (.env) に価格IDを追加
 *     - 例: STRIPE_PRODUCT_P50_PRICE_ID=price_XXX
 * 2. PointPackage に列挙子を追加 (例: PACK_50)
 * 3. POINT_PRODUCTS_MASTER にプロダクト情報を追加
 * 4. /src/_utils/stripe.ts の getStripePointProduct に
 *    PointPackage に列挙子 と 環境変数の対応付けを追加
 */

// ポイントパッケージの定義
export enum PointPackage {
  PACK_10 = "PACK_10",
  PACK_30 = "PACK_30",
  PACK_100 = "PACK_100",
}

// ポイントパッケージのマスターデータ
export const POINT_PRODUCTS_MASTER: Record<PointPackage, PointProduct> = {
  [PointPackage.PACK_10]: {
    name: "10ptパック",
    price: 550,
    point: 10,
  },
  [PointPackage.PACK_30]: {
    name: "30ptパック",
    price: 1100,
    point: 30,
  },
  [PointPackage.PACK_100]: {
    name: "100ptパック",
    price: 3300,
    point: 100,
  },
} as const;
