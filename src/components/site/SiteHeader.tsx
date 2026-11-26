"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "./nav";
import { SquiggleLink } from "@/components/draw/SquiggleLink";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { hashString } from "@/lib/random";
import { art } from "@/lib/art";

const TAKES = ["logo/take-01", "logo/take-02", "logo/take-03"] as const;

/**
 * The living logo: like a sign-painter redrawing the sign, each page gets
 * one of the hand-drawn takes. The nav opens as a book's contents page on mobile.
 */
export function SiteHeader() {
  const path = usePathname();
  const take = art(TAKES[hashString(path) % TAKES.length]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="relative z-40">
      <a href="#main" className="skip-link">
        Skip to the story
      </a>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" aria-label="Waffle Story, back to the first page" className="wobble-on-hover block w-[132px] md:w-[150px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={take.src} alt="" width={take.w} height={take.h} className="h-auto w-full" />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="font-hand flex items-center gap-7 text-xl uppercase">
            {NAV.map((n) => (
              <li key={n.href}>
                <SquiggleLink href={n.href}>{n.label}</SquiggleLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          ref={btnRef}
          type="button"
          className="font-hand wobble-on-hover relative px-4 py-1.5 text-xl uppercase lg:hidden"
          aria-expanded={open}
          aria-controls="contents-page"
          onClick={() => setOpen((o) => !o)}
        >
          <RoughFrame fill="#D3C4EE" fillStyle="hachure" seedKey="menu-btn" />
          <span className="relative">{open ? "Close" : "Contents"}</span>
        </button>
      </div>
      {open && (
        <div ref={panelRef} id="contents-page" className="ruled fixed inset-x-3 top-20 z-50 px-14 pb-8 pt-7 lg:hidden" role="dialog" aria-label="Contents">
          <RoughFrame seedKey="contents" strokeWidth={1.6} inset={1} />
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" aria-hidden="true" />
          <p className="font-hand relative text-3xl uppercase">Contents</p>
          <ol className="font-hand relative mt-3 text-2xl uppercase">
            {[{ href: "/", label: "The first page", page: "01" }, ...NAV].map((n) => (
              <li key={n.href} className="flex items-baseline gap-2 py-1">
                <Link href={n.href} className="hover:text-[var(--pink-pen-text)]" onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
                <span className="mx-1 flex-1 border-b-2 border-dotted border-pencil/40" aria-hidden="true" />
                <span className="font-type text-base">{n.page}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </header>
  );
}
