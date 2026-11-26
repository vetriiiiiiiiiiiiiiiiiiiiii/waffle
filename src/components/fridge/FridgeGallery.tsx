"use client";
import { useState } from "react";
import fridge from "@/data/fridge.json";
import { FridgeItem } from "@/components/draw/FridgeWall";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { RoughButton } from "@/components/draw/RoughButton";
import { NotebookPage } from "@/components/draw/Paper";

const FILTERS = [
  { id: "all", label: "Everything", colour: "#F6D776" },
  { id: "week", label: "This week", colour: "#BFE3D0" },
  { id: "staff", label: "Staff picks", colour: "#F4B6C2" },
  { id: "golden", label: "Golden", colour: "#E9B562" },
] as const;

export function FridgeGallery() {
  const [f, setF] = useState<(typeof FILTERS)[number]["id"]>("all");
  const items = f === "all" ? fridge : fridge.filter((d) => d.tags.includes(f));
  const [preview, setPreview] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-8">
      <div role="group" aria-label="Filter drawings" className="flex flex-wrap gap-3">
        {FILTERS.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={f === x.id}
            onClick={() => setF(x.id)}
            className={`font-hand wobble-on-hover relative px-4 py-1.5 text-xl uppercase ${f === x.id ? "" : "opacity-80"}`}
          >
            <RoughFrame fill={f === x.id ? x.colour : undefined} fillStyle="zigzag" seedKey={`ff-${x.id}`} strokeWidth={1.5} />
            <span className="relative">{x.label}</span>
          </button>
        ))}
      </div>

      <div className="relative mt-10 bg-[#E4F2EA] px-5 py-12 md:px-10" style={{ borderRadius: "26px 20px 30px 18px / 18px 30px 20px 26px", outline: "2px solid #26211D", outlineOffset: "-2px" }}>
        <ul className="columns-2 gap-6 sm:columns-3 lg:columns-4 [&>li]:mb-10 [&>li]:inline-block [&>li]:w-full" aria-live="polite">
          {items.map((d) => (
            <li key={d.id}>
              <FridgeItem d={d} />
            </li>
          ))}
        </ul>
        {!items.length && <p className="font-hand text-2xl uppercase">Nothing pinned here yet. Be the first.</p>}
      </div>

      <section id="pin" aria-labelledby="pin-title" className="mx-auto mt-20 max-w-3xl scroll-mt-10">
        <NotebookPage seedKey="pin-form" tilt={0.5}>
          <h2 id="pin-title" className="font-hand text-4xl uppercase">Pin your drawing.</h2>
          {sent ? (
            <p className="font-hand mt-4 text-2xl uppercase text-blue-pen" role="status">
              Sent to the teacher&rsquo;s desk. We&rsquo;ll pin it up after a quick look.
            </p>
          ) : (
            <form
              className="mt-4 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO(backend): POST multipart to /api/fridge → storage bucket + moderation queue (nothing goes live unreviewed)
                setSent(true);
              }}
            >
              <p className="text-base">A photo of a doodle, a napkin sketch, your sun that was secretly a waffle. Everything is checked by a human before it goes up.</p>
              <label className="font-hand block text-xl uppercase">
                Your drawing
                <span className="relative mt-2 flex min-h-[140px] cursor-pointer items-center justify-center bg-[#FFFDF7] p-4 text-center">
                  <RoughFrame seedKey="drop" strokeWidth={1.4} fill="#B9D4F1" fillStyle="hachure" hachureGap={12} />
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview of your drawing" className="relative max-h-56 w-auto" />
                  ) : (
                    <span className="relative text-lg">Tap to pick a photo (JPG or PNG, under 8 MB)</span>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    required
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size < 8 * 1024 * 1024) setPreview(URL.createObjectURL(file));
                    }}
                  />
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="font-hand block text-xl uppercase">
                  Name (first name is fine)
                  <input required className="font-type mt-1 block w-full border-b-2 border-dashed border-blue-pen bg-transparent py-1 text-lg normal-case text-blue-pen outline-none" />
                </label>
                <label className="font-hand block text-xl uppercase">
                  Title it
                  <input required className="font-type mt-1 block w-full border-b-2 border-dashed border-blue-pen bg-transparent py-1 text-lg normal-case text-blue-pen outline-none" />
                </label>
              </div>
              <label className="flex items-start gap-2 text-base">
                <input type="checkbox" required className="mt-1.5 accent-[#26211D]" />
                I drew this (or I have permission), and Waffle Story can pin it on the site and in stores.
              </label>
              <RoughButton type="submit" fill="#F6D776" seedKey="pin-submit">
                Pin it up
              </RoughButton>
            </form>
          )}
        </NotebookPage>
      </section>
    </div>
  );
}
