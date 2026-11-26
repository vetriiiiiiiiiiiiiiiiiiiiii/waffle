import { forwardRef, type CSSProperties } from "react";
import { seeded } from "@/lib/random";
import { RoughFrame } from "./RoughFrame";
import { Star, Sun, Heart } from "./Doodles";

/** A jagged torn edge, as a CSS clip-path. */
export function tornClip(key: string, edge: "top" | "bottom" = "top", teeth = 22, depth = 2.2) {
  const r = seeded(key);
  const pts: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = (i / teeth) * 100;
    const y = r() * depth;
    pts.push(`${x.toFixed(2)}% ${edge === "top" ? y.toFixed(2) : (100 - y).toFixed(2)}%`);
  }
  return edge === "top" ? `polygon(${pts.join(",")}, 100% 100%, 0 100%)` : `polygon(0 0, 100% 0, ${pts.reverse().join(",")})`;
}

type Props = {
  page: number;
  fortune: string;
  code: string;
  golden?: boolean;
  doodle?: "sun" | "star" | "heart";
  className?: string;
  style?: CSSProperties;
  /** larger type for share images */
  big?: boolean;
};

/** Today's Page: page number, a Pip-ish doodle, one line for your day, a code. */
export const TodaysPageCard = forwardRef<HTMLDivElement, Props>(function TodaysPageCard(
  { page, fortune, code, golden, doodle = "sun", className = "", style, big },
  ref,
) {
  const D = doodle === "star" ? Star : doodle === "heart" ? Heart : Sun;
  return (
    <div
      ref={ref}
      className={`ruled relative flex flex-col pb-5 pl-5 pr-5 pt-7 ${className}`}
      style={{
        backgroundColor: golden ? "#F7DC93" : "#FFFDF7",
        backgroundImage: golden
          ? "repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.9rem - 1px), rgba(233,181,98,.6) calc(1.9rem - 1px), rgba(233,181,98,.6) 1.9rem)"
          : "repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.9rem - 1px), var(--rule) calc(1.9rem - 1px), var(--rule) 1.9rem)",
        backgroundPosition: "0 3.2rem",
        clipPath: tornClip(`card-${page}-${code}`),
        ...style,
      }}
    >
      <RoughFrame seedKey={`tp-${code}`} strokeWidth={1.4} inset={1} roughness={1.2} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className={`font-hand uppercase leading-none ${big ? "text-6xl" : "text-[1.45rem] whitespace-nowrap"}`}>{"Today's page"}</p>
          <p className={`font-type mt-1 uppercase text-[var(--pink-pen-text)] ${big ? "text-2xl" : "text-xs"}`}>
            {golden ? "Golden page" : "Page no."} {String(page).padStart(4, "0")}
          </p>
        </div>
        <D className={big ? "h-24 w-24" : "h-10 w-10 shrink-0"} />
      </div>
      <p className={`font-hand relative mt-5 flex-1 uppercase leading-[1.9rem] text-blue-pen ${big ? "text-5xl !leading-[1.25]" : "text-[1.15rem]"}`}>
        {fortune}
      </p>
      <div className={`relative mt-4 self-start ${big ? "px-8 py-4" : "px-4 py-1.5"}`}>
        <RoughFrame shape="label" fill={golden ? "#E9B562" : "#BFE3D0"} fillStyle="hachure" seedKey={`code-${code}`} strokeWidth={1.3} hachureGap={4} />
        <span className={`font-type relative whitespace-nowrap ${big ? "text-3xl" : "text-[0.8rem]"}`}>CODE: {code}</span>
      </div>
    </div>
  );
});
