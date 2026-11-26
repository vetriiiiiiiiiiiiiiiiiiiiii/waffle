import type { Metadata } from "next";
import { Pip } from "@/components/draw/Pip";
import { RoughButton } from "@/components/draw/RoughButton";
import { HandTitle } from "@/components/draw/HandTitle";

export const metadata: Metadata = { title: "Page coloured outside the lines" };

/** Pip drew this page, then rubbed it out. */
export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-16 text-center">
      <div className="ruled relative w-full max-w-[560px] px-10 py-14" style={{ transform: "rotate(-1.5deg)" }}>
        <svg viewBox="0 0 400 260" className="mx-auto h-auto w-full" role="img" aria-label="A page Pip drew and then rubbed out: faint pencil smudges and eraser crumbs">
          <g opacity="0.22" stroke="#26211D" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M60 200 L60 120 L130 70 L200 120 L200 200 Z" />
            <path d="M250 90 C 270 60, 320 60, 330 95 C 345 130, 300 150, 270 140" />
            <path d="M40 220 C 120 210, 240 230, 360 215" />
          </g>
          {/* eraser rubs */}
          {[[70, 130, 120], [230, 80, 130], [90, 200, 260]].map(([x, y, w], i) => (
            <path key={i} d={`M${x} ${y} l${w} -8 l-${w - 10} 18 l${w - 4} -6 l-${w - 20} 16`} stroke="#FBF6EC" strokeWidth="16" strokeLinecap="round" fill="none" opacity=".95" />
          ))}
          {[[150, 236], [170, 242], [210, 238], [240, 246], [120, 244]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q3 -4 7 -1 q2 4 -3 5 z`} fill="#F4B6C2" stroke="#26211D" strokeWidth="1" />
          ))}
        </svg>
        <div className="absolute -bottom-10 -right-6 w-32 rotate-6">
          <Pip pose="shrug" alt="Pip holding a crayon, looking a bit sorry" />
        </div>
      </div>
      <HandTitle as="h1" className="mt-16 text-4xl md:text-6xl" highlight="#F4B6C2" play="css">
        {"This page got coloured\noutside the lines."}
      </HandTitle>
      <p className="mt-5 text-lg">Pip drew it, didn&rsquo;t like it, and rubbed it out. Happens to the best of us.</p>
      <RoughButton href="/" className="mt-8" fill="#F6D776" size="lg" seedKey="404-home">
        Back to the first page
      </RoughButton>
    </section>
  );
}
