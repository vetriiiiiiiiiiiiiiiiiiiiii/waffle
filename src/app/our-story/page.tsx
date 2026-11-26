import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { ArtReveal } from "@/components/draw/ArtReveal";
import { Boil } from "@/components/draw/Boil";
import { HandTitle } from "@/components/draw/HandTitle";
import { StickyNote, NotebookPage, TapedScrap } from "@/components/draw/Paper";
import { Manifesto } from "@/components/home/Manifesto";
import { RoughButton } from "@/components/draw/RoughButton";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Ask any kid to draw a happy day and you get the same picture. Look closer at the sun. It was always a waffle. The story of Waffle Story and Pip.",
};

const VISIT = [
  "You read the A-board fortune on the pavement and smile.",
  "You walk into a drawing. Half of it is coloured; half is waiting.",
  "You order a chapter, as The Page or The Moon.",
  "While it cooks, you colour your cup at the Book Counter.",
  "You tear open Today's Page and read your fortune out loud.",
  "You pin a doodle on the Fridge Wall and get it stamped.",
  "At home you stamp the code, and the page joins your Storybook.",
];

export default function OurStory() {
  return (
    <>
      <PageIntro kicker="Chapter one" title={"The sun was\nalways a waffle."} highlight="#F6D776" />

      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <TapedScrap tilt={-1.5} seedKey="story-drawing">
          <ArtReveal
            k="doodles/kid-drawing"
            alt="A child's crayon drawing of a house, a family holding hands and a sun criss-crossed with lines like a waffle"
            regions={[[80, 50, 440, 160], [100, 200, 400, 520], [490, 400, 470, 370], [370, 80, 470, 220], [0, 640, 1140, 140], [800, 20, 360, 360]]}
            rows={6}
          />
        </TapedScrap>
        <div className="space-y-5 text-lg">
          <p>Ask any kid to draw a happy day and you will get the same picture.</p>
          <p>
            A house with a triangle roof. A family holding hands, the smallest one at the end. Grass made of quick green zigzags. And up in
            the corner, a yellow circle, criss-crossed with lines, with rays sticking out of it.
          </p>
          <p className="font-hand text-3xl uppercase text-[var(--pink-pen-text)]">We always called it the sun. Look closer. It was always a waffle.</p>
          <p>
            Before we could write our names, we drew. Before we could cook, we begged for waffles. They were the first two things we were
            truly good at loving: crayons on a Saturday morning, and something warm and golden on a plate. Somewhere between the crayon box
            and the breakfast table the two got mixed up, and we never wanted to un-mix them.
          </p>
          <p>
            Waffle Story is a waffle shop drawn by hand. Not generated, not traced from a template, but drawn: a black pencil line, a wash of
            watercolour, a crayon that wanders a little outside the lines. It is for the kid you were and the person you are now, the one who
            still doodles in the margin of every lecture and every meeting.
          </p>
        </div>
      </section>

      <section aria-labelledby="pip-title" className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <Boil className="mx-auto w-[70%] max-w-[300px]">
          <ArtReveal k="pip/pip-big" alt="Pip: a single waffle square with arms, legs, rosy cheeks and a green crayon, waving" rows={5} />
        </Boil>
        <div>
          <HandTitle as="h2" id="pip-title" className="text-5xl" highlight="#F4B6C2" salt="pip">
            {"Meet Pip."}
          </HandTitle>
          <p className="mt-5 text-lg">
            Pip is a single waffle pocket who decided life on a grid was too square, hopped out, picked up a crayon and went looking for a
            story. Pip draws the doodle on every Today&rsquo;s Page, and turns up on sleeves, stickers and the shop roof.
          </p>
          <p className="mt-4 text-lg">
            Pip never sells anything. Pip only appears in drawings, with tiny handwritten notes: waving hello on the sleeve, asleep on The
            Moon box, waving goodbye on the receipt. If you spotted Pip, that was the point.
          </p>
        </div>
      </section>

      <section aria-labelledby="pillars-title" className="mx-auto max-w-[1280px] px-5 py-16 md:px-8">
        <HandTitle as="h2" id="pillars-title" className="text-5xl" highlight="#BFE3D0" salt="pillars">
          {"Not a waffle shop.\nA storybook you can eat."}
        </HandTitle>
        <ul className="mt-14 grid gap-12 md:grid-cols-3">
          {[
            { t: "Made by hand", c: "butter" as const, b: "Every line on every box, wall, cup and post is drawn by a person. We never clean up the wobble. If a machine could have made it, it isn't Waffle Story." },
            { t: "A story a day", c: "strawberry" as const, b: "Every pack hides Today's Page: a doodle, a fortune and a code. The waffle feeds you; the page gives you something to talk about, collect and come back for." },
            { t: "Colour outside the lines", c: "mint" as const, b: "Cups, walls and sleeves arrive half-finished. You colour them in, pin up drawings and write fortunes. The brand is drawn together, not handed down." },
          ].map((p, i) => (
            <li key={p.t}>
              <StickyNote colour={p.c} tilt={[-2, 1.5, -1][i]} seedKey={`pillar-${i}`} className="min-h-[300px]">
                <h3 className="font-hand text-3xl uppercase leading-tight">{p.t}</h3>
                <p className="mt-3 text-base">{p.b}</p>
              </StickyNote>
            </li>
          ))}
        </ul>
      </section>

      <Manifesto />

      <section aria-labelledby="visit-title" className="mx-auto max-w-[900px] px-4 py-10 md:px-8">
        <NotebookPage seedKey="visit" tilt={0.4}>
          <h2 id="visit-title" className="font-hand text-4xl uppercase">A visit, page by page.</h2>
          <ol className="mt-4 space-y-[0.32rem] text-lg leading-[1.9rem]">
            {VISIT.map((v, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-hand w-6 shrink-0 text-xl text-[var(--pink-pen-text)]">{i + 1}.</span>
                {v}
              </li>
            ))}
          </ol>
        </NotebookPage>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <RoughButton href="/menu" fill="#F6D776" seedKey="story-menu">
            Read one chapter
          </RoughButton>
          <RoughButton href="/stores" fill="#F4B6C2" fillStyle="hachure" seedKey="story-stores">
            Come colour with us
          </RoughButton>
        </div>
      </section>
    </>
  );
}
