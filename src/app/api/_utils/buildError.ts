import { NextResponse } from "next/server";
import { StripeCheckoutError } from "@/app/api/_utils/StripeCheckoutError";

export const buildError = (e: unknown) => {
  if (e instanceof StripeCheckoutError) {
    // エラーログに UserId と StripePaymentId を含める
    const msg =
      `StripeCheckoutError: ${e.message} ` +
      `UserId: '${e.userId}' StripePaymentId: '${e.stripePaymentId}'`;
    console.error(msg);

    if (e.forwardToSlack) {
      // TODO: 別の担当者がSlack通知処理を実装する
      // 必要に応じて e.stripePaymentId や e.userId、e.occurredAt を含めた通知を行う
    }

    // Webhook の受信自体は成功しているため（Webhookのリトライを防ぐため）、
    // Stripe に対しては「正常受信」のレスポンス を返す。
    return NextResponse.json({ received: true }, { status: 200 });
  }

  if (e instanceof Error) {
    console.error(e.message);

    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
};
