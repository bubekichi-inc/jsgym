import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { SlackService } from "@/app/_serevices/SlackService";
import { StripeCheckoutError } from "@/app/api/_utils/StripeCheckoutError";

export const buildError = async (e: unknown) => {
  console.log("error!!!")
  Sentry.captureException(e);

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
    const slack = new SlackService();
    await slack.postMessage({
      channel: "js-gym通知",
      message: `エラー発生: ${e.message}`,
    });

    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
};
