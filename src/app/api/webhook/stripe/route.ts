import { NextResponse, NextRequest } from "next/server";
import { PointService } from "@/app/_serevices/PointService";
import { buildPrisma } from "@/app/_utils/prisma";
import { stripe } from "@/app/_utils/stripe";
import { buildError } from "@/app/api/_utils/buildError";

// ローカルエンドポイントにイベントを転送する
// https://docs.stripe.com/webhooks?locale=ja-JP#local-listener
// > stripe listen --forward-to localhost:3000/api/webhook/stripe

// [POST] /api/webhook/stripe
export const POST = async (request: NextRequest) => {
  try {
    // 1. バリデーション
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      console.error(
        "StripeWebhook に stripe-signature が含まれていない。不正なアクセス？"
      );
      return NextResponse.json(
        { error: "No stripe-signature" },
        { status: 401 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("環境変数 STRIPE_WEBHOOK_SECRET が設定されていない。");
      return NextResponse.json(
        { error: "Webhook secret is not defined" },
        { status: 500 }
      );
    }

    // 2. リクエストボディの取得とイベント構築
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // 3. 支払い成功イベントの処理 (ポイントをチャージ)
    if (event.type === "payment_intent.succeeded") {
      // 3-1. メタデータの検証
      const metadata = event.data.object.metadata;
      if (!metadata?.app_user_id || !metadata?.point) {
        console.error(
          "メタデータに app_user_id または point が設定されていない。",
          JSON.stringify(metadata)
        );
        return NextResponse.json(
          { error: "Invalid metadata" },
          { status: 400 }
        );
      }
      const userId = metadata.app_user_id;
      const chargePoint = Number(metadata.point);

      // 3-2. ポイント値のバリデーション
      if (isNaN(chargePoint) || chargePoint <= 0) {
        console.error("ポイント値がおかしい", {
          eventId: event.id,
          JSON: JSON.stringify(metadata, null, 2),
        });
        return NextResponse.json(
          { error: "Invalid point value" },
          { status: 400 }
        );
      }

      // 3-3. データベース更新
      const prisma = await buildPrisma();
      const pointService = new PointService(prisma);
      const user = await pointService.chargePointByPurchase(
        userId,
        chargePoint,
        event.data.object.id
      );

      // 成功ログ
      console.info(
        `■ Payment Succeeded. User "${user.name}" charged ${chargePoint} pt. New balance: ${user.points} pt.`
      );
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
