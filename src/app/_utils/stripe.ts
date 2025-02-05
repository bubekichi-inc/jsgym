import Stripe from "stripe";
import {
  PointPackage,
  POINT_PRODUCTS_MASTER,
} from "@/app/_constants/productMaster";
import { StripePointProduct } from "@/app/_types/Point";

/**
 * StripeClientの生成と初期化
 *
 * @see {@link https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration} 設定オプション詳細
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * PointPackage列挙子 から StripePriceId を含むプロダクト情報を取得
 *
 * @param type - ポイントパッケージの種類（PACK_10, PACK_30, PACK_100 etc.）
 * @returns Stripe商品情報（価格ID、名称、ポイント数など）を含むオブジェクト
 *
 * @remarks バックエンドのみで使用可能。フロントエンドから呼び出すと環境変数が未定義でエラーとなる。
 * @see /src/app/_constants/productMaster.ts
 */
export function getStripePointProduct(type: PointPackage): StripePointProduct {
  const priceIdMap: Record<PointPackage, string> = {
    [PointPackage.PACK_10]: process.env.STRIPE_PRODUCT_P10_PRICE_ID!,
    [PointPackage.PACK_30]: process.env.STRIPE_PRODUCT_P30_PRICE_ID!,
    [PointPackage.PACK_100]: process.env.STRIPE_PRODUCT_P100_PRICE_ID!,
  };
  return {
    ...POINT_PRODUCTS_MASTER[type],
    stripePriceId: priceIdMap[type],
  };
}
