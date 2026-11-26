"use client";
import { useMemo, useRef } from "react";
import { useNearViewport } from "@/lib/motion";
import rough from "roughjs";
import { hashString, seeded, roundPath } from "@/lib/random";

type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };
type Drawable = ReturnType<ReturnType<typeof rough.generator>["rectangle"]>;

/**
 * A chapter, drawn: a rough rectangular waffle with its toppings scribbled on.
 * Placeholder art in the house style until the final chapter illustrations arrive
 * (see README → art list: /public/art/waffles/chapter-1..6.webp).
 */
export function ChapterWaffle({ id, className = "", title }: { id: string; className?: string; title: string }) {
  // drawn on the client near the viewport, so the HTML stays light
  const ref = useRef<SVGSVGElement>(null);
  const near = useNearViewport(ref);
  const paths = useMemo(() => (near ? drawChapter(id) : []), [near, id]);
  return (
    <svg ref={ref} viewBox="0 0 300 380" className={className} role="img" aria-label={title || undefined} aria-hidden={title ? undefined : true}>
      {paths.map((g, i) => (
        <g key={i} transform={g.off ? "translate(5 4)" : undefined}>
          {g.p.map((p, j) => (
            <path key={j} d={roundPath(p.d)} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? "none"} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function drawChapter(id: string) {
  const gen = rough.generator();
  const seed = (hashString(id) % 100000) + 1;
  const r = seeded(id);
  const shapes: { d: Drawable; offset?: boolean }[] = [];
  const x0 = 40;
  const y0 = 30;
  const ww = 220;
  const hh = 320;
  const line = { stroke: "#26211D", strokeWidth: 2, roughness: 1.4, bowing: 1, seed };

  // waffle body: toast crayon, slightly off the line
  shapes.push({ d: gen.rectangle(x0, y0, ww, hh, { ...line, stroke: "none", fill: "#E9B562", fillStyle: "zigzag", hachureGap: 5, fillWeight: 3, seed: seed + 1 }), offset: true });
  shapes.push({ d: gen.rectangle(x0, y0, ww, hh, line) });
  // pockets: 4 × 5 grid, each pocket its own wobbly square
  for (let c = 0; c < 4; c++)
    for (let rr = 0; rr < 5; rr++) {
      const px = x0 + 16 + c * 50;
      const py = y0 + 16 + rr * 60;
      shapes.push({ d: gen.rectangle(px, py, 36, 44, { ...line, strokeWidth: 1.3, roughness: 1.1, fill: "#C98B3E", fillStyle: "hachure", hachureGap: 4, fillWeight: 1.4, seed: seed + c * 7 + rr }) });
    }

  const drizzle = (colour: string, k: number, w = 5) => {
    const pts: [number, number][] = [];
    const rows = 7;
    for (let i = 0; i <= rows; i++) pts.push([x0 + (i % 2 ? ww - 10 : 14) + r() * 10, y0 + 22 + i * (hh - 40) / rows + k * 9]);
    shapes.push({ d: gen.curve(pts, { stroke: colour, strokeWidth: w, roughness: 1.2, seed: seed + 40 + k }) });
  };
  const dot = (cx: number, cy: number, d: number, fill: string, style: "solid" | "hachure" | "zigzag" = "zigzag") =>
    shapes.push({ d: gen.circle(cx, cy, d, { ...line, strokeWidth: 1.6, fill, fillStyle: style, hachureGap: 3, fillWeight: 2, seed: seed + Math.round(cx + cy) }) });
  const blob = (cx: number, cy: number, s: number, fill: string) =>
    shapes.push({
      d: gen.polygon(
        Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2;
          const rad = s * (0.75 + r() * 0.4);
          return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as [number, number];
        }),
        { ...line, strokeWidth: 1.6, fill, fillStyle: "solid", seed: seed + Math.round(cx) },
      ),
    });

  switch (id) {
    case "ch1":
      drizzle("#A0612A", 0, 6);
      blob(150, 180, 28, "#F6D776");
      for (let i = 0; i < 14; i++) dot(x0 + 20 + r() * 180, y0 + 20 + r() * 280, 4, "#FFFDF7", "solid");
      break;
    case "ch2":
      drizzle("#3B2418", 0, 6);
      drizzle("#7A4A2E", 1, 5);
      drizzle("#FFF7E8", 2, 4);
      break;
    case "ch3":
      drizzle("#C9506D", 0, 5);
      for (const [cx, cy] of [[95, 100], [190, 160], [110, 250], [185, 300]]) {
        dot(cx, cy, 30, "#E5576F");
        shapes.push({ d: gen.line(cx - 6, cy - 16, cx + 6, cy - 18, { stroke: "#4E9A6A", strokeWidth: 3, seed: seed + cx }) });
      }
      blob(150, 205, 22, "#FFFDF7");
      blob(90, 170, 14, "#FFFDF7");
      break;
    case "ch4":
      for (let i = 0; i < 9; i++) {
        const cx = x0 + 30 + r() * 160;
        const cy = y0 + 30 + r() * 260;
        shapes.push({ d: gen.rectangle(cx, cy, 22, 22, { ...line, strokeWidth: 1.5, fill: "#F2A93B", fillStyle: "zigzag", hachureGap: 3, seed: seed + i }) });
      }
      drizzle("#F6D776", 0, 7);
      break;
    case "ch5":
      for (let i = 0; i < 6; i++) {
        const cx = x0 + 40 + r() * 140;
        const cy = y0 + 40 + r() * 240;
        shapes.push({ d: gen.polygon([[cx, cy], [cx + 34, cy + 8], [cx + 8, cy + 30]], { ...line, strokeWidth: 1.6, fill: "#F6D776", fillStyle: "solid", seed: seed + i }) });
      }
      for (let i = 0; i < 12; i++) {
        const cx = x0 + 20 + r() * 180;
        const cy = y0 + 20 + r() * 280;
        shapes.push({ d: gen.ellipse(cx, cy, 12, 6, { stroke: "#3F8A5A", strokeWidth: 1.4, fill: "#7CC79A", fillStyle: "solid", seed: seed + 60 + i }) });
      }
      for (let i = 0; i < 16; i++) dot(x0 + 20 + r() * 180, y0 + 20 + r() * 280, 4, "#C9506D", "solid");
      break;
    default:
      drizzle("#FFF7E8", 0, 7);
      for (let i = 0; i < 26; i++) dot(x0 + 20 + r() * 180, y0 + 20 + r() * 280, 5 + r() * 5, "#B97A3A", "hachure");
      break;
  }

  return shapes.map((s) => ({ off: !!s.offset, p: gen.toPaths(s.d) as PathInfo[] }));
}
