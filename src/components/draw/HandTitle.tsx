"use client";
import { useEffect, useRef, type ElementType } from "react";
import type React from "react";
import { seeded } from "@/lib/random";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** crayon highlight behind a line, like the concept deck */
  highlight?: string;
  highlightLine?: number;
  /** different salt = different wobble for the same words */
  salt?: string;
  /** write on when scrolled into view (default), from first paint ("mount"/"css"), or not at all */
  play?: "view" | "mount" | "css" | "none";
  delay?: number;
  id?: string;
};

/**
 * Hand-lettered ALL CAPS headline. Every letter gets its own tilt and baseline,
 * seeded from the text so server and client agree, then writes on letter by letter.
 */
export function HandTitle({
  children,
  as: Tag = "h2",
  className = "",
  highlight,
  highlightLine,
  salt = "",
  play = "view",
  delay = 0,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const lines = children.toUpperCase().split("\n");
  const hl = highlightLine ?? lines.length - 1;
  const rand = seeded(children + salt);
  let gi = 0;

  // CSS does the writing (globals.css: [data-writeon].is-playing). JS only says "now", when it scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || play !== "view") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-playing");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <Tag ref={ref} id={id} className={`font-hand uppercase leading-[1.02] text-pencil ${play === "mount" || play === "css" ? "is-playing" : ""} ${className}`}
      data-writeon={play !== "none" ? "" : undefined}
      style={{ ["--base" as string]: `${delay}s`, ["--n" as string]: children.length } as React.CSSProperties}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="block">
        {lines.map((line, li) => (
          <span key={li} className="relative block w-fit">
            {highlight && li === hl && (
              <svg
                className="hl-band pointer-events-none absolute -left-[3%] bottom-[0.02em] -z-0 h-[0.55em] w-[106%] overflow-visible"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 11 C 15 7, 30 14, 46 9 S 78 13, 99 8 L 98 15 C 80 18, 55 12, 35 17 S 10 15, 2 17 Z"
                  fill={highlight}
                  opacity="0.85"
                  filter="url(#crayon-tooth)"
                />
              </svg>
            )}
            <span className="relative">
              {line.split(" ").map((word, wi, arr) => (
                <span key={wi}><span className="inline-block whitespace-nowrap">
                  {Array.from(word).map((ch, ci) => {
                    const rot = (rand() * 2 - 1) * 3.2;
                    const dy = (rand() * 2 - 1) * 0.045;
                    const sc = 0.96 + rand() * 0.08;
                    return (
                      <span
                        key={ci}
                        className="glyph inline-block"
                        style={{ transform: `translateY(${dy.toFixed(3)}em) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`, ["--i" as string]: gi++ }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                  </span>{wi < arr.length - 1 && " "}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
