"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVT = "waffle-story:stored";

/** JSON in localStorage as React state, server-safe (null until hydrated). */
export function useStored<T>(key: string, fallback: T): [T | null, (v: T) => void] {
  const raw = useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      window.addEventListener(EVT, cb);
      return () => {
        window.removeEventListener("storage", cb);
        window.removeEventListener(EVT, cb);
      };
    },
    () => localStorage.getItem(key) ?? "__none__",
    () => null,
  );
  const value = useMemo(() => {
    if (raw === null) return null;
    if (raw === "__none__") return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback(
    (v: T) => {
      localStorage.setItem(key, JSON.stringify(v));
      window.dispatchEvent(new Event(EVT));
    },
    [key],
  );
  return [value, set];
}
