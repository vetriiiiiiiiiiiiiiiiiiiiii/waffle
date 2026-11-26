"use client";
import { useRef, useState } from "react";
import data from "@/data/chapters.json";
import { ChapterWaffle } from "@/components/draw/ChapterWaffle";
import { HandTitle } from "@/components/draw/HandTitle";
import { RoughButton } from "@/components/draw/RoughButton";
import { RoughFrame } from "@/components/draw/RoughFrame";

const chapters = data.chapters;

/** A notebook you can flip: each chapter is a page. Drag, swipe, arrow keys or buttons. */
export function ChaptersBook() {
  const [i, setI] = useState(0);
  const [turn, setTurn] = useState<{ from: number; dir: number; key: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const jump = (to: number, dir: number) => {
    if (to === i) return;
    window.clearTimeout(timer.current);
    setTurn((t) => ({ from: i, dir, key: (t?.key ?? 0) + 1 }));
    setI(to);
    timer.current = window.setTimeout(() => setTurn(null), 620);
  };
  const go = (d: number) => jump((i + d + chapters.length) % chapters.length, d);
  const set = ([to, dir]: [number, number]) => jump(to, dir);
  const ch = chapters[i];

  const onUp = () => {
    if (startX.current == null) return;
    startX.current = null;
    if (dragX < -70) go(1);
    else if (dragX > 70) go(-1);
    setDragX(0);
  };

  const page = (c: (typeof chapters)[number], extra: string, style?: React.CSSProperties, live?: boolean) => (
    <article
      key={c.id + extra}
      aria-live={live ? "polite" : undefined}
      aria-hidden={live ? undefined : true}
      className={`ruled absolute inset-0 px-8 pb-8 pt-7 md:pl-16 ${extra}`}
      style={{ transformOrigin: "0% 50%", backfaceVisibility: "hidden", ...style }}
    >
      <RoughFrame seedKey={`page-${c.id}`} strokeWidth={1.6} inset={1} />
      <div className="relative flex h-full flex-col">
        <p className="font-type text-sm uppercase text-[var(--pink-pen-text)]">Chapter {c.number}</p>
        <h3 className="font-hand text-4xl uppercase leading-none">{c.title}</h3>
        <div className="mt-2 grid flex-1 grid-cols-[1fr_1.1fr] items-center gap-4">
          <ChapterWaffle id={c.id} title={`${c.title}: a waffle with ${c.toppings.join(", ")}`} className="h-auto w-full max-w-[220px]" />
          <div>
            <ul className="font-hand space-y-1 text-xl uppercase text-blue-pen">
              {c.toppings.map((t) => (
                <li key={t}>+ {t}</li>
              ))}
            </ul>
            <p className="mt-3 text-base">{c.line}</p>
            <p className="font-type mt-3 text-sm">
              Page ₹{c.price.page} · Moon ₹{c.price.moon}
            </p>
            <p className="font-hand mt-3 -rotate-3 text-lg lowercase text-[var(--pink-pen-text)]">pip says: {c.pip}</p>
          </div>
        </div>
        <p className="font-hand text-center text-lg uppercase text-pencil/70" aria-hidden="true">
          ← drag to turn the page →
        </p>
      </div>
    </article>
  );

  return (
    <section aria-labelledby="chapters-title" className="mx-auto max-w-[1280px] px-5 py-24 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <HandTitle as="h2" className="text-5xl md:text-6xl" highlight="#F4B6C2" salt="chapters" id="chapters-title">
            {"The chapters."}
          </HandTitle>
          <p className="mt-3 max-w-xl text-lg">A menu, but make it a book. Six chapters, each one a waffle. Read one chapter. Order the sequel.</p>
        </div>
        <RoughButton href="/menu" fill="#BFE3D0" fillStyle="hachure" seedKey="all-chapters">
          The whole book
        </RoughButton>
      </div>

      <div
        className="relative mx-auto mt-12 grid max-w-[1040px] md:grid-cols-2"
        role="region"
        aria-roledescription="carousel"
        aria-label="Chapters notebook"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {/* left page: contents */}
        <div className="ruled relative hidden min-h-[520px] pl-16 pr-8 pt-8 md:block">
          <RoughFrame seedKey="book-left" strokeWidth={1.6} inset={1} />
          <p className="font-hand relative text-3xl uppercase">Contents</p>
          <ol className="font-hand relative mt-3 space-y-[0.32rem] text-[1.45rem] uppercase leading-[1.9rem]">
            {chapters.map((c, k) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => set([k, k > i ? 1 : -1])}
                  aria-current={k === i ? "true" : undefined}
                  className={`text-left hover:text-[var(--pink-pen-text)] ${k === i ? "text-[var(--pink-pen-text)] underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
                >
                  Ch.{c.number} · {c.title}
                </button>
              </li>
            ))}
          </ol>
          <p className="font-hand relative mt-6 text-xl uppercase text-blue-pen">+ footnotes (drinks) + bonus chapters</p>
        </div>

        {/* right page: the chapter, turnable */}
        <div className="relative min-h-[560px] [perspective:1800px]">
          {/* the page underneath */}
          <div className="ruled absolute inset-0" aria-hidden="true">
            <RoughFrame seedKey="book-under" strokeWidth={1.4} inset={1} />
          </div>
          <div
            className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
            onPointerDown={(e) => {
              startX.current = e.clientX;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => startX.current != null && setDragX(e.clientX - startX.current)}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {/* the current page; when turning back it swings in over the old one */}
            {page(
              ch,
              turn && turn.dir < 0 ? "page-swing-in z-[2]" : "z-[1]",
              dragX ? { transform: `perspective(1800px) rotateY(${Math.max(-40, Math.min(12, dragX / 6))}deg)` } : undefined,
              true,
            )}
            {/* turning forward: the old page swings away on top */}
            {turn && turn.dir > 0 && page(chapters[turn.from], "page-swing-out z-[3]")}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4 md:col-span-2">
          <RoughButton onClick={() => go(-1)} size="sm" fill="#B9D4F1" seedKey="prev-ch">
            ← Previous page
          </RoughButton>
          <span className="font-type text-sm" aria-live="polite">
            {i + 1} / {chapters.length}
          </span>
          <RoughButton onClick={() => go(1)} size="sm" fill="#F6D776" seedKey="next-ch">
            Next page →
          </RoughButton>
        </div>
      </div>
    </section>
  );
}
