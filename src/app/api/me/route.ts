import { NextRequest, NextResponse } from "next/server";
import { StripeCustomerUpdateRequest } from "./_types/StripeCustomer";
import {
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "./_types/UserProfile";
import { buildPrisma } from "@/app/_utils/prisma";
import { stripe } from "@/app/_utils/stripe";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

//GET
export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const token = request.headers.get("Authorization") ?? "";
    const { data } = await supabase.auth.getUser(token);
    const currentUser = data.user
      ? await prisma.user.findUnique({
          where: {
            supabaseUserId: data.user.id,
          },
        })
      : null;

    if (!currentUser)
      return NextResponse.json<UserProfileResponse>(null, {
        status: 200,
      });

    return NextResponse.json<UserProfileResponse>(currentUser, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};

//PUT
export const PUT = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const currentUser = await getCurrentUser({ request });
    const data: UserProfileUpdateRequest = await request.json();
    const { name, email, receiptName, iconUrl } = data;
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        email,
        receiptName,
        iconUrl,
      },
    });

    // email または receiptName に変更があれば Supabaseの顧客情報 を更新
    const stripeCustomerUpdateRequest: StripeCustomerUpdateRequest = {};

    if (email !== currentUser.email) stripeCustomerUpdateRequest.email = email;

    if (receiptName !== currentUser.receiptName)
      stripeCustomerUpdateRequest.name = receiptName?.trim() || email;

    // stripeCustomerUpdateRequest が空でなければ Stripe の顧客情報を更新
    if (Object.keys(stripeCustomerUpdateRequest).length > 0)
      await stripe.customers.update(
        currentUser.stripeCustomerId,
        stripeCustomerUpdateRequest
      );

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
