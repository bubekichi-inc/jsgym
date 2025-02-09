import { supabase } from "./supabase";

interface UpdateSupabaseImageParams {
  bucketName: string;
  userId: string;
  file: File;
}

export const updateSupabaseImage = async ({
  bucketName,
  userId,
  file,
}: UpdateSupabaseImageParams): Promise<{
  imageUrl?: string;
  error?: string;
}> => {
  if (!userId) return { error: "ユーザーIDが無効です。" };

  const filePath = `private/${userId}`;

  // 既存のファイルがあるか確認
  const { data: fileList, error: listError } = await supabase.storage
    .from(bucketName)
    .list("private", { search: userId });

  if (listError) {
    console.error("ファイル一覧の取得に失敗:", listError.message);
    return { error: "ファイル一覧の取得に失敗しました。" };
  }

  const fileExists = fileList?.some((file) => file.name === userId);
  const uploadMethod = fileExists ? "update" : "upload";

  // 画像アップロード
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    [uploadMethod](filePath, file, { cacheControl: "3600", upsert: true });

  if (uploadError) {
    console.error("アイコンのアップロードに失敗:", uploadError.message);
    return { error: "アイコンのアップロードに失敗しました。" };
  }

  // アップロード成功後、URL を取得
  const { data } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  return { imageUrl: `${data.publicUrl}?t=${new Date().getTime()}` };
};
