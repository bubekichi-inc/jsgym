import { useCallback } from "react";

export const useApi = () => {
  const get = useCallback(async <ResponseType>(endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("データの取得に失敗しました。");
      }

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }, []);

  const post = async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
  };

  const put = async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 200) throw new Error("更新に失敗しました。");

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  };

  const del = async <ResponseType>(endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) throw new Error("削除に失敗しました。");

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  };

  return { get, post, put, del };
};
