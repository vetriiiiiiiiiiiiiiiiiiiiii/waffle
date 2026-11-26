import { ArtReveal, type Box } from "@/components/draw/ArtReveal";
import { Boil } from "@/components/draw/Boil";
import { RoughButton } from "@/components/draw/RoughButton";
import { TodaysPageCard } from "@/components/draw/TodaysPageCard";
import { art } from "@/lib/art";

/* Letter boxes inside logo/wordmark.webp (1042×512), in drawing order. The O is separate. */
const LETTERS: Box[] = [
  [8, 22, 244, 262], // W
  [232, 22, 196, 262], // A
  [402, 22, 160, 262], // F
  [548, 22, 154, 262], // F
  [688, 22, 144, 262], // L
  [818, 22, 196, 262], // E
  [106, 276, 168, 234], // S
  [258, 276, 174, 234], // T
  [592, 276, 170, 234], // R
  [748, 276, 170, 234], // Y
];
const O = { cx: 513, cy: 403, r: 86 };
const W = 1042;
const H = 512;
const gridT = (i: number) => ({ ["--delay" as string]: `${(1.75 + i * 0.06).toFixed(2)}s`, ["--dur" as string]: "0.35s" });
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/**
 * The hero draws itself with CSS keyframes from the very first paint (no JS on the
 * critical path): letters line-then-colour, the O's grid, Pip, the card, the CTAs.
 * Timings live in globals.css under "Hero sequence".
 */
export function Hero() {
  const oWaffle = art("logo/o-waffle");
  const pip = art("pip/pip-logo");

  return (
    <section aria-labelledby="hero-title" className="relative mx-auto max-w-[1280px] overflow-x-clip px-5 pb-20 pt-4 md:px-8 md:pt-10">
      <h1 id="hero-title" className="sr-only">
        Waffle Story. Drawn fresh daily.
      </h1>
      <p className="font-hand text-lg uppercase tracking-wide text-[var(--pink-pen-text)]" aria-hidden="true">
        Chapter one · a waffle shop drawn by hand
      </p>

      <div className="mt-4 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── the logo ── */}
        <div>
          <Boil className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, animationDelay: "3.2s" }}>
            <ArtReveal
              k="logo/wordmark"
              alt="Waffle Story, in puffy bubble letters, each letter a different crayon colour"
              regions={LETTERS}
              exclude={O}
              autoPlay={false}
              rows={5}
              priority
              css={{ start: 0, lineDur: 0.5, colourDur: 0.55, stagger: 0.11 }}
              className="absolute inset-0"
            />
            {/* the O is The Moon */}
            <div
              className="absolute"
              style={{ left: pct(O.cx - O.r, W), top: pct(O.cy - O.r, H), width: pct(O.r * 2, W), aspectRatio: "1" }}
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={oWaffle.src}
                alt=""
                className="o-wash absolute inset-0 h-full w-full"
                style={{ clipPath: "circle(49% at 50% 50%)" }}
              />
              <svg viewBox="0 0 100 100" className="o-grid art-reveal is-playing absolute inset-0 h-full w-full overflow-visible" fill="none" stroke="#26211D" strokeWidth="2.6" strokeLinecap="round">
                <path className="mask-path" style={gridT(0)} pathLength={1} strokeDasharray="1 1" d="M50 3 C 76 2, 98 24, 97 51 C 96 77, 74 98, 48 97 C 22 96, 3 75, 4 49 C 5 24, 26 4, 54 4" />
                {[30, 50, 70].map((v) => (
                  <path key={`v${v}`} className="mask-path" style={gridT(v / 20 - 0.5)} pathLength={1} strokeDasharray="1 1" d={`M${v} 12 C ${v + 1} 40, ${v - 1} 62, ${v} 89`} />
                ))}
                {[30, 50, 70].map((v) => (
                  <path key={`h${v}`} className="mask-path" style={gridT(v / 20 + 2.5)} pathLength={1} strokeDasharray="1 1" d={`M12 ${v} C 40 ${v - 1}, 62 ${v + 1}, 89 ${v}`} />
                ))}
              </svg>
            </div>
            {/* Pip, leaning on the Y */}
            <div
              className="absolute overflow-hidden"
              style={{ left: pct(912, W), top: pct(296, H), width: pct(pip.w, W), aspectRatio: `${pip.w} / ${pip.h}` }}
            >
              <div className="pip-pop h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pip.src} alt="Pip, a single waffle square holding a crayon, leaning on the Y" className="h-full w-full" />
              </div>
            </div>
          </Boil>
          <div className="mx-auto -mt-1 w-[58%] md:ml-[18%] md:mx-0">
            <ArtReveal k="logo/tagline" alt="Drawn fresh daily" autoPlay={false} rows={3} priority css={{ start: 1.9, lineDur: 0.6, colourDur: 0.3 }} />
          </div>

          <p className="mt-8 max-w-xl text-lg">
            Most waffle shops sell toppings. We sell a story, and the waffle is how you read it. Every pack hides a page you tear off, a
            fortune for your day, and a code for your Storybook.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <div className="hero-cta" style={{ ["--d" as string]: "1.1s" }}>
              <RoughButton href="/todays-page" fill="#F6D776" size="lg" seedKey="cta-read">
                Read today&rsquo;s page
              </RoughButton>
            </div>
            <div className="hero-cta" style={{ ["--d" as string]: "1.25s" }}>
              <RoughButton href="/menu" fill="#BFE3D0" fillStyle="hachure" size="lg" seedKey="cta-chapters">
                See the chapters
              </RoughButton>
            </div>
          </div>
        </div>

        {/* ── the waffle and today's page ── */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <Boil style={{ animationDelay: "3.2s" }}>
            <ArtReveal
              k="waffles/moon"
              alt="The Moon: a round golden waffle with chocolate, strawberries and a pat of butter, cut into four"
              autoPlay={false}
              rows={8}
              // not priority: fetched right after hydration so it never competes with the wordmark (LCP)
              css={{ start: 1, lineDur: 1.1, colourDur: 1.2 }}
            />
          </Boil>
          <div className="hero-card absolute -bottom-16 right-0 w-[62%] max-w-[300px] md:-right-10" style={{ transform: "rotate(7deg)" }}>
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-6deg]" aria-hidden="true" />
            <TodaysPageCard page={1} fortune="A small win is coming. Probably before lunch." code="WS-0001-SUN" doodle="sun" />
          </div>
          {/* doodles in the margin */}
          {[
            { k: "doodles/star-a", c: "left-[4%] top-[-6%] w-10" },
            { k: "doodles/star-b", c: "right-[2%] top-[4%] w-8" },
            { k: "doodles/heart", c: "left-[-4%] bottom-[8%] w-8" },
          ].map((d, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={d.k} src={art(d.k as "doodles/heart").src} alt="" aria-hidden="true" style={{ ["--d" as string]: `${3.1 + i * 0.09}s` }} className={`hero-doodle absolute ${d.c}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
