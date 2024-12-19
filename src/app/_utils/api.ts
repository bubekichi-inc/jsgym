import { supabase } from "./supabase";

const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("セッション情報がありません");
  if (!data.session) throw new Error("セッション情報がありません");
  return data.session.access_token;
};
export const api = {
  post: async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "登録に失敗しました。";
        throw new Error(errorMessage);
      }

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  put: async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 200) throw new Error("更新に失敗しました。");

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  },

  del: async <ResponseType>(endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
      });

      if (response.status !== 200) throw new Error("削除に失敗しました。");

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  },
};
