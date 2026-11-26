"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import rough from "roughjs";
import { art } from "@/lib/art";
import { hashString, roundPath } from "@/lib/random";
import { useNearViewport } from "@/lib/motion";
import { zigzag, type Box } from "./ArtReveal";
import { Boil } from "./Boil";

type Region = {
  id: string;
  label: string;
  colour: string;
  /** polygons in storefront space (1275×879) */
  polys: [number, number][][];
  box: Box;
};

const awningStripes = Array.from({ length: 7 }, (_, k) => {
  const x = 128 + k * 150;
  return [
    [x, 332],
    [x + 74, 330],
    [x + 74, 392],
    [x + 60, 412],
    [x + 37, 420],
    [x + 14, 412],
    [x, 395],
  ] as [number, number][];
});

export const REGIONS: Region[] = [
  { id: "awning", label: "the awning", colour: "#F4B6C2", polys: awningStripes, box: [120, 320, 1060, 105] },
  { id: "sign", label: "the sign", colour: "#FFF3C7", polys: [[[306, 162], [994, 160], [996, 298], [304, 300]]], box: [300, 155, 700, 150] },
  {
    id: "wall",
    label: "a wall panel",
    colour: "#F6D776",
    polys: [[[112, 122], [798, 120], [798, 330], [128, 332], [128, 420], [165, 425], [165, 740], [728, 740], [728, 425], [798, 420], [798, 830], [112, 830]]],
    box: [105, 115, 700, 720],
  },
  { id: "window", label: "the fridge-wall window", colour: "#B9D4F1", polys: [[[166, 434], [718, 434], [718, 736], [166, 736]]], box: [160, 430, 565, 310] },
  { id: "door", label: "the door", colour: "#D3C4EE", polys: [[[802, 418], [1028, 418], [1028, 828], [802, 828]]], box: [798, 412, 236, 420] },
  {
    id: "plant",
    label: "the plant",
    colour: "#BFE3D0",
    polys: [
      [[1080, 768], [1140, 768], [1132, 828], [1088, 828]],
      [[1040, 700], [1075, 662], [1100, 700], [1125, 655], [1160, 700], [1150, 760], [1060, 760]],
    ],
    box: [1035, 650, 130, 180],
  },
  { id: "aboard", label: "the Today's Page board", colour: "#BFE3D0", polys: [[[32, 578], [152, 578], [158, 828], [22, 828]]], box: [20, 572, 140, 260] },
  { id: "roof", label: "the roof ledge", colour: "#D3C4EE", polys: [[[96, 96], [1204, 98], [1204, 120], [96, 118]]], box: [92, 92, 1116, 32] },
];

type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };

/**
 * The Unfinished Store as a colouring book. Tap (or press Enter on) any part to
 * crayon it in. Colour lands a few pixels off the line, because it should.
 */
export function ColourInScene({
  initial = [],
  onColour,
  className = "",
}: {
  initial?: string[];
  onColour?: (id: string, all: string[]) => void;
  className?: string;
}) {
  const a = art("store/storefront");
  const [done, setDone] = useState<string[]>(initial);
  const doneRef = useRef<string[]>(initial);
  const svgRef = useRef<SVGSVGElement>(null);

  const near = useNearViewport(svgRef);
  const nearFill = near;
  const fills = useMemo(() => {
    if (!nearFill) return null;
    const gen = rough.generator();
    const out: Record<string, PathInfo[]> = {};
    for (const r of REGIONS) {
      const seed = (hashString(r.id) % 10000) + 1;
      out[r.id] = r.polys.flatMap(
        (p, k) =>
          gen.toPaths(
            gen.polygon(p, {
              seed: seed + k,
              stroke: "none",
              fill: r.colour,
              fillStyle: "zigzag",
              hachureGap: 5.5,
              fillWeight: 4.2,
              hachureAngle: -38 + k * 9,
              roughness: 2,
            }),
          ) as PathInfo[],
      );
    }
    return out;
  }, [nearFill]);

  const colour = (id: string) => {
    if (doneRef.current.includes(id)) return;
    const next = [...doneRef.current, id];
    doneRef.current = next;
    setDone(next);
    onColour?.(id, next);
    const svg = svgRef.current;
    if (!svg) return;
    const path = svg.querySelector(`#ci-mask-${id} path`);
    if (!path) return;
    if (!document.documentElement.classList.contains("js-motion")) {
      (path as SVGPathElement).style.strokeDashoffset = "0";
      return;
    }
    // crayon fill: the zig-zag mask draws on in 14 stepped frames (Web Animations, no library)
    path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, easing: "steps(14, end)", fill: "forwards" });
  };

  useEffect(() => {
    // regions coloured before (by the community or a past visit) show straight away
    const svg = svgRef.current;
    if (!svg) return;
    initial.forEach((id) => {
      const p = svg.querySelector<SVGPathElement>(`#ci-mask-${id} path`);
      if (p) p.style.strokeDashoffset = "0";
    });
  }, [initial]);

  return (
    <div className={className}>
      <Boil>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${a.w} ${a.h}`}
          className="h-auto w-full touch-manipulation"
          role="group"
          aria-label="The Unfinished Store, a line drawing you can colour in"
        >
          <defs>
            {REGIONS.map((r) => {
              const z = zigzag(r.box, 6, "h", `ci-${r.id}`);
              return (
                <mask key={r.id} id={`ci-mask-${r.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={a.w} height={a.h}>
                  <path
                    d={z.d}
                    stroke="#fff"
                    strokeWidth={z.width}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    style={{ strokeDashoffset: 1 }}
                  />
                </mask>
              );
            })}
          </defs>
          {/* crayon fills, 4px off the line */}
          <g transform="translate(4 3)">
            {REGIONS.map((r) => (
              <g key={r.id} mask={`url(#ci-mask-${r.id})`}>
                {fills?.[r.id].map((p, k) => (
                  <path key={k} d={roundPath(p.d)} stroke={p.stroke} strokeWidth={p.strokeWidth} fill="none" strokeLinecap="round" opacity="0.92" />
                ))}
              </g>
            ))}
          </g>
          {/* the line drawing */}
          {near && <image href={a.line} width={a.w} height={a.h} style={{ pointerEvents: "none" }} />}
          {/* tap targets (big wall first so smaller parts sit on top) */}
          {[...REGIONS].sort((x, y) => (x.id === "wall" ? -1 : y.id === "wall" ? 1 : 0)).map((r) => {
            const isDone = done.includes(r.id);
            return (
              <g
                key={r.id}
                role="button"
                tabIndex={0}
                aria-label={isDone ? `${r.label}, coloured in` : `Colour in ${r.label}`}
                aria-pressed={isDone}
                className="cursor-pointer outline-none [&:focus-visible_path]:stroke-[#2F5FA8] [&:focus-visible_path]:[stroke-dasharray:10_7] [&:focus-visible_path]:[stroke-width:5]"
                onClick={() => colour(r.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    colour(r.id);
                  }
                }}
              >
                {r.polys.map((p, k) => (
                  <path key={k} d={"M" + p.map((pt) => pt.join(",")).join(" L") + "Z"} fill="transparent" stroke="transparent" pointerEvents="all" />
                ))}
              </g>
            );
          })}
        </svg>
      </Boil>
    </div>
  );
}
