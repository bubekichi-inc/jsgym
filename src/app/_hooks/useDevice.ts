"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MIN_WIDTH = 768;

export const useDevice = () => {
  const pahtname = usePathname();
  const [isSp, setIsSp] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    setIsSp(mobileRegex.test(userAgent) || window.innerWidth < MIN_WIDTH);
  }, [pahtname]);

  return { isSp };
};
