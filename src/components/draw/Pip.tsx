import { art } from "@/lib/art";
import { Boil } from "./Boil";

export type PipPose = "wave" | "draw" | "sleep" | "shrug" | "bye";

const poses = {
  wave: { key: "pip/wave", alt: "Pip, a little waffle square, waving hello" },
  draw: { key: "pip/draw", alt: "Pip drawing with a blue crayon" },
  sleep: { key: "pip/moon-sleep", alt: "The Moon waffle, fast asleep" },
  // TODO(art): a real shrug pose. Until then Pip "draws" with a tilt.
  shrug: { key: "pip/draw", alt: "Pip shrugging, crayon in hand" },
  bye: { key: "pip/bye", alt: "Pip waving goodbye" },
} as const;

/** Pip never sells. Pip only appears in drawings, sometimes with a tiny handwritten note. */
export function Pip({
  pose = "wave",
  className = "",
  note,
  noteSide = "right",
  alt,
}: {
  pose?: PipPose;
  className?: string;
  note?: string;
  noteSide?: "left" | "right";
  alt?: string;
}) {
  const p = poses[pose];
  const a = art(p.key);
  return (
    <figure className={`relative inline-block ${className}`}>
      <Boil>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={a.src}
          alt={alt ?? p.alt}
          width={a.w}
          height={a.h}
          loading="lazy"
          decoding="async"
          className={`h-auto w-full ${pose === "shrug" ? "-rotate-12" : ""}`}
        />
      </Boil>
      {note && (
        <figcaption
          className={`font-hand absolute top-0 w-max max-w-[11rem] text-base leading-tight text-[var(--pink-pen-text)] ${
            noteSide === "right" ? "left-[92%] rotate-[4deg]" : "right-[92%] -rotate-[4deg] text-right"
          }`}
        >
          {note}
        </figcaption>
      )}
    </figure>
  );
}
