import { NextRequest, NextResponse } from "next/server";
import {
  CheckoutSessionResponse,
  CheckoutSessionRequest,
} from "./_types/CheckoutSession";
import { buildPrisma } from "@/app/_utils/prisma";
import { getStripePointProduct, stripe } from "@/app/_utils/stripe";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export const POST = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    // ユーザー情報の取得
    const { id } = await getCurrentUser({ request });
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return NextResponse.json(
        { error: "user情報の取得に失敗しました" },
        { status: 404 }
      );

    // リクエストボディからポイントパックを取得
    const body = await request.json();
    const { pointPackage }: CheckoutSessionRequest = body;
    const pointProduct = getStripePointProduct(pointPackage);

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/settings/points`,
      line_items: [
        {
          price: pointProduct.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        description: `Product "${pointProduct.name}" の購入`, // 取引の説明
        metadata: {
          app_user_id: user.id,
          point: pointProduct.point,
          price: pointProduct.price,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "checkout sessionの作成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json<CheckoutSessionResponse>(
      { checkoutSessionUrl: session.url },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
