"use client";
import { getStroke } from "perfect-freehand";
import { useEffect, useRef, useState } from "react";
import { RoughButton } from "@/components/draw/RoughButton";
import { RoughFrame } from "@/components/draw/RoughFrame";

const BRUSHES = [
  { name: "Pencil", colour: "#26211D", size: 5 },
  { name: "Butter", colour: "#F6D776", size: 14 },
  { name: "Strawberry", colour: "#F4B6C2", size: 14 },
  { name: "Mint", colour: "#BFE3D0", size: 14 },
  { name: "Sky", colour: "#B9D4F1", size: 14 },
  { name: "Lilac", colour: "#D3C4EE", size: 14 },
];

type Stroke = { pts: number[][]; colour: string; size: number };

function toPath(points: number[][]) {
  if (!points.length) return "";
  const d = points.reduce<(string | number)[]>(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...points[0], "Q"],
  );
  return d.join(" ") + " Z";
}

/**
 * A Blank Page: draw your own fortune. perfect-freehand strokes with pastel crayon
 * brushes (a crayon-tooth filter knocks paper gaps into the wax).
 */
export function DrawCanvas({ onSubmit }: { onSubmit: (dataUrl: string) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [brush, setBrush] = useState(BRUSHES[0]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const W = 600;
  const H = 420;

  const pt = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H, e.pressure || 0.5];
  };

  useEffect(() => {
    const prevent = (e: TouchEvent) => e.preventDefault();
    const svg = svgRef.current;
    svg?.addEventListener("touchmove", prevent, { passive: false });
    return () => svg?.removeEventListener("touchmove", prevent);
  }, []);

  const exportPng = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    await img.decode();
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#FFFDF7";
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    onSubmit(c.toDataURL("image/webp", 0.7));
  };

  const all = current ? [...strokes, current] : strokes;

  return (
    <div>
      <div className="relative bg-[#FFFDF7]">
        <RoughFrame seedKey="draw-canvas" strokeWidth={1.6} inset={1} />
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${W} ${H}`}
          className="relative block h-auto w-full touch-none"
          role="img"
          aria-label="Drawing area for your own fortune. Use a mouse, finger or stylus."
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture(e.pointerId);
            setCurrent({ pts: [pt(e)], colour: brush.colour, size: brush.size });
          }}
          onPointerMove={(e) => {
            if (!current) return;
            const p = pt(e);
            setCurrent((c) => (c ? { ...c, pts: [...c.pts, p] } : c));
          }}
          onPointerUp={() => {
            if (current) setStrokes((s) => [...s, current]);
            setCurrent(null);
          }}
        >
          <defs>
            <filter id="dc-tooth">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" seed="3" result="t" />
              <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.5" result="m" />
              <feComposite in="SourceGraphic" in2="m" operator="in" />
            </filter>
          </defs>
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1="0" x2={W} y1={32 + i * 30} y2={32 + i * 30} stroke="#B9D4F1" strokeWidth="1" />
          ))}
          <line x1="48" x2="48" y1="0" y2={H} stroke="#E58FA3" strokeWidth="1.5" />
          {all.map((s, i) => (
            <path
              key={i}
              d={toPath(getStroke(s.pts, { size: s.size, thinning: s.colour === "#26211D" ? 0.6 : 0.2, smoothing: 0.5, streamline: 0.45 }))}
              fill={s.colour}
              filter={s.colour === "#26211D" ? undefined : "url(#dc-tooth)"}
            />
          ))}
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Crayon">
        {BRUSHES.map((b) => (
          <button
            key={b.name}
            type="button"
            role="radio"
            aria-checked={brush.name === b.name}
            aria-label={`${b.name} crayon`}
            onClick={() => setBrush(b)}
            className={`h-11 w-11 rounded-full border-2 border-pencil transition-transform [transition-timing-function:steps(3,end)] ${brush.name === b.name ? "-translate-y-1 scale-110" : ""}`}
            style={{ background: b.colour }}
          />
        ))}
        <RoughButton size="sm" fill="#FFFDF7" fillStyle="hachure" onClick={() => setStrokes((s) => s.slice(0, -1))} seedKey="undo">
          Undo
        </RoughButton>
        <RoughButton size="sm" fill="#FFFDF7" fillStyle="hachure" onClick={() => setStrokes([])} seedKey="clear">
          Rub it out
        </RoughButton>
      </div>
      <RoughButton className="mt-5" fill="#F6D776" onClick={exportPng} disabled={!strokes.length} seedKey="send-page">
        Tape it into my Storybook
      </RoughButton>
    </div>
  );
}
