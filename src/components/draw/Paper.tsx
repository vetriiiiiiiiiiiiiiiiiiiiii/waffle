import type { CSSProperties, ElementType, ReactNode } from "react";
import { RoughFrame } from "./RoughFrame";

const tint: Record<string, string> = {
  butter: "#F9E39F",
  strawberry: "#F8CBD4",
  mint: "#D3ECDF",
  sky: "#CFE1F5",
  lilac: "#E0D5F3",
  toast: "#F1CC8E",
  paper: "#FFFDF7",
};

/** Sticky note: crayon-tinted square, pencil outline, pin or tape, curled corner. */
export function StickyNote({
  children,
  colour = "butter",
  tilt = -1.5,
  pin = true,
  className = "",
  as: Tag = "div",
  seedKey,
  style,
}: {
  children: ReactNode;
  colour?: keyof typeof tint;
  tilt?: number;
  pin?: boolean;
  className?: string;
  as?: ElementType;
  seedKey?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={`sticky-curl relative p-6 pt-8 ${className}`}
      style={{ background: tint[colour], transform: `rotate(${tilt}deg)`, ...style }}
    >
      <RoughFrame seedKey={seedKey ?? `sticky-${colour}-${tilt}`} strokeWidth={1.4} roughness={1.2} inset={1} />
      {pin && (
        <svg className="absolute left-1/2 top-2 -translate-x-1/2" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="5" fill="#C9506D" stroke="#26211D" strokeWidth="1.4" />
          <circle cx="6.5" cy="6.4" r="1.2" fill="#fff" opacity=".7" />
        </svg>
      )}
      <div className="relative">{children}</div>
    </Tag>
  );
}

/** A notebook page: ruled sky lines, a red margin, a rough pencil edge. */
export function NotebookPage({
  children,
  className = "",
  tilt = 0,
  tape = true,
  seedKey = "notebook",
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  tape?: boolean;
  seedKey?: string;
  as?: ElementType;
  style?: CSSProperties;
}) {
  return (
    <Tag className={`ruled relative pl-16 pr-6 py-8 ${className}`} style={{ transform: `rotate(${tilt}deg)`, ...style }}>
      <RoughFrame seedKey={seedKey} strokeWidth={1.6} roughness={1.3} inset={1} />
      {tape && <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" aria-hidden="true" />}
      <div className="relative">{children}</div>
    </Tag>
  );
}

/** A scrap of paper with translucent masking tape on two corners. */
export function TapedScrap({
  children,
  className = "",
  tilt = 2,
  seedKey = "scrap",
  style,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  seedKey?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`relative bg-[#FFFDF7] p-4 ${className}`} style={{ transform: `rotate(${tilt}deg)`, ...style }}>
      <RoughFrame seedKey={seedKey} strokeWidth={1.3} roughness={1.4} inset={1} />
      <span className="tape -left-6 -top-2 rotate-[-28deg]" aria-hidden="true" />
      <span className="tape -right-6 -top-1 rotate-[24deg]" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}

/** An image taped to the page. */
export function TapedImage({
  src,
  alt,
  width,
  height,
  tilt = -2,
  className = "",
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  tilt?: number;
  className?: string;
  caption?: string;
}) {
  return (
    <figure className={`relative bg-[#FFFDF7] p-3 pb-2 ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <RoughFrame seedKey={src} strokeWidth={1.3} inset={1} />
      <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[2deg]" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="relative h-auto w-full" />
      {caption && <figcaption className="font-hand relative mt-1 text-center text-lg uppercase">{caption}</figcaption>}
    </figure>
  );
}
