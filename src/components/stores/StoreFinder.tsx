"use client";
import { useMemo, useRef, useState } from "react";
import { useNearViewport } from "@/lib/motion";
import rough from "roughjs";
import stores from "@/data/stores.json";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { Boil } from "@/components/draw/Boil";
import { seeded, roundPath } from "@/lib/random";

type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };
const TILE = ["#F6D776", "#F4B6C2", "#BFE3D0", "#B9D4F1", "#D3C4EE"];

/** A map drawn on a napkin: pastel blocks, wobbly roads, a river, waffle pins. */
function NapkinMap({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const near = useNearViewport(svgRef);
  const W = 1000;
  const H = 640;
  const paths = useMemo(() => {
    if (!near) return [];
    const g = rough.generator();
    const r = seeded("map");
    const out: PathInfo[] = [];
    const push = (x: ReturnType<typeof g.line>) => out.push(...(g.toPaths(x) as PathInfo[]));
    for (let cx = 0; cx < 10; cx++)
      for (let cy = 0; cy < 6; cy++) {
        if (r() < 0.38) continue;
        const x = 18 + cx * 98 + r() * 8;
        const y = 18 + cy * 102 + r() * 8;
        push(g.rectangle(x, y, 70 + r() * 10, 72 + r() * 10, { seed: cx * 9 + cy + 1, stroke: "#26211D", strokeWidth: 1, roughness: 1.6, fill: TILE[Math.floor(r() * TILE.length)], fillStyle: "hachure", hachureGap: 7, fillWeight: 1.6 }));
      }
    push(g.curve([[-10, 520], [180, 470], [360, 560], [560, 430], [760, 500], [1010, 380]], { seed: 77, stroke: "#B9D4F1", strokeWidth: 16, roughness: 1.2 }));
    push(g.curve([[-10, 520], [180, 470], [360, 560], [560, 430], [760, 500], [1010, 380]], { seed: 78, stroke: "#2F5FA8", strokeWidth: 1.4, roughness: 1.6 }));
    for (const [a, b, c, d] of [[0, 210, 1000, 190], [0, 410, 1000, 430], [300, 0, 320, 640], [700, 0, 680, 640]])
      push(g.line(a, b, c, d, { seed: a + b + 3, stroke: "#26211D", strokeWidth: 2, roughness: 2 }));
    return out;
  }, [near]);
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Hand-drawn map of Waffle Story stores">
      {paths.map((p, k) => (
        <path key={k} d={roundPath(p.d)} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? "none"} strokeLinecap="round" />
      ))}
      <text x="30" y="600" className="font-hand" fontSize="26" fill="#2F5FA8">
        ~ the river ~
      </text>
      {stores.map((s) => {
        const x = (s.map.x / 100) * W;
        const y = (s.map.y / 100) * H;
        const on = s.id === active;
        return (
          <g
            key={s.id}
            role="button"
            tabIndex={0}
            aria-label={`${s.name}, ${s.city}`}
            aria-pressed={on}
            className="cursor-pointer"
            onClick={() => onPick(s.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(s.id))}
            transform={`translate(${x} ${y}) scale(${on ? 1.25 : 1})`}
          >
            {/* waffle-shaped pin */}
            <path d="M0 34 L-12 12 L12 12 Z" fill="#E9B562" stroke="#26211D" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="0" cy="0" r="22" fill="#E9B562" stroke="#26211D" strokeWidth="2.4" />
            {[-8, 0, 8].map((v) => (
              <g key={v}>
                <line x1={v} y1="-18" x2={v} y2="18" stroke="#8A5626" strokeWidth="1.6" />
                <line x1="-18" y1={v} x2="18" y2={v} stroke="#8A5626" strokeWidth="1.6" />
              </g>
            ))}
            {on && (
              <text y="-34" textAnchor="middle" className="font-hand" fontSize="26" fill="#B23D5B">
                {s.name.replace("Waffle Story · ", "")}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function StoreFinder() {
  const [active, setActive] = useState(stores[0].id);
  const [q, setQ] = useState("");
  const list = stores.filter((s) => `${s.name} ${s.city} ${s.street}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="relative self-start bg-[#FFFDF7] p-3 lg:sticky lg:top-6" style={{ transform: "rotate(-0.8deg)" }}>
        <RoughFrame seedKey="map-frame" strokeWidth={1.6} inset={1} />
        <span className="tape -top-3 left-10 rotate-[-6deg]" aria-hidden="true" />
        <span className="tape -top-3 right-10 rotate-[5deg]" aria-hidden="true" />
        <Boil className="relative">
          <NapkinMap
            active={active}
            onPick={(id) => {
              setActive(id);
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }}
          />
        </Boil>
        <p className="font-type relative mt-2 text-xs">Not to scale. Drawn from memory on a napkin.</p>
      </div>
      <div>
        <label className="relative block bg-[#FFFDF7] px-5 py-3">
          <RoughFrame shape="label" seedKey="store-search" strokeWidth={1.5} />
          <span className="font-hand relative text-xl uppercase">Town or street:</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="font-type relative ml-2 w-[60%] border-b-2 border-dashed border-blue-pen bg-transparent text-lg text-blue-pen outline-none"
          />
        </label>
        <ul className="mt-8 space-y-8" aria-live="polite">
          {list.map((s, k) => (
            <li key={s.id} id={s.id} className="scroll-mt-8">
              <article
                className={`relative px-6 py-6 ${s.id === active ? "bg-[#FFF8E3]" : "bg-[#FFFDF7]"}`}
                style={{ transform: `rotate(${k % 2 ? 0.8 : -0.8}deg)` }}
                onMouseEnter={() => setActive(s.id)}
              >
                <RoughFrame seedKey={`store-${s.id}`} strokeWidth={1.5} inset={1} />
                <h2 className="font-hand relative text-3xl uppercase leading-none">{s.name.replace("Waffle Story · ", "")}</h2>
                <p className="relative mt-1 text-base">
                  {s.street}, {s.city} {s.postcode}
                </p>
                <p className="font-type relative mt-1 text-sm">Open {s.hours} · {s.opened}</p>
                <div className="relative mt-4">
                  <p className="font-hand text-lg uppercase">
                    Now colouring: <span className="text-[var(--pink-pen-text)]">{s.colouring.now}</span>
                  </p>
                  <div className="relative mt-2 h-5" role="progressbar" aria-label={`${s.name} colouring progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(s.colouring.progress * 100)}>
                    <RoughFrame seedKey={`sp-o-${s.id}`} strokeWidth={1.2} inset={1} />
                    <div className="absolute inset-y-0 left-0" style={{ width: `${s.colouring.progress * 100}%` }}>
                      <RoughFrame seedKey={`sp-${s.id}`} fill={TILE[k % TILE.length]} fillStyle="zigzag" stroke="none" strokeWidth={0} inset={3} hachureGap={4} />
                    </div>
                  </div>
                  <p className="font-type mt-1 text-xs">
                    {Math.round(s.colouring.progress * 100)}% coloured{s.colouring.done.length ? ` · done: ${s.colouring.done.join(", ")}` : ""}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${s.geo.lat},${s.geo.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-hand relative mt-4 inline-block text-xl uppercase text-blue-pen underline decoration-wavy decoration-2 underline-offset-4"
                >
                  Directions →
                </a>
              </article>
            </li>
          ))}
          {!list.length && <li className="font-hand text-2xl uppercase">No store there yet. Plot twist: maybe soon.</li>}
        </ul>
      </div>
    </div>
  );
}
