"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { loadGsap } from "@/lib/motion";

type W = Window & { __lenis?: Lenis; __st?: { refresh: () => void } };

/**
 * Lenis smooth scroll driving GSAP ScrollTrigger. Loaded after the page is idle
 * so it never sits on the critical path. Off for reduced-motion readers.
 */
export function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop = false;
    let cleanup: (() => void) | undefined;
    const start = async () => {
      const [{ default: LenisCtor }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), loadGsap()]);
      if (stop) return;
      const lenis = new LenisCtor({ lerp: 0.12, smoothWheel: true });
      (window as W).__lenis = lenis;
      (window as W).__st = ScrollTrigger;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = ric(() => void start(), { timeout: 2500 } as IdleRequestOptions);
    return () => {
      stop = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
      cleanup?.();
    };
  }, []);
  useEffect(() => {
    const w = window as W;
    w.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => w.__st?.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [path]);
  return null;
}
