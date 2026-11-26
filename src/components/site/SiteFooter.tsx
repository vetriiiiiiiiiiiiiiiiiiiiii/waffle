"use client";
import Link from "next/link";
import { useState } from "react";
import stores from "@/data/stores.json";
import { NAV } from "./nav";
import { Pip } from "@/components/draw/Pip";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { RoughButton } from "@/components/draw/RoughButton";
import { InstaDoodle, YoutubeDoodle, WhatsDoodle } from "@/components/draw/Doodles";
import { HandTitle } from "@/components/draw/HandTitle";
import { SquiggleLink } from "@/components/draw/SquiggleLink";

/** The back page: a ruled notebook sheet with Pip waving goodbye. */
export function SiteFooter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <footer className="relative mt-24 px-3 pb-6 md:px-8">
      <div className="ruled relative mx-auto max-w-[1280px] px-6 pb-10 pt-12 md:pl-24 md:pr-12">
        <RoughFrame seedKey="footer-page" strokeWidth={1.7} inset={1} />
        <span className="tape -top-3 left-[12%] rotate-[-4deg]" aria-hidden="true" />
        <span className="tape -top-3 right-[12%] rotate-[5deg]" aria-hidden="true" />
        <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <HandTitle as="p" className="text-4xl md:text-5xl" highlight="#BFE3D0" salt="footer">
              {"See you in the\nnext chapter."}
            </HandTitle>
            {sent ? (
              <p className="font-hand mt-6 text-2xl uppercase text-blue-pen" role="status">
                Noted, {name || "friend"}. The next page comes to your inbox.
              </p>
            ) : (
              <form
                className="mt-6 max-w-md"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO(backend): POST to the newsletter provider.
                  setSent(true);
                }}
              >
                <p className="mb-3 text-base">One page a week. Fortunes, bonus chapters, no spoilers.</p>
                <div className="relative bg-[#FFFDF7] px-5 py-4">
                  <RoughFrame shape="label" seedKey="news-label" strokeWidth={1.6} />
                  <label className="font-hand relative flex items-baseline gap-2 text-xl uppercase">
                    Name:
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="given-name"
                      className="font-hand flex-1 border-b-2 border-dashed border-blue-pen/60 bg-transparent px-1 text-xl text-blue-pen outline-none focus-visible:border-blue-pen"
                    />
                  </label>
                  <label className="font-hand relative mt-2 flex items-baseline gap-2 text-xl uppercase">
                    Email:
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="font-type flex-1 border-b-2 border-dashed border-blue-pen/60 bg-transparent px-1 text-base text-blue-pen outline-none focus-visible:border-blue-pen"
                    />
                  </label>
                </div>
                <RoughButton type="submit" className="mt-4" fill="#F4B6C2" size="sm">
                  Pass me the note
                </RoughButton>
              </form>
            )}
          </div>
          <nav aria-label="Footer">
            <p className="font-hand text-2xl uppercase text-[var(--pink-pen-text)]">Pages</p>
            <ul className="font-hand mt-2 space-y-1 text-xl uppercase">
              {NAV.map((n) => (
                <li key={n.href}>
                  <SquiggleLink href={n.href} colour="#2F5FA8">
                    {n.label}
                  </SquiggleLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-hand text-2xl uppercase text-[var(--pink-pen-text)]">Find a store</p>
            <ul className="mt-2 space-y-2 text-base">
              {stores.map((s) => (
                <li key={s.id}>
                  <Link href={`/stores#${s.id}`} className="underline decoration-sky decoration-2 underline-offset-4 hover:decoration-pink-pen">
                    {s.name.replace("Waffle Story · ", "")}, {s.city}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="font-hand mt-6 text-2xl uppercase text-[var(--pink-pen-text)]">Pass notes</p>
            <ul className="mt-2 flex gap-3">
              {[
                { label: "Instagram", I: InstaDoodle },
                { label: "YouTube", I: YoutubeDoodle },
                { label: "WhatsApp", I: WhatsDoodle },
              ].map(({ label, I }) => (
                <li key={label}>
                  {/* TODO(content): real social URLs */}
                  <a href="#" aria-label={`Waffle Story on ${label}`} className="wobble-on-hover block h-11 w-11">
                    <I className="h-full w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative mt-10 flex flex-wrap items-end justify-between gap-6">
          <p className="font-type text-sm">
            © 2026 Waffle Story · This page intentionally left delicious.
          </p>
          <Pip pose="bye" className="w-28 md:w-32" note="bye! see you tomorrow" noteSide="left" alt="Pip waving goodbye" />
        </div>
      </div>
    </footer>
  );
}
