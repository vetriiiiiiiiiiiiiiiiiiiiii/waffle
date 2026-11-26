"use client";
import { useEffect, useState } from "react";
import fortunes from "@/data/fortunes.json";
import { onStorybookChange, readStorybook, savePage, PAGES_PER_FREE_CHAPTER, type SavedPage } from "@/lib/storybook";
import { RoughButton } from "@/components/draw/RoughButton";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { StickyNote } from "@/components/draw/Paper";
import { randomCode } from "@/lib/code";
import { seeded } from "@/lib/random";
import { Star, Sun } from "@/components/draw/Doodles";

/* eslint-disable @next/next/no-img-element */

function Slot({ n, page }: { n: number; page?: SavedPage }) {
  const r = seeded(`slot-${n}`);
  const tilt = (r() - 0.5) * 6;
  if (!page)
    return (
      <li className="relative aspect-[3/4]" aria-label={`Page ${n}: not found yet`}>
        <svg viewBox="0 0 60 80" className="h-full w-full" aria-hidden="true">
          <path d="M3 3.4 L56.6 3 L57 76.4 L3.4 77 Z" fill="none" stroke="#26211D" strokeOpacity=".18" strokeWidth="1" strokeDasharray="3 2.4" />
        </svg>
        <span className="font-type absolute inset-0 grid place-items-center text-xs text-pencil/40" aria-hidden="true">
          {String(n).padStart(3, "0")}
        </span>
      </li>
    );
  const golden = page.kind === "golden";
  return (
    <li className="relative aspect-[3/4]" style={{ transform: `rotate(${tilt}deg)` }}>
      <div
        className="relative h-full w-full overflow-hidden p-1"
        style={{ background: golden ? "#F7DC93" : "#FFFDF7", outline: "1.2px solid #26211D", borderRadius: "2px 5px 3px 6px" }}
        title={page.fortune || "Blank page you drew"}
      >
        {page.drawing ? (
          <img src={page.drawing} alt={`Page ${n}: a fortune you drew yourself`} className="h-full w-full object-cover" />
        ) : (
          <>
            <span className="font-type block text-xs text-[#B23D5B]">{String(n).padStart(3, "0")}</span>
            {golden ? <Star className="mx-auto mt-1 h-7 w-7" /> : <Sun className="mx-auto mt-1 h-7 w-7" />}
            <span className="sr-only">Page {n}: {page.fortune}</span>
          </>
        )}
      </div>
      <span className="tape -top-1.5 left-1/2 h-3 w-8 -translate-x-1/2" aria-hidden="true" />
    </li>
  );
}

export function Album() {
  const [pages, setPages] = useState<SavedPage[] | null>(null);
  useEffect(() => {
    const read = () => setPages(readStorybook());
    read();
    return onStorybookChange(read);
  }, []);
  const byPage = new Map((pages ?? []).map((p) => [p.page, p]));
  const n = pages?.length ?? 0;
  const towards = n % PAGES_PER_FREE_CHAPTER;
  const freeEarned = Math.floor(n / PAGES_PER_FREE_CHAPTER);

  const addDemo = () => {
    const r = seeded(`demo-${n}`);
    for (let i = 0; i < 3; i++) {
      const page = 1 + Math.floor(r() * 365);
      savePage({ code: randomCode(r, page), page, fortune: fortunes[page % fortunes.length], kind: r() > 0.96 ? "golden" : "everyday", savedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <StickyNote colour="butter" tilt={-2} seedKey="sb-progress">
            <p className="font-hand text-3xl uppercase leading-tight" aria-live="polite">
              {towards} of {PAGES_PER_FREE_CHAPTER} pages to your free chapter.
            </p>
            <div className="mt-3 flex gap-1" aria-hidden="true">
              {Array.from({ length: PAGES_PER_FREE_CHAPTER }, (_, i) => (
                <span key={i} className="relative h-6 flex-1">
                  <RoughFrame shape="rect" fill={i < towards ? "#E9B562" : undefined} fillStyle="zigzag" seedKey={`sb-${i}`} strokeWidth={1.1} inset={1} hachureGap={3} />
                </span>
              ))}
            </div>
            {freeEarned > 0 && <p className="font-hand mt-3 text-xl uppercase text-[var(--pink-pen-text)]">{freeEarned} free chapter{freeEarned > 1 ? "s" : ""} earned!</p>}
            <p className="font-type mt-3 text-sm">{n} of 365 pages collected</p>
          </StickyNote>
          <div className="flex flex-col items-start gap-3">
            <RoughButton href="/todays-page" fill="#BFE3D0" seedKey="sb-stamp">
              Stamp a new page
            </RoughButton>
            <RoughButton onClick={addDemo} fill="#FFFDF7" fillStyle="hachure" size="sm" seedKey="sb-demo">
              Add 3 demo pages
            </RoughButton>
            <p className="text-sm">
              Demo: your Storybook lives in this browser for now.
              {/* TODO(backend): sign-in + server-side Storybook */}
            </p>
          </div>
        </aside>
        <section aria-label="All 365 pages" className="relative bg-[#FFFDF7] p-4 md:p-8">
          <RoughFrame seedKey="album" strokeWidth={1.6} inset={1} />
          {pages === null ? (
            <p className="font-hand text-2xl uppercase">Pip is sharpening the crayons…</p>
          ) : (
            <ol className="relative grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-2.5 md:grid-cols-[repeat(auto-fill,minmax(64px,1fr))]">
              {Array.from({ length: 365 }, (_, i) => (
                <Slot key={i} n={i + 1} page={byPage.get(i + 1)} />
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
