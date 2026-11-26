"use client";
import { useRef, useState, type ReactNode, type PointerEvent as RPointerEvent, type KeyboardEvent } from "react";
import { seeded } from "@/lib/random";
import { RoughFrame } from "./RoughFrame";

const THRESHOLD = 130; // px of downward drag that rips it all the way

/** jagged tear line across the width */
function tearPath(key: string, w = 100) {
  const r = seeded(key);
  let d = "M0 5";
  for (let x = 2; x <= w; x += 2) d += ` L${x} ${(5 + (r() - 0.5) * 7).toFixed(1)}`;
  return d;
}

function scrap(x: number, y: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = document.createElement("span");
  const s = 4 + Math.random() * 7;
  Object.assign(el.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: `${s}px`,
    height: `${s * (0.6 + Math.random() * 0.6)}px`,
    background: Math.random() > 0.3 ? "#FFFDF7" : "#B9D4F1",
    border: "1px solid #26211D",
    clipPath: "polygon(0 10%, 90% 0, 100% 80%, 15% 100%)",
    pointerEvents: "none",
    zIndex: "75",
  });
  document.body.appendChild(el);
  const dx = (Math.random() - 0.5) * 120;
  const dy = 60 + Math.random() * 140;
  el.animate(
    [
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${(Math.random() - 0.5) * 540}deg)`, opacity: 0 },
    ],
    { duration: 700 + Math.random() * 400, easing: "steps(9, end)", fill: "forwards" },
  ).onfinish = () => el.remove();
}

/**
 * The perforated strip. Grab the tab and pull down: the perforation rips
 * left to right as you drag, paper scraps fly, and the flap drops away.
 * Keyboard: focus the tab, press Enter / Space (or ↓ to tear bit by bit).
 */
export function TearStrip({
  flap,
  children,
  onTorn,
  tornKey,
  label = "Pull to tear",
}: {
  flap: ReactNode;
  children: ReactNode;
  onTorn: () => void;
  tornKey: string;
  label?: string;
}) {
  const [pull, setPull] = useState(0);
  const [torn, setTorn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const progress = Math.min(1, pull / THRESHOLD);

  const emitAt = (p: number) => {
    const box = lineRef.current?.getBoundingClientRect();
    if (!box) return;
    scrap(box.left + box.width * p, box.top + 4);
  };

  const finish = () => {
    setTorn(true);
    for (let k = 0; k < 10; k++) setTimeout(() => emitAt(Math.random()), k * 30);
    onTorn();
  };

  const onDown = (e: RPointerEvent) => {
    if (torn) return;
    start.current = e.clientY;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    if (start.current == null || torn) return;
    const d = Math.max(0, e.clientY - start.current);
    setPull(d);
    const p = Math.min(1, d / THRESHOLD);
    if (p - last.current > 0.06) {
      emitAt(p);
      last.current = p;
    }
  };
  const onUp = () => {
    if (start.current == null) return;
    start.current = null;
    setDragging(false);
    last.current = 0;
    if (pull >= THRESHOLD * 0.85) finish();
    else setPull(0);
  };
  const onKey = (e: KeyboardEvent) => {
    if (torn) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      let p = pull;
      const id = setInterval(() => {
        p += THRESHOLD / 8;
        setPull(p);
        emitAt(Math.min(1, p / THRESHOLD));
        if (p >= THRESHOLD) {
          clearInterval(id);
          finish();
        }
      }, 60);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const p = pull + THRESHOLD / 4;
      setPull(p);
      emitAt(Math.min(1, p / THRESHOLD));
      if (p >= THRESHOLD) finish();
    }
  };

  const dashed = "M0 5 L100 5";
  const jag = tearPath(tornKey);

  return (
    <div className="relative">
      {/* what's inside */}
      <div className="relative">{children}</div>

      {/* the flap that covers it */}
      {!torn && (
        <div
          className="absolute inset-0 z-10"
          style={{
            transform: `translateY(${pull * 0.55}px) rotate(${progress * 2.5}deg)`,
            transformOrigin: "0% 0%",
            transition: dragging ? "none" : "transform .35s steps(5,end)",
          }}
        >
          {/* perforation, ripping from left to right */}
          <div ref={lineRef} className="absolute -top-2 left-0 right-0 h-3" aria-hidden="true">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <path d={dashed} stroke="#26211D" strokeWidth="1.4" strokeDasharray="2 1.6" fill="none" vectorEffect="non-scaling-stroke" />
              <clipPath id={`rip-${tornKey}`}>
                <rect x="0" y="-5" width={progress * 100} height="20" />
              </clipPath>
              <path d={jag} stroke="#26211D" strokeWidth="1.6" fill="none" clipPath={`url(#rip-${tornKey})`} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          {flap}
          <button
            type="button"
            className="font-hand absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 touch-none select-none px-5 py-2 text-lg uppercase"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
            aria-label="Pull to tear: drag the tab down, or press Enter, to open today's page"
            style={{ cursor: "grab" }}
          >
            <RoughFrame shape="label" fill="#F4B6C2" fillStyle="zigzag" seedKey="tear-tab" />
            <span className="relative whitespace-nowrap">↓ {label} ↓</span>
          </button>
        </div>
      )}
      {torn && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{ animation: "flap-fall .7s steps(8,end) forwards", transformOrigin: "10% 0%" }}
        >
          {flap}
        </div>
      )}
      <style>{`@keyframes flap-fall{to{transform:translateY(120%) rotate(18deg);opacity:0}}`}</style>
    </div>
  );
}
