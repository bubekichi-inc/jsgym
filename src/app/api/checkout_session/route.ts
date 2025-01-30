import { NextRequest, NextResponse } from "next/server";
import {
  CheckoutSessionResponse,
  CheckoutSessionRequest,
  PointPack,
} from "./_types/CheckoutSession";
import { buildPrisma } from "@/app/_utils/prisma";
import { stripe } from "@/app/_utils/stripe";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

const POINT_PACK_TO_PRICE_ID: Record<PointPack, string> = {
  [PointPack.PACK_10]: process.env.STRIPE_PRODUCT_A_PRICE_ID!,
  [PointPack.PACK_30]: process.env.STRIPE_PRODUCT_B_PRICE_ID!,
  [PointPack.PACK_100]: process.env.STRIPE_PRODUCT_C_PRICE_ID!,
};

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
    const { pointPack }: CheckoutSessionRequest = body;
    const priceId = POINT_PACK_TO_PRICE_ID[pointPack];

    const session = await stripe.checkout.sessions.create({
      customer: "cus_ReLsqA43NeYaXh",
      // customer: user.stripeCustomerId,
      success_url: process.env.NEXT_PUBLIC_APP_BASE_URL + "/settings/points",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        description: "Product ほげ", // 取引の説明
        metadata: {
          app_user_id: user.id,
          // プロダクトの情報
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
    return buildError(e);
  }
};
