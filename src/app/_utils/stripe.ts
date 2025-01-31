import Stripe from "stripe";
import {
  PointPackage,
  POINT_PRODUCTS_MASTER,
} from "@/app/_constants/productMaster";
import { StripePointProduct } from "@/app/_types/Point";

// stripe クライアントの初期化
//  第2引数も指定可能。詳細は...
//  https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ポイントパッケージ -> Stripe の PriceID とプロダクト基本情報を取得
// STRIPE_PRODUCT_XXX_PRICE_ID は環境変数 (.env) で設定
export function getStripePointProduct(type: PointPackage): StripePointProduct {
  const priceIdMap: Record<PointPackage, string> = {
    [PointPackage.PACK_10]: process.env.STRIPE_PRODUCT_A_PRICE_ID!,
    [PointPackage.PACK_30]: process.env.STRIPE_PRODUCT_B_PRICE_ID!,
    [PointPackage.PACK_100]: process.env.STRIPE_PRODUCT_C_PRICE_ID!,
  };
  return {
    ...POINT_PRODUCTS_MASTER[type],
    stripePriceId: priceIdMap[type],
  };
}
