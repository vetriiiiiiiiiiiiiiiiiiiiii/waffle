"use client";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import fortunes from "@/data/fortunes.json";
import { HandTitle } from "@/components/draw/HandTitle";
import { TearStrip } from "@/components/draw/TearStrip";
import { TodaysPageCard } from "@/components/draw/TodaysPageCard";
import { RoughButton } from "@/components/draw/RoughButton";
import { Pip } from "@/components/draw/Pip";
import { randomCode } from "@/lib/code";
import { ShareCard } from "./ShareCard";

type Draw = { page: number; fortune: string; code: string; doodle: "sun" | "star" | "heart" };

function pick(): Draw {
  const i = Math.floor(Math.random() * fortunes.length);
  const page = 1 + Math.floor(Math.random() * 365);
  return { page, fortune: fortunes[i], code: randomCode(Math.random, page), doodle: (["sun", "star", "heart"] as const)[i % 3] };
}

/** The flap: a little notebook sleeve with its name label. */
function Flap() {
  return (
    <div className="ruled relative h-full w-full px-6 pt-10" style={{ backgroundColor: "#FFFDF7" }}>
      <p className="font-type text-center text-[0.7rem] uppercase tracking-wider">Tear here · today&rsquo;s page inside</p>
      <div className="relative mx-auto mt-6 w-fit border-2 border-pencil px-5 py-3 [border-radius:14px_8px_16px_9px/9px_16px_8px_14px]">
        <p className="font-hand text-xl uppercase">
          Name: <span className="text-blue-pen underline">you</span>
        </p>
        <p className="font-hand text-xl uppercase">
          Class: <span className="text-blue-pen underline">Gen Z</span>
        </p>
        <p className="font-hand text-xl uppercase">
          Subject: <span className="text-blue-pen underline">Waffles</span>
        </p>
      </div>
      <p className="font-hand mt-8 text-center text-4xl uppercase">The page</p>
      <p className="font-hand mt-2 text-center text-lg uppercase text-[var(--pink-pen-text)]">no spoilers. just syrup.</p>
    </div>
  );
}

export function TodaysPageTeaser() {
  const [draw, setDraw] = useState<Draw | null>(null);
  const [round, setRound] = useState(0);
  const [sharing, setSharing] = useState<"idle" | "busy" | "done">("idle");
  const shareRef = useRef<HTMLDivElement>(null);

  const onTorn = useCallback(() => setDraw(pick()), []);

  const share = async () => {
    if (!draw || !shareRef.current) return;
    setSharing("busy");
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(shareRef.current, { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true });
      if (!blob) throw new Error("no image");
      const file = new File([blob], `waffle-story-page-${draw.page}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "My Today's Page", text: draw.fortune });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
      setSharing("done");
    } catch {
      setSharing("idle");
    }
  };

  return (
    <section aria-labelledby="tp-title" className="mx-auto max-w-[1280px] px-5 py-24 md:px-8">
      <div className="grid items-center gap-14 md:grid-cols-[1fr_1fr]">
        <div>
          <HandTitle as="h2" className="text-5xl md:text-6xl" highlight="#BFE3D0" salt="tp" id="tp-title">
            {"Today's page."}
          </HandTitle>
          <p className="mt-5 max-w-lg text-lg">
            Every pack has a page you tear off: a Pip doodle, one line about your day, and a code. There are 365 pages. Some come back, like
            cartoon reruns. About one in five hundred is golden.
          </p>
          <p className="font-hand mt-5 text-2xl uppercase text-blue-pen">Go on. Pull the tab.</p>
          <Pip pose="draw" className="mt-8 w-28" note="i drew this one" />
        </div>

        <div className="mx-auto w-full max-w-[360px]">
          <div aria-live="polite" className="sr-only">
            {draw ? `Your page: ${draw.fortune}` : ""}
          </div>
          <TearStrip key={round} tornKey={`r${round}`} onTorn={onTorn} flap={<Flap />}>
            <div className="min-h-[430px] rotate-1">
              {draw ? (
                <TodaysPageCard page={draw.page} fortune={draw.fortune} code={draw.code} doodle={draw.doodle} className="min-h-[430px]" />
              ) : (
                <div className="ruled min-h-[430px]" aria-hidden="true" />
              )}
            </div>
          </TearStrip>
          {draw && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <RoughButton onClick={share} disabled={sharing === "busy"} fill="#F4B6C2" size="sm" seedKey="share">
                {sharing === "busy" ? "Pip is sharpening the crayons…" : sharing === "done" ? "Shared. Nice page." : "Share my page"}
              </RoughButton>
              <RoughButton
                onClick={() => {
                  setDraw(null);
                  setSharing("idle");
                  setRound((r) => r + 1);
                }}
                fill="#B9D4F1"
                fillStyle="hachure"
                size="sm"
                seedKey="another"
              >
                Tear another
              </RoughButton>
            </div>
          )}
        </div>
      </div>
      {draw &&
        typeof document !== "undefined" &&
        createPortal(
          <div aria-hidden="true" style={{ position: "fixed", left: -20000, top: 0, pointerEvents: "none" }}>
            <ShareCard ref={shareRef} page={draw.page} fortune={draw.fortune} code={draw.code} />
          </div>,
          document.body,
        )}
    </section>
  );
}
