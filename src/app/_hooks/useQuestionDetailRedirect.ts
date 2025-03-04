import { useLocalStorage } from "./useLocalStorage";

export const useQuestionDetailRedirect = () => {
  const [redirectQid, setRedirectQid] = useLocalStorage<string | null>(
    "redirectQid",
    null
  );

  const reset = () => {
    setRedirectQid(null);
  };

  return { redirectQid, setRedirectQid, reset };
};
