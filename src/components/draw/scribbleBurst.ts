"use client";
import { PASTELS } from "@/lib/random";

/**
 * A crayon scribble burst at (x, y) in viewport coords.
 * Plain DOM + Web Animations so it costs nothing until a click happens.
 */
export function scribbleBurst(x: number, y: number, colours: readonly string[] = PASTELS) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  const size = 140;
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("aria-hidden", "true");
  Object.assign(svg.style, {
    position: "fixed",
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    pointerEvents: "none",
    zIndex: "80",
    overflow: "visible",
  });
  const c = size / 2;
  const rays = 9;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + Math.random() * 0.4;
    const r0 = 14 + Math.random() * 8;
    const r1 = 38 + Math.random() * 22;
    // tiny zig-zag along each ray: a crayon flick, not a vector line
    const pts: string[] = [];
    const steps = 4;
    for (let s = 0; s <= steps; s++) {
      const r = r0 + ((r1 - r0) * s) / steps;
      const j = (s % 2 ? 1 : -1) * 3.5;
      pts.push(`${(c + Math.cos(a) * r + Math.cos(a + Math.PI / 2) * j).toFixed(1)},${(c + Math.sin(a) * r + Math.sin(a + Math.PI / 2) * j).toFixed(1)}`);
    }
    const p = document.createElementNS(NS, "polyline");
    p.setAttribute("points", pts.join(" "));
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", colours[i % colours.length]);
    p.setAttribute("stroke-width", String(4 + Math.random() * 2));
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    p.setAttribute("pathLength", "1");
    p.style.strokeDasharray = "1";
    p.style.strokeDashoffset = "1";
    svg.appendChild(p);
    p.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0, offset: 0.45 }, { strokeDashoffset: -1 }],
      { duration: 620, easing: "steps(7, end)", fill: "forwards" },
    );
  }
  document.body.appendChild(svg);
  window.setTimeout(() => svg.remove(), 700);
}
