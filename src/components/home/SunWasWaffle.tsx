"use client";
import { useEffect, useRef, useState } from "react";
import { ArtReveal, type ArtRevealHandle, type Box } from "@/components/draw/ArtReveal";
import { HandTitle } from "@/components/draw/HandTitle";
import { Arrow } from "@/components/draw/Doodles";
import { RoughButton } from "@/components/draw/RoughButton";
import { art } from "@/lib/art";
import { loadGsap } from "@/lib/motion";

/* kid-drawing.webp is 1264×787. Drawn in the order a six-year-old would. */
const STROKES: Box[] = [
  [80, 50, 440, 160], // MY FAMILY, BY ANU
  [100, 200, 400, 520], // house
  [490, 400, 470, 370], // family
  [370, 80, 470, 220], // clouds and birds
  [0, 640, 1140, 140], // grass
  [800, 20, 360, 360], // the sun
];
const SUN = { x: 980, y: 196, r: 104 };
const W = 1264;
const H = 787;

const COPY = [
  "Ask any kid to draw a happy day and you get the same picture.",
  "A house. A family holding hands, the smallest one at the end. Grass made of quick green zigzags.",
  "And up in the corner, a yellow circle, criss-crossed with lines. We called it the sun.",
  "Look closer.",
  "It was always a waffle.",
];

export function SunWasWaffle() {
  const section = useRef<HTMLElement>(null);
  const drawing = useRef<ArtRevealHandle>(null);
  const [zoomed, setZoomed] = useState(false);
  const moon = art("waffles/moon");

  useEffect(() => {
    const el = section.current;
    if (!el || !document.documentElement.classList.contains("js-motion")) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    // GSAP is only fetched when this scene is about to scroll into view
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        loadGsap().then(({ gsap }) => {
          if (cancelled) return;
          revert = setup(gsap);
        });
      },
      { rootMargin: "1200px 0px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      revert?.();
    };

    function setup(gsap: typeof import("gsap").gsap) {
    if (!el) return;
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(el);

    mm.add("(min-width: 900px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=260%", pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      const d = drawing.current?.timeline(gsap, { lineDur: 1, colourDur: 0.8, stagger: 0.45 });
      if (d) tl.add(d.play(), 0);
      tl.fromTo(q(".swc-line"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.55, duration: 0.3, ease: "steps(5)" }, 0.2);
      tl.fromTo(q(".look-closer"), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "steps(3)" }, ">-0.6");
      tl.fromTo(q(".look-closer path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5 }, "<");
      // the camera leans in
      tl.to(q(".swc-camera"), { scale: 4.2, duration: 1.6, ease: "power2.inOut" }, ">+0.2");
      tl.to(q(".look-closer"), { opacity: 0, duration: 0.2 }, "<");
      tl.to(q(".swc-tape"), { opacity: 0, duration: 0.2 }, "<");
      // crayon sun → toast waffle
      tl.fromTo(
        q(".swc-waffle"),
        { opacity: 0, rotate: -40, scale: 0.92 },
        { opacity: 1, rotate: 0, scale: 1, duration: 0.9, ease: "steps(9)" },
        "<+0.9",
      );
      tl.to({}, { duration: 0.4 });
      return () => tl.kill();
    });

    mm.add("(max-width: 899px)", () => {
      const d = drawing.current?.timeline(gsap, { lineDur: 0.7, colourDur: 0.6, stagger: 0.3 });
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            d?.play();
            gsap.fromTo(q(".swc-line"), { opacity: 0 }, { opacity: 1, stagger: 0.25, duration: 0.3, ease: "steps(4)" });
            io.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        d?.kill();
      };
    });
    return () => mm.revert();
    }
  }, []);

  return (
    <section ref={section} aria-labelledby="sun-title" className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[100svh] max-w-[1280px] items-center gap-10 px-5 py-16 md:px-8 min-[900px]:grid-cols-[1.2fr_0.8fr]">
        {/* camera frame */}
        <div className="relative">
          <div className="look-closer pointer-events-none absolute -top-12 z-10 flex items-end gap-1" style={{ left: `${((SUN.x - 230) / W) * 100}%` }} aria-hidden="true">
            <span className="font-hand -rotate-6 text-2xl uppercase text-pink-pen">Look closer</span>
            <Arrow className="h-12 w-16 translate-y-5 [&_path]:[stroke-dasharray:1_1]" />
          </div>
          <div className="relative overflow-hidden bg-[#FFFDF7] p-2 shadow-none" style={{ transform: "rotate(-1.5deg)" }}>
            <span className="swc-tape tape -top-1 left-8 z-10 rotate-[-8deg]" aria-hidden="true" />
            <div
              className="swc-camera relative will-change-transform"
              style={{ transformOrigin: `${(SUN.x / W) * 100}% ${(SUN.y / H) * 100}%`, transform: zoomed ? "scale(4.2)" : undefined, transition: "transform .8s steps(8)" }}
            >
              <ArtReveal
                ref={drawing}
                k="doodles/kid-drawing"
                alt="A child's crayon drawing titled My Family, by Anu, 6: a lilac house with a pink roof, a family of three holding hands on green grass, and in the corner a sun criss-crossed with lines like a waffle"
                regions={STROKES}
                autoPlay={false}
                rows={6}
              />
              {/* the sun, read properly */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={moon.src}
                alt=""
                loading="lazy"
                aria-hidden="true"
                className="swc-waffle absolute"
                style={{
                  left: `${((SUN.x - SUN.r * 1.02) / W) * 100}%`,
                  top: `${((SUN.y - SUN.r * 1.02) / H) * 100}%`,
                  width: `${((SUN.r * 2.04) / W) * 100}%`,
                  opacity: zoomed ? 1 : 0,
                  transition: "opacity .6s steps(6)",
                }}
              />
            </div>
          </div>
          <div className="mt-6 min-[900px]:hidden">
            <RoughButton onClick={() => setZoomed((z) => !z)} fill="#F4B6C2" size="sm" seedKey="look-closer">
              {zoomed ? "Zoom back out" : "Look closer"}
            </RoughButton>
          </div>
        </div>

        <div>
          <HandTitle as="h2" className="text-5xl md:text-6xl" highlight="#F6D776" salt="sun" id="sun-title">
            {"The sun was\nalways a waffle."}
          </HandTitle>
          <div className="mt-8 space-y-4 text-lg">
            {COPY.map((line, i) => (
              <p key={i} className={`swc-line ${i >= 3 ? "font-hand text-3xl uppercase text-[var(--pink-pen-text)]" : ""}`}>
                {line}
              </p>
            ))}
          </div>
          <p className="font-hand mt-8 text-2xl uppercase text-blue-pen">Every square tells a story.</p>
        </div>
      </div>
    </section>
  );
}
