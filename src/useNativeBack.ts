import { useEffect } from "react";
import { useRouterStore } from "./useRouterStore";

export const useNativeBack = (): void => {
  const popFromNative = useRouterStore((state) => state.popFromNative);

  useEffect(() => {
    const handlePopState = (_event: PopStateEvent): void => {
      popFromNative();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [popFromNative]);
};
