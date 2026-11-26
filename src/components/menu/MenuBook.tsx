"use client";
import { useMemo, useState } from "react";
import { useStored } from "@/lib/useStored";
import data from "@/data/chapters.json";
import { StickyNote } from "@/components/draw/Paper";
import { RoughButton } from "@/components/draw/RoughButton";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { ChapterWaffle } from "@/components/draw/ChapterWaffle";

type Tab = "all" | "chapters" | "footnotes" | "bonus";
type Line = { key: string; title: string; format?: "page" | "moon"; price: number };

const TABS: { id: Tab; label: string; colour: string }[] = [
  { id: "all", label: "Everything", colour: "#F6D776" },
  { id: "chapters", label: "Chapters", colour: "#F4B6C2" },
  { id: "footnotes", label: "Footnotes", colour: "#B9D4F1" },
  { id: "bonus", label: "Bonus", colour: "#D3C4EE" },
];

/** Hand-drawn veg mark: a wobbly square with a dot. */
function VegMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" role="img" aria-label="Vegetarian, eggless">
      <path d="M3 3.6 L20.6 3 L21 20.4 L3.4 21 Z M3.4 3 L3 4.4" fill="none" stroke="#2E7D4F" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 7.4 C 15 7.2, 16.6 9.6, 16.4 12 C 16.2 15, 13.8 16.6, 11.6 16.4 C 9 16.2, 7.4 14, 7.6 11.6 C 7.8 9.2, 9.6 7.4, 12.6 7.6" fill="#2E7D4F" />
    </svg>
  );
}

const CART = "waffle-story:cart:v1";

export function MenuBook() {
  const [tab, setTab] = useState<Tab>("all");
  const [formats, setFormats] = useState<Record<string, "page" | "moon">>({});
  const [stored, save] = useStored<Line[]>(CART, []);
  const cart = stored ?? [];
  const [ordered, setOrdered] = useState(false);

  const items = useMemo(() => {
    const ch = data.chapters.map((c) => ({ ...c, kind: "chapters" as const, label: `Ch.${c.number}` }));
    const fn = data.footnotes.map((c) => ({ ...c, kind: "footnotes" as const, label: `Footnote ${c.number}` }));
    const bc = data.bonus.map((c) => ({ ...c, kind: "bonus" as const, label: `Bonus chapter` }));
    const all = [...ch, ...fn, ...bc];
    return tab === "all" ? all : all.filter((x) => x.kind === tab);
  }, [tab]);

  const total = cart.reduce((s, l) => s + l.price, 0);
  const tilts = [-2, 1.5, -1, 2.2, -1.6, 1];

  return (
    <div className="mx-auto max-w-[1280px] px-3 md:px-8">
      <div className="relative grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* the notebook with index tabs on its edge */}
        <div className="relative">
          <div role="tablist" aria-label="Filter the menu" className="relative z-10 flex gap-1 pl-6 md:pl-14">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="menu-panel"
                onClick={() => setTab(t.id)}
                className={`font-hand relative px-4 pb-2 pt-2 text-lg uppercase transition-transform [transition-timing-function:steps(3,end)] md:text-xl ${tab === t.id ? "translate-y-[3px]" : "translate-y-2 hover:translate-y-1"}`}
              >
                <RoughFrame fill={t.colour} fillStyle={tab === t.id ? "zigzag" : "hachure"} seedKey={`tab-${t.id}`} strokeWidth={1.5} inset={2} />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
          <div id="menu-panel" role="tabpanel" className="ruled relative px-4 pb-14 pt-12 md:pl-20 md:pr-10">
            <RoughFrame seedKey="menu-book" strokeWidth={1.7} inset={1} />
            <ul className="relative grid gap-x-8 gap-y-12 sm:grid-cols-2 2xl:grid-cols-3">
              {items.map((it, k) => {
                const isCh = it.kind === "chapters";
                const fmt = formats[it.id] ?? "page";
                const price = typeof it.price === "number" ? it.price : it.price[fmt];
                return (
                  <li key={it.id}>
                    <StickyNote
                      as="article"
                      colour={it.colour as "butter"}
                      tilt={tilts[k % tilts.length]}
                      seedKey={`menu-${it.id}`}
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-type text-xs uppercase">{it.label}</p>
                        {it.veg && <VegMark />}
                      </div>
                      <h2 className="font-hand mt-1 text-3xl uppercase leading-none">{it.title}</h2>
                      {isCh && <ChapterWaffle id={it.id} title="" className="mx-auto my-2 h-28 w-auto" />}
                      {"toppings" in it && <p className="font-hand text-lg uppercase text-blue-pen">{(it.toppings as string[]).join(" · ")}</p>}
                      <p className="mt-1 text-base">{it.line}</p>
                      {"season" in it && it.season && <p className="font-hand mt-1 text-lg uppercase text-[var(--pink-pen-text)]">only in {it.season as string}</p>}
                      <div className="mt-auto pt-4">
                        {isCh && (
                          <fieldset className="font-hand mb-3 flex gap-3 text-lg uppercase">
                            <legend className="sr-only">Format for {it.title}</legend>
                            {(["page", "moon"] as const).map((f) => (
                              <label key={f} className="flex cursor-pointer items-center gap-1 whitespace-nowrap">
                                <input type="radio" name={`fmt-${it.id}`} checked={fmt === f} onChange={() => setFormats((s) => ({ ...s, [it.id]: f }))} className="accent-[#26211D]" />
                                The {f}
                              </label>
                            ))}
                          </fieldset>
                        )}
                        <div className="flex items-end justify-between gap-2">
                          <p className="font-type text-lg">₹{price}</p>
                          <RoughButton
                            size="sm"
                            fill="#FFFDF7"
                            fillStyle="hachure"
                            seedKey={`add-${it.id}`}
                            onClick={() => {
                              setOrdered(false);
                              save([...cart, { key: `${it.id}-${Date.now()}`, title: it.title, format: isCh ? fmt : undefined, price }]);
                            }}
                          >
                            Add
                          </RoughButton>
                        </div>
                        <p className="font-type mt-2 text-[0.72rem] leading-snug">Allergens: {it.allergens.length ? it.allergens.join(", ") : "none listed"}. Eggless batter.</p>
                      </div>
                    </StickyNote>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* the order slip */}
        <aside aria-label="Your order" className="lg:sticky lg:top-6 lg:self-start">
          <div className="relative bg-[#FFFDF7] px-5 pb-6 pt-7" style={{ transform: "rotate(1deg)" }}>
            <RoughFrame seedKey="order-slip" strokeWidth={1.5} inset={1} />
            <span className="tape -top-3 left-1/2 -translate-x-1/2" aria-hidden="true" />
            <p className="font-hand relative text-3xl uppercase">Your story</p>
            <div className="relative mt-3 min-h-[80px]" aria-live="polite">
              {ordered ? (
                <p className="font-hand text-2xl uppercase text-blue-pen">Chapter ordered. Happy reading.</p>
              ) : cart.length === 0 ? (
                <p className="font-hand text-xl uppercase text-pencil/80">Your story hasn&rsquo;t started yet.</p>
              ) : (
                <ul className="font-type space-y-1 text-sm">
                  {cart.map((l) => (
                    <li key={l.key} className="flex justify-between gap-2 border-b border-dashed border-pencil/30 pb-1">
                      <span>
                        {l.title}
                        {l.format && ` (${l.format})`}
                      </span>
                      <span className="flex items-center gap-2">
                        ₹{l.price}
                        <button type="button" aria-label={`Remove ${l.title}`} className="px-1 hover:text-[var(--pink-pen-text)]" onClick={() => save(cart.filter((c) => c.key !== l.key))}>
                          ×
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cart.length > 0 && !ordered && (
              <>
                <p className="font-type relative mt-3 flex justify-between text-base">
                  <span>Total</span>
                  <span>₹{total}</span>
                </p>
                <RoughButton
                  className="mt-4 w-full"
                  fill="#F6D776"
                  seedKey="start-chapter"
                  onClick={() => {
                    // TODO(backend): POST /api/order → payment provider. Demo only.
                    save([]);
                    setOrdered(true);
                  }}
                >
                  Start this chapter
                </RoughButton>
              </>
            )}
            <p className="font-hand relative mt-4 text-base uppercase text-[var(--pink-pen-text)]">Plot twist: extra butter.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
