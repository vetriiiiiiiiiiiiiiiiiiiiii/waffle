"use client";
import { useMemo, useRef } from "react";
import { useNearViewport } from "@/lib/motion";
import rough from "roughjs";
import { hashString, roundPath } from "@/lib/random";

type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };
export type DoodleKind = "sun" | "pip" | "star" | "moon" | "house" | "cat" | "heart" | "flower";

/**
 * Placeholder customer drawings: crayon doodles drawn with rough.js.
 * Swap for real uploads (see README) — the frame and magnets stay.
 */
export function KidDoodle({ kind, seedKey, title }: { kind: DoodleKind; seedKey: string; title: string }) {
  // drawn on the client just before it scrolls into view: keeps hundreds of rough paths out of the HTML
  const ref = useRef<SVGSVGElement>(null);
  const near = useNearViewport(ref);
  const paths = useMemo(() => (near ? drawDoodle(kind, seedKey) : []), [near, kind, seedKey]);
  return (
    <svg ref={ref} viewBox="0 0 200 190" className="h-auto w-full" role="img" aria-label={title}>
      {paths.map((p, k) => (
        <path
          key={k}
          d={roundPath(p.d)}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={p.stroke !== "#26211D" && p.fill === undefined ? "translate(3 2)" : undefined}
        />
      ))}
    </svg>
  );
}

function drawDoodle(kind: DoodleKind, seedKey: string): PathInfo[] {
  const g = rough.generator();
  const seed = (hashString(seedKey) % 100000) + 1;
  const crayon = (c: string, extra: object = {}) => ({ seed, stroke: "#26211D", strokeWidth: 2.2, roughness: 2.2, bowing: 2, fill: c, fillStyle: "zigzag", hachureGap: 5, fillWeight: 2.6, ...extra });
  const line = (c = "#26211D", w = 2.4) => ({ seed, stroke: c, strokeWidth: w, roughness: 2.2, bowing: 2 });
  const d: ReturnType<typeof g.line>[] = [];
  switch (kind) {
    case "sun":
      d.push(g.circle(100, 90, 90, crayon("#E9B562")));
      for (const v of [70, 100, 130]) {
        d.push(g.line(v, 50, v, 130, line("#8A5626", 2)));
        d.push(g.line(60, v - 10, 140, v - 10, line("#8A5626", 2)));
      }
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        d.push(g.line(100 + Math.cos(a) * 56, 90 + Math.sin(a) * 56, 100 + Math.cos(a) * 76, 90 + Math.sin(a) * 76, line("#F6D776", 4)));
      }
      d.push(g.line(10, 175, 190, 170, line("#4E9A6A", 3)));
      break;
    case "pip":
      d.push(g.rectangle(62, 50, 76, 76, crayon("#E9B562")));
      d.push(g.line(87, 52, 87, 124, line("#8A5626", 1.6)), g.line(112, 52, 112, 124, line("#8A5626", 1.6)), g.line(64, 76, 136, 76, line("#8A5626", 1.6)), g.line(64, 100, 136, 100, line("#8A5626", 1.6)));
      d.push(g.circle(88, 86, 4, crayon("#26211D", { fillStyle: "solid" })), g.circle(112, 86, 4, crayon("#26211D", { fillStyle: "solid" })));
      d.push(g.arc(100, 98, 24, 14, 0.3, Math.PI - 0.3, false, line()));
      d.push(g.line(62, 80, 36, 50, line()), g.line(138, 80, 160, 60, line()), g.line(82, 126, 76, 162, line()), g.line(118, 126, 124, 162, line()));
      d.push(g.rectangle(156, 30, 10, 34, crayon("#F4B6C2")));
      d.push(g.line(20, 172, 180, 168, line("#B9D4F1", 4)));
      break;
    case "star":
      d.push(g.polygon([[100, 20], [118, 70], [172, 72], [128, 104], [146, 158], [100, 126], [54, 158], [72, 104], [28, 72], [82, 70]], crayon("#F6D776")));
      d.push(g.circle(40, 150, 18, crayon("#F4B6C2")), g.circle(166, 30, 14, crayon("#D3C4EE")));
      break;
    case "moon":
      d.push(g.circle(100, 96, 130, crayon("#E9B562")));
      for (const v of [60, 85, 110, 135]) d.push(g.line(v, 40, v, 152, line("#8A5626", 1.8)), g.line(44, v - 4, 156, v - 4, line("#8A5626", 1.8)));
      d.push(g.arc(82, 98, 18, 10, 0.2, Math.PI - 0.2, false, line()), g.arc(118, 98, 18, 10, 0.2, Math.PI - 0.2, false, line()));
      d.push(g.line(150, 26, 166, 26, line()), g.line(166, 26, 150, 42, line()), g.line(150, 42, 166, 42, line()));
      break;
    case "house":
      d.push(g.rectangle(48, 86, 104, 84, crayon("#D3C4EE")));
      d.push(g.polygon([[38, 90], [100, 32], [162, 90]], crayon("#F4B6C2")));
      d.push(g.rectangle(88, 126, 26, 44, crayon("#B9D4F1")), g.rectangle(60, 100, 22, 20, crayon("#E9B562")));
      d.push(g.circle(170, 30, 32, crayon("#E9B562")));
      d.push(g.line(8, 172, 192, 172, line("#4E9A6A", 3)));
      break;
    case "cat":
      d.push(g.ellipse(100, 120, 110, 80, crayon("#D3C4EE")));
      d.push(g.circle(100, 70, 64, crayon("#D3C4EE")));
      d.push(g.polygon([[74, 50], [80, 20], [94, 42]], crayon("#D3C4EE")), g.polygon([[106, 42], [120, 20], [126, 50]], crayon("#D3C4EE")));
      d.push(g.circle(88, 68, 6, crayon("#26211D", { fillStyle: "solid" })), g.circle(112, 68, 6, crayon("#26211D", { fillStyle: "solid" })));
      d.push(g.rectangle(130, 140, 50, 30, crayon("#E9B562")));
      d.push(g.curve([[150, 118], [175, 100], [180, 70]], line()));
      break;
    case "heart":
      d.push(g.path("M100 160 C 30 110, 30 50, 70 44 C 90 42, 100 60, 100 70 C 100 60, 110 42, 130 44 C 170 50, 170 110, 100 160 Z", crayon("#F4B6C2")));
      d.push(g.line(30, 30, 50, 50, line("#C9506D", 3)), g.line(170, 30, 150, 50, line("#C9506D", 3)));
      break;
    default:
      d.push(g.line(100, 170, 100, 90, line("#4E9A6A", 4)));
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        d.push(g.circle(100 + Math.cos(a) * 28, 70 + Math.sin(a) * 28, 34, crayon(k % 2 ? "#F4B6C2" : "#D3C4EE")));
      }
      d.push(g.circle(100, 70, 26, crayon("#F6D776")));
  }
  return d.flatMap((x) => g.toPaths(x) as PathInfo[]);
}
