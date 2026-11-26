import fridge from "@/data/fridge.json";
import { FridgeWall } from "@/components/draw/FridgeWall";
import { HandTitle } from "@/components/draw/HandTitle";
import { RoughButton } from "@/components/draw/RoughButton";

export function FridgePreview() {
  return (
    <section aria-labelledby="fridge-title" className="relative mx-auto max-w-[1280px] px-5 py-24 md:px-8">
      <div className="relative bg-[#E4F2EA] px-6 py-12 md:px-12" style={{ borderRadius: "28px 22px 30px 18px / 20px 30px 18px 28px", outline: "2px solid #26211D", outlineOffset: "-2px" }}>
        <span className="absolute right-6 top-24 hidden h-28 w-3 rounded-full border-2 border-pencil bg-[#FFFDF7] md:block" aria-hidden="true" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <HandTitle as="h2" className="text-5xl md:text-6xl" highlight="#B9D4F1" salt="fridge" id="fridge-title">
              {"The fridge wall."}
            </HandTitle>
            <p className="mt-3 max-w-xl text-lg">Drawings from people who came in for a waffle and left a page behind. The best get the Day Stamp, slightly crooked.</p>
          </div>
          <RoughButton href="/fridge-wall#pin" fill="#F6D776" seedKey="pin-yours">
            Pin your drawing
          </RoughButton>
        </div>
        <FridgeWall items={fridge.slice(0, 8)} className="mt-12" />
      </div>
    </section>
  );
}
