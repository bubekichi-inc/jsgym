import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"; // Node.jsでHTTPリクエストを行うためのモジュール
import { GoogleRequest } from "./_types/GoogleRequest";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";

const saveAvatarToBucket = async (avatarUrl: string) => {
  try {
    // 1. Googleからアバター画像をダウンロード
    const response = await fetch(avatarUrl);
    if (!response.ok) {
      throw new Error("Failed to download avatar image");
    }
    const imageBuffer = await response.buffer();
    const filePath = `private/${avatarUrl}`;
    // 2. Supabaseストレージにアップロード
    const { error: uploadError } = await supabase.storage
      .from("profile_icons") // バケットの名前
      .upload(filePath, imageBuffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Failed to upload avatar to bucket: ${uploadError.message}`
      );
    }

    console.log("Avatar uploaded successfully");
  } catch (error) {
    console.error("Error saving avatar to bucket:", error);
  }
};
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
    const avatarUrl = data.user.user_metadata.avatar_url;
    if (user) {
      // return NextResponse.json({ message: "既存ユーザー" }, { status: 200 });{
      // 既存ユーザーの場合、アバター情報を更新
      await prisma.user.update({
        where: {
          supabaseUserId: data.user.id,
        },
        data: {
          iconUrl: avatarUrl,
        },
      });

      await saveAvatarToBucket(avatarUrl);
      return NextResponse.json(
        { message: "既存ユーザー更新" },
        { status: 200 }
      );
    }

    // 新規ユーザーの場合
    await prisma.user.create({
      data: {
        supabaseUserId: data.user.id,
        name: data.user.user_metadata.full_name,
        email: data.user.user_metadata.email,
        iconUrl: avatarUrl,
      },
    });

    await saveAvatarToBucket(avatarUrl);
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
