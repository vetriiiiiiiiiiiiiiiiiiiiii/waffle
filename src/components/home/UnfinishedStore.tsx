"use client";
import { useStored } from "@/lib/useStored";
import { ColourInScene, REGIONS } from "@/components/draw/ColourInScene";
import { HandTitle } from "@/components/draw/HandTitle";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { StickyNote } from "@/components/draw/Paper";
import { art } from "@/lib/art";
import stores from "@/data/stores.json";

const KEY = "waffle-story:colour-in:v1";
const BASE_STROKES = 12840; // TODO(backend): live community count from /api/colour-in

/* eslint-disable @next/next/no-img-element */

export function UnfinishedStore() {
  const flagship = stores[0];
  const [mine, setMine] = useStored<string[]>(KEY, []);
  const count = BASE_STROKES + (mine?.length ?? 0) * 37;
  const awningDone = mine?.includes("awning");
  const progress = Math.min(1, flagship.colouring.progress + (awningDone ? 0.04 : 0) + (mine?.length ?? 0) * 0.005);
  const zones = [
    { k: "store/fridge" as const, label: "The Fridge Wall", line: "Your drawings, pinned with magnets. Each one gets the Day Stamp." },
    { k: "store/stools" as const, label: "Crayon Stools", line: "Seats shaped like giant crayon stubs, in five pastels." },
    { k: "store/counter" as const, label: "The Book Counter", line: "A giant open book. The waffle irons sit on it like a printing press." },
  ];

  return (
    <section aria-labelledby="store-title" className="mx-auto max-w-[1280px] px-5 py-24 md:px-8">
      <HandTitle as="h2" className="text-5xl md:text-6xl" highlight="#F4B6C2" salt="store" id="store-title">
        {"The unfinished store."}
      </HandTitle>
      <p className="mt-4 max-w-2xl text-lg">
        A colouring book you can walk into. Every store opens as a black line drawing, and every month customers colour in a new part. Go
        on, try it. Tap a part of the shop.
      </p>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.6fr_0.8fr]">
        {mine && (
          <ColourInScene
            initial={mine}
            onColour={(_, all) => setMine(all)}
          />
        )}
        {!mine && <div className="aspect-[1275/879] w-full" aria-hidden="true" />}

        <div className="space-y-8">
          <StickyNote colour="strawberry" tilt={2} seedKey="colouring-now">
            <p className="font-hand text-2xl uppercase leading-tight">This month we&rsquo;re colouring: {flagship.colouring.now}</p>
            <div className="relative mt-4 h-6" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Community colouring progress">
              <RoughFrame shape="rect" seedKey="bar-outline" strokeWidth={1.4} inset={1} roughness={1.2} />
              <div className="absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, transition: "width .6s steps(6,end)" }}>
                <RoughFrame shape="rect" fill="#C9506D" fillStyle="zigzag" stroke="none" strokeWidth={0} seedKey={`bar-${Math.round(progress * 100)}`} inset={3} hachureGap={4} />
              </div>
            </div>
            <p className="font-type mt-3 text-sm">
              {Math.round(progress * 100)}% coloured · {count.toLocaleString("en-IN")} crayon strokes this month
            </p>
            <p className="font-type mt-1 text-sm">
              You coloured {mine?.length ?? 0} of {REGIONS.length} parts.
            </p>
          </StickyNote>
          <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {zones.map((z) => {
              const a = art(z.k);
              return (
                <li key={z.k} className="flex flex-col items-center gap-2 text-center lg:flex-row lg:text-left">
                  <img src={a.src} alt="" width={a.w} height={a.h} loading="lazy" className="h-20 w-auto" />
                  <div>
                    <p className="font-hand text-xl uppercase">{z.label}</p>
                    <p className="hidden text-base lg:block">{z.line}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="font-hand text-3xl uppercase text-[var(--pink-pen-text)]">Come colour with us.</p>
        </div>
      </div>
    </section>
  );
}
