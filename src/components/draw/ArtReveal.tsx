"use client";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type CSSProperties } from "react";
import { art, type ArtKey } from "@/lib/art";
import { seeded } from "@/lib/random";
import { useNearViewport } from "@/lib/motion";
import { preload } from "react-dom";

export type Box = [x: number, y: number, w: number, h: number];

/** A crayon zig-zag that covers a box: the path a kid's hand makes when colouring fast. */
export function zigzag([x, y, w, h]: Box, rows: number, dir: "h" | "v", key: string) {
  const r = seeded(key);
  const pts: string[] = [];
  if (dir === "h") {
    const step = h / rows;
    for (let i = 0; i <= rows; i++) {
      const yy = y + i * step + (r() - 0.5) * step * 0.3;
      const xa = i % 2 ? x + w + step * 0.4 : x - step * 0.4;
      pts.push(`${xa.toFixed(1)},${yy.toFixed(1)}`);
    }
    return { d: "M" + pts.join(" L"), width: step * 1.55 };
  }
  const step = w / rows;
  for (let i = 0; i <= rows; i++) {
    const xx = x + i * step + (r() - 0.5) * step * 0.3;
    const ya = i % 2 ? y + h + step * 0.4 : y - step * 0.4;
    pts.push(`${xx.toFixed(1)},${ya.toFixed(1)}`);
  }
  return { d: "M" + pts.join(" L"), width: step * 1.55 };
}

export type ArtRevealHandle = {
  /** build the draw-on timeline (line first, then colour). Caller decides when to play. */
  /** scrubbed scenes only: builds a GSAP timeline (pass the lazily loaded gsap in) */
  timeline: (gsap: typeof import("gsap").gsap, opts?: { lineDur?: number; colourDur?: number; stagger?: number }) => gsap.core.Timeline | null;
  svg: SVGSVGElement | null;
};

type Props = {
  k: ArtKey;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** regions revealed in order (defaults to the whole image) */
  regions?: Box[];
  /** a circle left out of the masks so it can arrive separately (e.g. the O waffle) */
  exclude?: { cx: number; cy: number; r: number };
  /** draw the pencil-only layer first (needs the -line.webp file) */
  lineFirst?: boolean;
  /** play when scrolled into view (CSS). false = driven by a parent via timeline() */
  autoPlay?: boolean;
  delay?: number;
  rows?: number;
  decorative?: boolean;
  /** above the fold: preload and load immediately (otherwise loads ~600px before it scrolls in) */
  priority?: boolean;
  /** with priority: also emit a high-priority preload (only for the LCP piece) */
  preloadArt?: boolean;
  /** draw on with CSS keyframes from first paint (no JS wait). Seconds. */
  css?: { start?: number; lineDur?: number; colourDur?: number; stagger?: number };
};

/**
 * Real brand art, revealed the way it was made: black line first,
 * then a crayon-scribble mask wipes the colour in.
 */
export const ArtReveal = forwardRef<ArtRevealHandle, Props>(function ArtReveal(
  { k, alt, className = "", style, regions, exclude, lineFirst = true, autoPlay = true, delay = 0, rows = 7, decorative, priority, css, preloadArt = true },
  ref,
) {
  const a = art(k);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const near = useNearViewport(svgRef, !priority);
  if (priority && preloadArt) {
    // the pencil layer paints first (and is the LCP); the colour follows at normal priority
    preload(lineFirst ? a.line : a.src, { as: "image", fetchPriority: "high" });
  }
  const boxes: Box[] = regions ?? [[0, 0, a.w, a.h]];

  const build: ArtRevealHandle["timeline"] = (gsap, opts = {}) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const { lineDur = 0.9, colourDur = 1.1, stagger = 0.12 } = opts;
    const lines = svg.querySelectorAll(".mask-line path");
    const cols = svg.querySelectorAll(".mask-colour path");
    const tl = gsap.timeline({ paused: true });
    if (lines.length) tl.fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: lineDur, ease: "power2.out", stagger });
    tl.fromTo(
      cols,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: colourDur, ease: "steps(12)", stagger },
      lines.length ? lineDur * 0.65 : 0,
    );
    return tl;
  };

  useImperativeHandle(ref, () => ({ timeline: build, svg: svgRef.current }));

  // CSS draws it (globals.css: .art-reveal.is-playing). In "view" mode JS only adds the class on scroll.
  const mode = css ? "load" : autoPlay ? "view" : "manual";
  const t = css ?? { start: delay, lineDur: 0.9, colourDur: 1.1, stagger: 0.12 };
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || mode !== "view") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          svg.classList.add("is-playing");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, [mode]);

  const maskBody = (kind: "line" | "colour") => (
    <>
      <g className={`mask-${kind}`}>
        {boxes.map((b, i) => {
          const z = zigzag(b, kind === "line" ? Math.max(4, rows - 2) : rows, kind === "line" ? "v" : "h", `${k}-${kind}-${i}`);
          const lineDur = t.lineDur ?? 0.5;
          const c =
            mode === "manual"
              ? undefined
              : {
                  ["--dur" as string]: `${kind === "line" ? lineDur : (t.colourDur ?? 0.55)}s`,
                  ["--delay" as string]: `${((t.start ?? 0) + i * (t.stagger ?? 0.11) + (kind === "colour" && lineFirst ? lineDur * 0.65 : 0)).toFixed(3)}s`,
                  ["--ease" as string]: kind === "colour" ? "steps(12, end)" : undefined,
                };
          return (
            <path
              key={i}
              style={c}
              className="mask-path"
              d={z.d}
              fill="none"
              stroke="#fff"
              strokeWidth={z.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
            />
          );
        })}
      </g>
      {exclude && <circle cx={exclude.cx} cy={exclude.cy} r={exclude.r} fill="#000" />}
    </>
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${a.w} ${a.h}`}
      className={`art-reveal block h-auto w-full overflow-visible ${mode === "load" ? "is-playing" : ""} ${className}`}
      style={style}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <mask id={`c${uid}`} maskUnits="userSpaceOnUse" x={-40} y={-40} width={a.w + 80} height={a.h + 80}>
          {maskBody("colour")}
        </mask>
        {lineFirst && (
          <mask id={`l${uid}`} maskUnits="userSpaceOnUse" x={-40} y={-40} width={a.w + 80} height={a.h + 80}>
            {maskBody("line")}
          </mask>
        )}
      </defs>
      {near && <image href={a.src} width={a.w} height={a.h} mask={`url(#c${uid})`} />}
      {near && lineFirst && <image href={a.line} width={a.w} height={a.h} mask={`url(#l${uid})`} />}
    </svg>
  );
});
