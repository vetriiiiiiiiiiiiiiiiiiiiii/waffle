"use client";
import type React from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
let loading: Promise<{ gsap: Gsap; ScrollTrigger: ST }> | null = null;

/**
 * GSAP + ScrollTrigger, loaded on demand. Only scroll-scrubbed scenes need them,
 * so they stay out of the first-load bundle (everything else animates with CSS).
 */
export function loadGsap() {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  });
  return loading;
}

const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** true when the reader asked for less motion. Server renders as "full motion" then corrects. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export function useIsSmall(breakpoint = 768) {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setSmall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return small;
}

/** A stepped ease: movement that looks frame-by-frame, like hand animation. */
export const STEPS = "steps(8)";

/** true once the element comes within `margin` of the viewport (then stays true). */
export function useNearViewport<T extends Element>(ref: React.RefObject<T | null>, enabled = true, margin = "600px") {
  const [near, setNear] = useState(!enabled);
  useEffect(() => {
    if (!enabled || near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled, near, margin]);
  return near;
}
