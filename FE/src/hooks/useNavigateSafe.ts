import { AppRoute, NavMethod } from "@/constants/routes";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

export const useNavigateSafe = () => {
  const router = useRouter();
  const navigating = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const navigateSafe = useCallback(
    (path: AppRoute, method: NavMethod = "push") => {
      if (navigating.current) {
        return;
      }
      navigating.current = true;

      try {
        router[method](path);
      } catch (err) {
        navigating.current = false;
        if (__DEV__) {
          console.warn("[useNavigateSafe] navigation error:", err);
        }
        return;
      } finally {
        setTimeout(() => {
          if (mountedRef.current) {
            navigating.current = false;
          }
        }, 400);
      }
    },
    [router],
  );

  const goToBack = useCallback(() => {
    if (navigating.current) {
      return;
    }
    navigating.current = true;
    try {
      router.back();
    } catch {
      navigating.current = false;
    }
    setTimeout(() => {
      if (mountedRef.current) {
        navigating.current = false;
      }
    }, 400);
  }, [router]);

  return { navigateSafe, goToBack, mountedRef };
};
