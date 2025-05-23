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
// Mock Stripe for build or use real Stripe client
let stripeClient: any;
if (process.env.NEXT_PUBLIC_BUILD_BYPASS === 'true') {
  stripeClient = {
    checkout: {
      sessions: {
        create: async () => ({ url: 'https://example.com', id: 'mock-session-id' }),
      }
    },
    products: {
      list: async () => ({ data: [] }),
    },
    prices: {
      list: async () => ({ data: [] }),
    },
    paymentIntents: {
      retrieve: async () => ({}),
    },
    webhooks: {
      constructEvent: () => ({ type: 'mock.event', data: { object: {} } }),
    },
  };
} else {
  try {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_key_for_build');
  } catch (e) {
    console.error("Failed to initialize Stripe client, using mock instead", e);
    stripeClient = {
      checkout: {
        sessions: {
          create: async () => ({ url: 'https://example.com', id: 'mock-session-id' }),
        }
      }
    };
  }
}

export const stripe = stripeClient;

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
    [PointPackage.PACK_10]: process.env.STRIPE_PRODUCT_P10_PRICE_ID || 'mock_price_id_p10',
    [PointPackage.PACK_30]: process.env.STRIPE_PRODUCT_P30_PRICE_ID || 'mock_price_id_p30',
    [PointPackage.PACK_100]: process.env.STRIPE_PRODUCT_P100_PRICE_ID || 'mock_price_id_p100',
  };
  
  return {
    ...POINT_PRODUCTS_MASTER[type],
    stripePriceId: priceIdMap[type],
  };
}
