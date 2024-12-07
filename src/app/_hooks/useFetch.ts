import useSWR from "swr";

export const useFetch = <T>(path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const fetcher = async () => {
    const prams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const resp = await fetch(`${baseUrl}${path}`, prams);
    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(
        errorData.message || "An error occurred while fetching the data."
      );
    }
    const data: T = await resp.json();
    return data;
  };
  const results = useSWR(`${baseUrl}${path}`, fetcher);
  return results;
};
