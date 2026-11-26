"use client";
import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";

type BoilProps<T extends ElementType> = {
  as?: T;
  /** turn the boil off (e.g. while the piece is still drawing on) */
  off?: boolean;
} & ComponentPropsWithoutRef<T>;

/**
 * Wrap an illustration so its lines "boil" like hand-drawn animation.
 * Pauses when off-screen so we never pay for filters nobody sees.
 */
export function Boil<T extends ElementType = "div">({ as, off, className = "", ...rest }: BoilProps<T>) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || off) return;
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-paused", !e.isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [off]);
  return <Tag ref={ref} className={`${off ? "" : "boil"} ${className}`} {...rest} />;
}
