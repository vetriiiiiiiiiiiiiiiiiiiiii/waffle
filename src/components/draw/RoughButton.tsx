"use client";
import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";
import { RoughFrame } from "./RoughFrame";
import { scribbleBurst } from "./scribbleBurst";

type Common = {
  children: ReactNode;
  fill?: string;
  fillStyle?: "zigzag" | "hachure" | "cross-hatch";
  shape?: "rect" | "label" | "ellipse";
  size?: "sm" | "md" | "lg";
  className?: string;
  seedKey?: string;
};

type AsLink = Common & { href: string; onClick?: (e: MouseEvent) => void; type?: never; disabled?: never };
type AsButton = Common & {
  href?: undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const pad = { sm: "px-4 py-1.5 text-lg", md: "px-6 py-2.5 text-xl", lg: "px-8 py-3.5 text-2xl" };

/** A button someone drew: rough outline, crayon fill, stepped wobble, scribble burst on click. */
export function RoughButton(props: AsLink | AsButton) {
  const { children, fill = "#F6D776", fillStyle = "zigzag", shape = "rect", size = "md", className = "", seedKey } = props;
  const cls = `wobble-on-hover font-hand relative inline-flex select-none items-center justify-center gap-2 uppercase text-pencil ${pad[size]} ${className}`;
  const frame = (
    <RoughFrame shape={shape} fill={fill} fillStyle={fillStyle} seedKey={seedKey ?? String(children)} hachureGap={6} />
  );
  const burst = (e: MouseEvent) => {
    const x = e.clientX || (e.currentTarget as HTMLElement).getBoundingClientRect().left + 40;
    const y = e.clientY || (e.currentTarget as HTMLElement).getBoundingClientRect().top + 20;
    scribbleBurst(x, y);
  };
  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        className={cls}
        onClick={(e) => {
          burst(e);
          props.onClick?.(e);
        }}
      >
        {frame}
        <span className="relative">{children}</span>
      </Link>
    );
  }
  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      className={`${cls} disabled:opacity-60`}
      onClick={(e) => {
        burst(e);
        props.onClick?.(e);
      }}
    >
      {frame}
      <span className="relative">{children}</span>
    </button>
  );
}
