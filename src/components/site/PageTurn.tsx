"use client";
import { useEffect, useState, type ReactNode } from "react";

type W = Window & { __wsNavigated?: boolean };

/**
 * Page transition: a sheet of notebook paper turns away from the new page,
 * like flipping to the next page of an exercise book (clip-path + slight rotateY, 600ms).
 * Pure CSS (globals.css: .page-turn). Never on first load, never for reduced motion.
 */
export function PageTurn({ children }: { children: ReactNode }) {
  // false on the server and on first hydration; true for every client-side page change after that
  const [show] = useState(() => typeof window !== "undefined" && !!(window as W).__wsNavigated);
  useEffect(() => {
    (window as W).__wsNavigated = true;
  }, []);
  return (
    <>
      {show && (
        <div aria-hidden="true" className="page-turn ruled pointer-events-none fixed inset-0 z-[65]">
          <svg className="absolute right-0 top-0 h-full w-6" preserveAspectRatio="none" viewBox="0 0 10 100">
            <path d="M2 0 C 4 20, 1 40, 3 60 S 2 85, 3 100" stroke="#26211D" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}
      {children}
    </>
  );
}
