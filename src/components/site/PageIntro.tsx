import type { ReactNode } from "react";
import { HandTitle } from "@/components/draw/HandTitle";
import { Pip, type PipPose } from "@/components/draw/Pip";

/** Top of an inner page: chapter label, hand-lettered title, a line of story, Pip in the margin. */
export function PageIntro({
  kicker,
  title,
  highlight = "#F6D776",
  children,
  pip,
  pipNote,
}: {
  kicker: string;
  title: string;
  highlight?: string;
  children?: ReactNode;
  pip?: PipPose;
  pipNote?: string;
}) {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-8 px-5 pb-6 pt-8 md:px-8 md:pt-14">
      <div className="max-w-3xl">
        <p className="font-hand text-lg uppercase text-[var(--pink-pen-text)]">{kicker}</p>
        <HandTitle as="h1" className="mt-1 text-5xl md:text-7xl" highlight={highlight} play="css">
          {title}
        </HandTitle>
        {children && <div className="mt-5 text-lg">{children}</div>}
      </div>
      {pip && <Pip pose={pip} note={pipNote} noteSide="left" className="w-28 md:w-36" />}
    </div>
  );
}
