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

  const timestamp = new Date().getTime();
  const filePath = `private/${userId}_${timestamp}`;

  const { data: fileList, error: listError } = await supabase.storage
    .from(bucketName)
    .list("private", { search: userId });

  if (listError) {
    console.error("ファイル一覧の取得に失敗:", listError.message);
    return { error: "ファイル一覧の取得に失敗しました。" };
  }

  //古いファイルを削除
  const oldFiles = fileList?.filter((file) =>
    file.name.startsWith(`${userId}_`)
  );
  if (oldFiles && oldFiles.length > 0) {
    const oldFilePaths = oldFiles.map((file) => `private/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(oldFilePaths);

    if (deleteError) {
      console.error("古いアイコンの削除に失敗:", deleteError.message);
      return { error: "古いアイコンの削除に失敗しました。" };
    }
  }

  // 新しい画像をアップロード
  //remove→uploadのみに変更：updateだと、storageに画像が増えていったため。
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: "3600" });

  if (uploadError) {
    console.error("アイコンのアップロードに失敗:", uploadError.message);
    return { error: "アイコンのアップロードに失敗しました。" };
  }

  const { data } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  return { imageUrl: data.publicUrl };
};
