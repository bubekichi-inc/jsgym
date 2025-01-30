import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/app/_utils/stripe";
import { buildError } from "@/app/api/_utils/buildError";

// ローカルエンドポイントにイベントを転送する
// https://docs.stripe.com/webhooks?locale=ja-JP#local-listener
// > stripe listen --forward-to localhost:3000/api/webhook/stripe

// [POST] /api/webhook/stripe
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    if (event.type === "payment_intent.succeeded") {
      // ここにポイント追加関連の処理を書く
      console.log(JSON.stringify(event, null, 2));
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
