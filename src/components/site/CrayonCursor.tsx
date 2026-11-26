"use client";
import { useEffect, useRef } from "react";
import { PASTELS } from "@/lib/random";

/**
 * A small crayon that leaves a faint, fading pastel trail.
 * Desktop pointers only; never for touch or reduced-motion readers.
 */
export function CrayonCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crayonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const crayon = crayonRef.current;
    if (!fine || reduce || !canvas || !crayon) return;
    document.documentElement.classList.add("has-crayon-cursor");
    crayon.style.display = "block";
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);
    type Pt = { x: number; y: number; t: number };
    const pts: Pt[] = [];
    let colour = 0;
    let last = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      crayon.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const now = performance.now();
      pts.push({ x: e.clientX, y: e.clientY, t: now });
      if (now - last > 1600) colour = (colour + 1) % PASTELS.length;
      last = now;
    };
    addEventListener("pointermove", move, { passive: true });
    let raf = 0;
    const LIFE = 650;
    const draw = () => {
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = PASTELS[colour];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const life = 1 - (now - b.t) / LIFE;
        ctx.globalAlpha = Math.max(0, life) * 0.55;
        ctx.lineWidth = 2 + life * 4;
        ctx.beginPath();
        // crayon wobble: tiny jitter so it never looks like a vector line
        ctx.moveTo(a.x + ((i * 7) % 3) - 1, a.y + ((i * 5) % 3) - 1);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("resize", resize);
      document.documentElement.classList.remove("has-crayon-cursor");
    };
  }, []);
  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] h-full w-full" />
      <div ref={crayonRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[71] hidden" style={{ willChange: "transform" }}>
        <svg width="18" height="46" viewBox="0 0 24 64" style={{ transform: "translate(-9px, -2px) rotate(-28deg)", transformOrigin: "9px 2px" }}>
          <path d="M6 18 L12 3 L18 18 Z" fill="#F4B6C2" />
          <rect x="6" y="18" width="12" height="42" rx="2" fill="#F4B6C2" />
          <path d="M6 18 L12 2.5 L18 18 M6 18 L6 60 L18 60.5 L18 18 M6 24 L18 24 M6 54 L18 54.5" fill="none" stroke="#26211D" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}
