import { KidDoodle, type DoodleKind } from "./KidDoodle";
import { seeded } from "@/lib/random";

export type FridgeDrawing = { id: string; by: string; title: string; kind: string; tags: string[]; magnet: string; src?: string };

const MAGNET: Record<string, string> = {
  strawberry: "#F4B6C2",
  sky: "#B9D4F1",
  butter: "#F6D776",
  lilac: "#D3C4EE",
  mint: "#BFE3D0",
  toast: "#E9B562",
};

/** One drawing on the fridge: slightly crooked, held by a magnet, lifts like a paper flap. */
export function FridgeItem({ d, stamp = true }: { d: FridgeDrawing; stamp?: boolean }) {
  const r = seeded(d.id);
  const tilt = (r() - 0.5) * 9;
  return (
    <figure
      className="group relative bg-[#FFFDF7] p-3 pb-2 [transform:rotate(var(--t))] transition-transform duration-300 [transform-origin:50%_6%] [transition-timing-function:steps(4,end)] hover:[transform:rotate(var(--t))_perspective(700px)_rotateX(14deg)_translateY(-6px)] focus-within:[transform:rotate(var(--t))_perspective(700px)_rotateX(14deg)_translateY(-6px)]"
      style={{ ["--t" as string]: `${tilt}deg`, outline: "1.6px solid #26211D", outlineOffset: "-1px", borderRadius: "3px 8px 4px 9px / 9px 4px 8px 3px" }}
    >
      <svg className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2" width="30" height="24" viewBox="0 0 30 24" aria-hidden="true">
        <ellipse cx="15" cy="12" rx="13" ry="10" fill={MAGNET[d.magnet] ?? "#F4B6C2"} />
        <path d="M3 12 C 3 4, 12 1.6, 16 2 C 24 2.4, 28 7, 27.6 12.6 C 27 19, 20 22.4, 14 22 C 7 21.4, 2.4 17, 3.4 10.6" fill="none" stroke="#26211D" strokeWidth="1.6" />
        <path d="M9 8 C 11 6, 14 5.6, 16 6" stroke="#fff" strokeWidth="2" fill="none" opacity=".8" strokeLinecap="round" />
      </svg>
      {d.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={d.src} alt={`${d.title}, drawn by ${d.by}`} className="h-auto w-full" loading="lazy" />
      ) : (
        <KidDoodle kind={d.kind as DoodleKind} seedKey={d.id} title={`${d.title}, drawn by ${d.by}`} />
      )}
      <figcaption className="font-hand mt-1 text-base uppercase leading-tight">
        {d.title}
        <span className="font-type block text-xs normal-case">by {d.by}</span>
      </figcaption>
      {stamp && d.tags.includes("staff") && (
        <span
          className="font-hand absolute -right-3 top-8 rotate-[-14deg] rounded-full border-2 border-[#C9506D] px-2 py-0.5 text-xs uppercase text-[#B23D5B]"
          style={{ background: "rgba(244,182,194,.35)" }}
        >
          Day stamp ✓
        </span>
      )}
      {d.tags.includes("golden") && (
        <span className="font-hand absolute -left-2 top-8 rotate-[10deg] bg-butter px-2 text-xs uppercase" aria-label="Golden page">
          golden!
        </span>
      )}
    </figure>
  );
}

export function FridgeWall({ items, className = "" }: { items: FridgeDrawing[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {items.map((d) => (
        <li key={d.id}>
          <FridgeItem d={d} />
        </li>
      ))}
    </ul>
  );
}
