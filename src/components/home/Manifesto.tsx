import { HandTitle } from "@/components/draw/HandTitle";
import { NotebookPage } from "@/components/draw/Paper";

export const MANIFESTO = [
  "We believe a waffle is graph paper you can eat.",
  "We believe every square can hold a story.",
  "We believe in black lines that wobble, and colour that misses the line a little.",
  "We believe the best things are made by hand, and you can tell.",
  "We believe in tiny daily rituals: one page, one fortune, one good thing a day.",
  "We believe nobody outgrows crayons. We just stop being handed them.",
  "So we're handing them back.",
];
const HL = ["#F6D776", "#F4B6C2", "#BFE3D0", "#B9D4F1", "#D3C4EE", "#F6D776", "#F4B6C2"];

/** Written in pen, one line at a time, each underlined with a sweep of crayon. */
export function Manifesto() {
  return (
    <section aria-labelledby="manifesto-title" className="mx-auto max-w-[1100px] px-4 py-24 md:px-8">
      <NotebookPage seedKey="manifesto" tilt={-0.6} className="md:pl-28 md:pr-16 md:py-14">
        <p id="manifesto-title" className="font-hand text-xl uppercase text-[var(--pink-pen-text)]">
          The manifesto · page 04
        </p>
        <ol className="mt-4 space-y-5 md:space-y-6">
          {MANIFESTO.map((line, i) => (
            <li key={i}>
              <HandTitle
                as="p"
                className={`${i === MANIFESTO.length - 1 ? "text-4xl text-[var(--pink-pen-text)] md:text-5xl" : "text-[1.7rem] md:text-[2.3rem]"} !leading-[1.15]`}
                highlight={HL[i]}
                salt={`m${i}`}
              >
                {line}
              </HandTitle>
            </li>
          ))}
        </ol>
      </NotebookPage>
    </section>
  );
}
