"use client";
import { useState } from "react";
import { art } from "@/lib/art";
import { HandTitle } from "@/components/draw/HandTitle";
import { Boil } from "@/components/draw/Boil";
import { RoughButton } from "@/components/draw/RoughButton";
import { Arrow } from "@/components/draw/Doodles";

/* eslint-disable @next/next/no-img-element */

function Flip({
  front,
  back,
  flipped,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
}) {
  return (
    <div className="relative [perspective:1600px]">
      <div
        className="relative grid transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "none", transitionTimingFunction: "steps(9, end)" }}
      >
        <div className="col-start-1 row-start-1 [backface-visibility:hidden]" aria-hidden={flipped}>
          {front}
        </div>
        <div className="col-start-1 row-start-1 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!flipped}>
          {back}
        </div>
      </div>
    </div>
  );
}

/** The Moon, with dotted cut lines that split into four chapters on hover/focus. */
function MoonSplit() {
  const m = art("waffles/moon");
  const quads = [
    { clip: "polygon(50% 50%, 50% -5%, -5% -5%, -5% 50%)", move: "group-hover:-translate-x-3 group-hover:-translate-y-3 group-focus-within:-translate-x-3 group-focus-within:-translate-y-3" },
    { clip: "polygon(50% 50%, 50% -5%, 105% -5%, 105% 50%)", move: "group-hover:translate-x-3 group-hover:-translate-y-3 group-focus-within:translate-x-3 group-focus-within:-translate-y-3" },
    { clip: "polygon(50% 50%, 105% 50%, 105% 105%, 50% 105%)", move: "group-hover:translate-x-3 group-hover:translate-y-3 group-focus-within:translate-x-3 group-focus-within:translate-y-3" },
    { clip: "polygon(50% 50%, 50% 105%, -5% 105%, -5% 50%)", move: "group-hover:-translate-x-3 group-hover:translate-y-3 group-focus-within:-translate-x-3 group-focus-within:translate-y-3" },
  ];
  return (
    <div className="relative" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
      {quads.map((qd, i) => (
        <img
          key={i}
          src={m.src}
          alt={i === 0 ? "The Moon: a round waffle with chocolate, strawberries and butter" : ""}
          aria-hidden={i === 0 ? undefined : true}
          loading="lazy"
          className={`absolute inset-0 h-full w-full transition-transform duration-500 [transition-timing-function:steps(5,end)] ${qd.move}`}
          style={{ clipPath: qd.clip }}
        />
      ))}
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0" aria-hidden="true">
        <path d="M50 4 L50 96 M4 50 L96 50" stroke="#FFFDF7" strokeWidth="0.9" strokeDasharray="2.4 2" fill="none" />
      </svg>
      <span className="font-hand absolute -right-2 bottom-2 rotate-6 text-lg uppercase text-[var(--pink-pen-text)] opacity-0 transition-opacity [transition-timing-function:steps(3,end)] group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden="true">
        4 chapters!
      </span>
    </div>
  );
}

export function TwoWaffles() {
  const [pageFlip, setPageFlip] = useState(false);
  const [moonFlip, setMoonFlip] = useState(false);
  const page = art("waffles/page");
  const sleeve = art("packaging/page-sleeve");
  const box = art("packaging/moon-box");
  const tPage = art("logo/the-page");
  const tMoon = art("logo/the-moon");

  return (
    <section aria-labelledby="two-title" className="mx-auto max-w-[1280px] px-5 py-24 md:px-8">
      <HandTitle as="h2" className="text-5xl md:text-6xl" highlight="#F6D776" salt="two" id="two-title">
        {"Two waffles.\nTwo ways to read."}
      </HandTitle>
      <p className="mt-4 max-w-2xl text-lg">Every chapter comes as either The Page or The Moon. Tap a waffle to turn it over and see what it travels in.</p>

      <div className="mt-14 grid gap-16 md:grid-cols-2 md:gap-10">
        {/* THE PAGE */}
        <article className="group relative">
          <span className="font-hand absolute -top-6 right-6 flex items-end gap-1 text-xl uppercase text-[var(--pink-pen-text)]" aria-hidden="true">
            made for walking <Arrow className="h-8 w-10 rotate-90" />
          </span>
          <Flip
            flipped={pageFlip}
            front={
              <Boil className="mx-auto w-[72%] max-w-[340px]">
                <img src={page.src} alt="The Page: a rectangular waffle with chocolate drizzle, strawberries and butter" width={page.w} height={page.h} loading="lazy" className="h-auto w-full" />
              </Boil>
            }
            back={
              <div className="mx-auto w-[56%] max-w-[260px]">
                <img src={sleeve.src} alt="The Page sleeve: a school notebook cover labelled Name: You, Class: Gen Z, Subject: Waffles, with Today's Page tearing off the top" width={sleeve.w} height={sleeve.h} loading="lazy" className="h-auto w-full" />
              </div>
            }
          />
          <img src={tPage.src} width={tPage.w} height={tPage.h} alt="" aria-hidden="true" loading="lazy" className="mx-auto mt-4 w-[58%] max-w-[260px]" />
          <h3 className="sr-only">The Page</h3>
          <p className="mx-auto mt-3 max-w-sm text-center">
            Twenty pockets, twenty tiny chapters. Slides into a notebook sleeve, so you can read it between classes.
          </p>
          <div className="mt-5 flex justify-center">
            <RoughButton onClick={() => setPageFlip((f) => !f)} fill="#F6D776" size="sm" seedKey="flip-page">
              {pageFlip ? "Back to the waffle" : "Turn it over"}
            </RoughButton>
          </div>
        </article>

        {/* THE MOON */}
        <article className="relative">
          <span className="font-hand absolute -top-6 left-6 flex items-end gap-1 text-xl uppercase text-[var(--pink-pen-text)]" aria-hidden="true">
            <Arrow className="h-8 w-10 -scale-x-100 rotate-[-90deg]" /> made for sharing
          </span>
          <Flip
            flipped={moonFlip}
            front={
              <div className="group mx-auto w-[86%] max-w-[420px]">
                <MoonSplit />
              </div>
            }
            back={
              <div className="mx-auto w-[78%] max-w-[360px]">
                <img src={box.src} alt="The Moon box: a lilac night sky with a sleepy waffle moon. It reads The Moon, Waffle Story, open slowly, sweet dreams" width={box.w} height={box.h} loading="lazy" className="h-auto w-full" />
              </div>
            }
          />
          <img src={tMoon.src} width={tMoon.w} height={tMoon.h} alt="" aria-hidden="true" loading="lazy" className="mx-auto mt-4 w-[58%] max-w-[260px]" />
          <h3 className="sr-only">The Moon</h3>
          <p className="mx-auto mt-3 max-w-sm text-center">
            Cut into four chapters, one each. Comes in a lilac night-sky box with a sleepy moon on the lid.
          </p>
          <div className="mt-5 flex justify-center">
            <RoughButton onClick={() => setMoonFlip((f) => !f)} fill="#D3C4EE" size="sm" seedKey="flip-moon">
              {moonFlip ? "Back to the waffle" : "Open the box"}
            </RoughButton>
          </div>
        </article>
      </div>
    </section>
  );
}
