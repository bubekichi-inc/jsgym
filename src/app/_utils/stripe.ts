import Stripe from "stripe";

// stripe クライアントの初期化＆エクスポート
//  第2引数も指定可能。詳細は...
//  https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
