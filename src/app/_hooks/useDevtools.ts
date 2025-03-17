"use client";

import { useState, useEffect } from "react";
import { devToolHTML } from "../_utils/devToolsHTML";

export function useDevtools() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const devtoolsRawUrl = URL.createObjectURL(
      new Blob([devToolHTML], { type: "text/html" })
    );
    setUrl(devtoolsRawUrl);
    return () => URL.revokeObjectURL(devtoolsRawUrl);
  }, []);

  return `${url}#?embedded=${encodeURIComponent(location.origin)}`;
}
