import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { SendGridService } from "@/app/_serevices/SendGridService";
import { SlackService } from "@/app/_serevices/SlackService";

export const dynamic = "force-dynamic";

export type ContactRequest = { email: string; body: string };
export type ContactResponse = { message: string };

export const POST = async (request: NextRequest) => {
  try {
    const { email, body } = (await request.json()) as ContactRequest;
    if (!email || !body) {
      throw new Error("email and body are required");
    }

    const slack = new SlackService();
    await slack.postMessage({
      channel: "js-gym通知",
      message: `お問い合わせ\nemail: ${email}\n${body}`,
    });

    const sendGrid = new SendGridService();
    await sendGrid.sendEmail({
      to: email,
      subject: "お問い合わせありがとうございます",
      html: "<p>お問い合わせありがとうございます。内容を確認の上、2営業日以内にご返信いたします。</p>",
    });

    return NextResponse.json<ContactResponse>(
      { message: "success" },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
