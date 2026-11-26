"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { formatCode, CODE_RE } from "@/lib/code";
import { savePage, PAGES_PER_FREE_CHAPTER, readStorybook } from "@/lib/storybook";
import { RoughFrame } from "@/components/draw/RoughFrame";
import { RoughButton } from "@/components/draw/RoughButton";
import { TodaysPageCard } from "@/components/draw/TodaysPageCard";
import { Pip } from "@/components/draw/Pip";
import { scribbleBurst } from "@/components/draw/scribbleBurst";

const DrawCanvas = dynamic(() => import("./DrawCanvas").then((m) => m.DrawCanvas), {
  ssr: false,
  loading: () => <p className="font-hand text-2xl uppercase">Pip is sharpening the crayons…</p>,
});

type Result =
  | { status: "valid" | "golden"; page: number; fortune: string; code: string; rerun?: boolean }
  | { status: "blank"; page: number; code: string }
  | { status: "invalid" }
  | { status: "duplicate"; code: string };

function progressLine(n: number) {
  const left = PAGES_PER_FREE_CHAPTER - (n % PAGES_PER_FREE_CHAPTER);
  return left === PAGES_PER_FREE_CHAPTER && n > 0
    ? "Ten pages! Your next chapter is free. Show your Storybook at the counter."
    : `${n % PAGES_PER_FREE_CHAPTER} of ${PAGES_PER_FREE_CHAPTER} pages to your free chapter.`;
}

/** Stamp: a crooked round rubber stamp that presses down, frame by frame. */
function Stamp({ busy }: { busy: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="font-hand group relative grid h-28 w-28 shrink-0 place-items-center text-xl uppercase leading-none text-[#B23D5B] transition-transform [transition-timing-function:steps(3,end)] active:scale-90 disabled:opacity-70"
      style={{ transform: "rotate(-9deg)" }}
    >
      <RoughFrame shape="circle" fill="#F4B6C2" fillStyle="hachure" stroke="#C9506D" strokeWidth={2.4} seedKey="stamp" hachureGap={5} />
      <svg className="pointer-events-none absolute inset-3" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#C9506D" strokeWidth="2" strokeDasharray="3 4" />
      </svg>
      <span className="relative">{busy ? "…" : "Stamp\nit".split("\n").map((l) => <span key={l} className="block">{l}</span>)}</span>
    </button>
  );
}

export function Redeem() {
  const [code, setCode] = useState("WS-");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CODE_RE.test(code)) {
      setResult({ status: "invalid" });
      return;
    }
    if (readStorybook().some((p) => p.code === code)) {
      setResult({ status: "duplicate", code });
      return;
    }
    setBusy(true);
    setFlipped(false);
    try {
      const res = await fetch("/api/redeem", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
      const r = (await res.json()) as Result;
      setResult(r);
      if (r.status === "valid" || r.status === "golden") {
        const { pages } = savePage({ code: r.code, page: r.page, fortune: r.fortune, kind: r.status === "golden" ? "golden" : r.rerun ? "rerun" : "everyday", savedAt: new Date().toISOString() });
        setCount(pages.length);
        setTimeout(() => setFlipped(true), 120);
        if (r.status === "golden") {
          const box = resultRef.current?.getBoundingClientRect();
          for (let k = 0; k < 14; k++)
            setTimeout(
              () =>
                scribbleBurst(
                  (box?.left ?? 200) + Math.random() * (box?.width ?? 400),
                  (box?.top ?? 200) + Math.random() * Math.min(500, box?.height ?? 400),
                  ["#F6D776", "#E9B562", "#F6D776", "#FFF3C7"],
                ),
              k * 90,
            );
        }
      }
    } catch {
      setResult({ status: "invalid" });
    } finally {
      setBusy(false);
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  };

  return (
    <div className="mx-auto grid max-w-[1280px] gap-14 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="self-start" aria-describedby="code-help">
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative flex-1 bg-[#FFFDF7] px-6 py-5" style={{ minWidth: 260 }}>
            <RoughFrame shape="label" seedKey="code-label" strokeWidth={1.8} fill="#BFE3D0" fillStyle="hachure" hachureGap={9} />
            <label htmlFor="code" className="font-hand relative block text-xl uppercase">
              Your page code
            </label>
            <input
              ref={inputRef}
              id="code"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(formatCode(e.target.value))}
              placeholder="WS-0427-K7M"
              aria-invalid={result?.status === "invalid"}
              className="font-type relative mt-1 w-full border-b-2 border-dashed border-blue-pen bg-transparent py-1 text-3xl tracking-[0.12em] text-blue-pen outline-none placeholder:text-blue-pen/40 focus-visible:border-solid"
            />
          </div>
          <Stamp busy={busy} />
        </div>
        <p id="code-help" className="mt-4 text-base">
          It&rsquo;s printed at the bottom of your page. Just type the letters and numbers, we&rsquo;ll add the dashes.
        </p>
        <details className="mt-6 text-base">
          <summary className="font-hand cursor-pointer text-xl uppercase text-[var(--pink-pen-text)]">No page handy? Try a demo code</summary>
          <ul className="font-type mt-2 space-y-1 text-sm">
            {[
              ["WS-0427-K7M", "an everyday page"],
              ["WS-0365-GLD", "a golden page"],
              ["WS-0109-BLK", "a blank page"],
              ["WS-9999-ZZZ", "not in the book"],
            ].map(([c, d]) => (
              <li key={c}>
                <button type="button" className="underline decoration-sky decoration-2 underline-offset-4 hover:decoration-pink-pen" onClick={() => setCode(c)}>
                  {c}
                </button>{" "}
                · {d}
              </li>
            ))}
          </ul>
        </details>
      </form>

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="min-h-[460px] outline-none focus-visible:outline-none">
        {!result && (
          <div className="ruled relative flex min-h-[420px] items-center justify-center p-10 text-center">
            <RoughFrame seedKey="empty-result" strokeWidth={1.4} inset={1} />
            <p className="font-hand relative text-2xl uppercase text-pencil/70">Your page will appear here.</p>
          </div>
        )}

        {(result?.status === "valid" || result?.status === "golden") && (
          <div>
            <div className="mx-auto max-w-[380px] [perspective:1400px]">
              <div
                className="relative grid transition-transform duration-700 [transform-style:preserve-3d] [transition-timing-function:steps(9,end)] motion-reduce:transition-none"
                style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
              >
                <div className="ruled col-start-1 row-start-1 min-h-[440px] [backface-visibility:hidden]" aria-hidden="true">
                  <RoughFrame seedKey="page-back" strokeWidth={1.4} inset={1} />
                </div>
                <div className="col-start-1 row-start-1 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <TodaysPageCard
                    page={result.page}
                    fortune={result.fortune}
                    code={result.code}
                    golden={result.status === "golden"}
                    doodle={result.status === "golden" ? "star" : "sun"}
                    className="min-h-[440px]"
                  />
                  <Pip pose="draw" className="absolute -bottom-6 -right-8 w-24" alt="Pip, still drawing the doodle on your page" />
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              {result.status === "golden" ? (
                <>
                  <p className="font-hand text-4xl uppercase">A golden page!</p>
                  <p className="font-hand mt-1 text-3xl uppercase text-[var(--pink-pen-text)]">The next waffle is on us.</p>
                  <p className="mt-2">One for you and one for a friend. Show this page at the counter.</p>
                </>
              ) : (
                <p className="font-hand text-3xl uppercase">{result.rerun ? "A rerun! Like your favourite episode." : "Taped into your Storybook."}</p>
              )}
              {count != null && <p className="font-hand mt-3 text-2xl uppercase text-blue-pen">{progressLine(count)}</p>}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <RoughButton href="/storybook" fill="#D3C4EE" seedKey="go-storybook">
                  Open my Storybook
                </RoughButton>
                <RoughButton
                  fill="#FFFDF7"
                  fillStyle="hachure"
                  seedKey="another-code"
                  onClick={() => {
                    setResult(null);
                    setCode("WS-");
                    inputRef.current?.focus();
                  }}
                >
                  Another code
                </RoughButton>
              </div>
            </div>
          </div>
        )}

        {result?.status === "blank" && (
          <div>
            <p className="font-hand text-3xl uppercase">A blank page. Rare!</p>
            <p className="mb-5 mt-1">This one has no fortune yet. You write it. The best blank pages get printed next month.</p>
            <DrawCanvas
              onSubmit={(drawing) => {
                const { pages } = savePage({ code: result.code, page: result.page, fortune: "", kind: "blank", savedAt: new Date().toISOString(), drawing });
                setCount(pages.length);
                // TODO(backend): POST the drawing to /api/blank-page for moderation
                setResult({ status: "valid", page: result.page, code: result.code, fortune: "(you wrote this one)" });
                setTimeout(() => setFlipped(true), 120);
              }}
            />
          </div>
        )}

        {result?.status === "invalid" && (
          <div className="flex flex-col items-center py-10 text-center">
            <Pip pose="shrug" className="w-40" alt="Pip shrugging" />
            <p className="font-hand mt-6 text-3xl uppercase">Hmm, that page isn&rsquo;t in our book.</p>
            <p className="font-hand text-2xl uppercase text-[var(--pink-pen-text)]">Check the code?</p>
          </div>
        )}

        {result?.status === "duplicate" && (
          <div className="flex flex-col items-center py-10 text-center">
            <Pip pose="wave" className="w-36" />
            <p className="font-hand mt-6 text-3xl uppercase">That page is already taped in.</p>
            <Link href="/storybook" className="font-hand mt-2 text-2xl uppercase text-blue-pen underline decoration-wavy underline-offset-4">
              See your Storybook
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
