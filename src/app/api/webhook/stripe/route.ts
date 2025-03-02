import { NextResponse, NextRequest } from "next/server";
import {
  PointService,
  DuplicatePointChargeError,
} from "@/app/api/_services/PointService";
import { buildPrisma } from "@/app/_utils/prisma";
import { stripe } from "@/app/_utils/stripe";
import { StripeCheckoutError } from "@/app/api/_utils/StripeCheckoutError";
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
        { status: 400 }
      );
    }

    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeWebhookSecret) {
      console.error("環境変数 STRIPE_WEBHOOK_SECRET が設定されていない。");
      return NextResponse.json(
        { error: "Stripe Webhook secret is not defined" },
        { status: 500 }
      );
    }

    // 2. リクエストボディの取得とイベント構築
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      stripeWebhookSecret
    );

    // 3. 支払い成功イベントの処理 (ポイントをチャージ)
    if (event.type === "payment_intent.succeeded") {
      // 3-1. メタデータの検証
      const stripePaymentId = event.data.object.id;
      const metadata = event.data.object.metadata;
      if (!metadata?.app_user_id || !metadata?.point) {
        const msg = "支払い情報に app_user_id または point が存在しません。";
        throw new StripeCheckoutError(msg, stripePaymentId);
      }
      const userId = metadata.app_user_id;
      const chargePoint = Number(metadata.point);

      // 3-2. 加算ポイント値のバリデーション
      if (isNaN(chargePoint) || chargePoint <= 0) {
        const msg = `不正なチャージポイント「${chargePoint}」を検出しました。`;
        throw new StripeCheckoutError(msg, stripePaymentId, userId);
      }

      // 3-3. データベース更新
      const prisma = await buildPrisma();
      try {
        const pointService = new PointService(prisma, userId);
        const user = await pointService.chargePointByPurchase(
          chargePoint,
          stripePaymentId
        );
        console.log(
          `■ ポイントチャージ成功: User "${user.name}" charged ${chargePoint} pt. ` +
            `New balance: ${user.points} pt.`
        );
      } catch (e) {
        // 同一 stripePaymentId による二重ポイントチャージの発生を捕捉
        // 開発用コマンド `stripe listen --forward-to` の多重起動に起因する可能性が高い
        if (e instanceof DuplicatePointChargeError) {
          console.log(
            `■ 要確認: 既にPaymentId: ${e.stripePaymentId} によるポイントチャージは処理済みです。\n`,
            "'stripe listen --forward-to' を多重起動している可能性があります。\n",
            `${e.message} (${e.occurredAt})`
          );
        } else {
          const msg = e instanceof Error ? e.message : `不明なエラー: ${e}`;
          throw new StripeCheckoutError(msg, stripePaymentId, userId);
        }
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
