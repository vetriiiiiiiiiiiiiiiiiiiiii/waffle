"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import rough from "roughjs";
import { hashString, roundPath } from "@/lib/random";

export type RoughShape = "rect" | "ellipse" | "label" | "line" | "circle";

type Props = {
  shape?: RoughShape;
  fill?: string;
  fillStyle?: "zigzag" | "hachure" | "cross-hatch" | "solid" | "dots" | "zigzag-line";
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  hachureGap?: number;
  fillWeight?: number;
  hachureAngle?: number;
  /** stable seed so the same element always gets the same wobble */
  seedKey?: string;
  /** offset fill from the line, like colouring in a hurry */
  fillOffset?: [number, number];
  inset?: number;
  className?: string;
};

type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };

/**
 * Draws a rough.js outline (and optional crayon fill) that stretches to its parent.
 * Parent must be position: relative. Purely decorative, so aria-hidden.
 */
export function RoughFrame({
  shape = "rect",
  fill,
  fillStyle = "zigzag",
  stroke = "#26211D",
  strokeWidth = 1.8,
  roughness = 1.5,
  bowing = 1,
  hachureGap = 7,
  fillWeight = 2.2,
  hachureAngle = -41,
  seedKey = "frame",
  fillOffset = [4, 3],
  inset = 3,
  className = "",
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg?.parentElement) return;
    const parent = svg.parentElement;
    const measure = () => {
      // offset size = layout box before transforms (rotated cards would inflate a bounding rect)
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      setSize((s) => (s && Math.abs(s.w - w) < 2 && Math.abs(s.h - h) < 2 ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const paths = useMemo(() => {
    if (!size) return { fill: [] as PathInfo[], line: [] as PathInfo[] };
    const gen = rough.generator();
    const seed = (hashString(seedKey) % 2 ** 31) + 1;
    const { w, h } = size;
    const i = inset;
    const lineOpts = { seed, roughness, bowing, stroke, strokeWidth, disableMultiStroke: false };
    const fillOpts = {
      seed: seed + 1,
      roughness: roughness + 0.4,
      bowing,
      stroke: "none",
      fill,
      fillStyle,
      hachureGap,
      fillWeight,
      hachureAngle,
    };
    const make = (o: object) => {
      switch (shape) {
        case "ellipse":
          return gen.ellipse(w / 2, h / 2, w - i * 2, h - i * 2, o);
        case "circle":
          return gen.circle(w / 2, h / 2, Math.min(w, h) - i * 2, o);
        case "line":
          return gen.line(i, h / 2, w - i, h / 2, o);
        case "label": {
          const r = Math.min(h / 2.4, 18);
          const pts: [number, number][] = [
            [i + r, i], [w - i - r, i], [w - i, i + r], [w - i, h - i - r],
            [w - i - r, h - i], [i + r, h - i], [i, h - i - r], [i, i + r],
          ];
          return gen.polygon(pts, o);
        }
        default:
          // overshooting corners: lines extend a few px past each corner
          return gen.rectangle(i, i, w - i * 2, h - i * 2, o);
      }
    };
    const fillPaths = fill ? (gen.toPaths(make(fillOpts)) as PathInfo[]) : [];
    const linePaths = gen.toPaths(make(lineOpts)) as PathInfo[];
    return { fill: fillPaths, line: linePaths };
  }, [size, shape, fill, fillStyle, stroke, strokeWidth, roughness, bowing, hachureGap, fillWeight, hachureAngle, seedKey, inset]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      width={size?.w ?? 0}
      height={size?.h ?? 0}
    >
      <g transform={`translate(${fillOffset[0]} ${fillOffset[1]})`}>
        {paths.fill.map((p, k) => (
          <path key={k} d={roundPath(p.d)} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? "none"} strokeLinecap="round" />
        ))}
      </g>
      {paths.line.map((p, k) => (
        <path key={k} d={roundPath(p.d)} stroke={p.stroke} strokeWidth={p.strokeWidth} fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}
