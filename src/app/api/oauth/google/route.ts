import { NextRequest, NextResponse } from "next/server";
import { GoogleRequest } from "./_types/GoogleRequest";
import { buildPrisma } from "@/app/_utils/prisma";
import { stripe } from "@/app/_utils/stripe";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";

export const POST = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  const { accessToken }: GoogleRequest = await request.json();
  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      console.error("Supabase error:", error.message);
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });
    if (user)
      return NextResponse.json({ message: "既存ユーザー" }, { status: 200 });

    // Stripeに「顧客」を作成
    // Note: name には full_name ではなく、あえて email を使用
    //  (full_name には Stripeでの管理上、識別子に使いずらい値が設定されていることがあるため)
    // Note: /settings/profile で receiptName が設定されたときは name をそれに更新
    const stripeCustomer = await stripe.customers.create({
      email: data.user.user_metadata.email,
      name: data.user.user_metadata.email, // 注意,
      preferred_locales: ["ja-JP"],
    });

    const newUser = await prisma.user.create({
      data: {
        supabaseUserId: data.user.id,
        name: data.user.user_metadata.full_name,
        email: data.user.user_metadata.email,
        stripeCustomerId: stripeCustomer.id,
      },
    });

    // Stripeの顧客情報のメタデータに各種IDを追加 (stripeはスネークケースが基本)
    // 支払いトラブルがあったときに備えて、Stripe側の顧客情報にも各種IDを紐付けておく
    await stripe.customers.update(stripeCustomer.id, {
      metadata: {
        app_user_id: newUser.id,
        supabase_user_id: newUser.supabaseUserId,
      },
    });

    return NextResponse.json(
      {
        user,
        message: "新規ユーザー登録",
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
