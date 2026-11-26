"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** A link whose hand-drawn squiggle underline draws on hover / focus / current page. */
export function SquiggleLink({
  href,
  children,
  className = "",
  colour = "#C9506D",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  colour?: string;
  onClick?: () => void;
}) {
  const path = usePathname();
  const current = path === href;
  return (
    <Link href={href} className={`squiggle-link ${className}`} aria-current={current ? "page" : undefined} onClick={onClick}>
      {children}
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M1 6 C 8 1, 14 9, 21 5 S 34 1, 41 6 S 55 9, 62 4 S 76 1, 83 6 S 94 8, 99 4"
          fill="none"
          stroke={colour}
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
    </Link>
  );
}
