import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const useAutoRefresh = (shouldReloadData: boolean) => {
  const router = useRouter();

  useEffect(() => {
    let interval = null;
    if (shouldReloadData) {
      interval = setInterval(() => {
        router.invalidate();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [router, shouldReloadData]);
};
