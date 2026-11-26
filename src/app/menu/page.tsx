import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { MenuBook } from "@/components/menu/MenuBook";

export const metadata: Metadata = {
  title: "The Chapters",
  description: "Six chapters, footnotes and bonus chapters. Every chapter comes as The Page (for walking) or The Moon (for sharing). Eggless batter.",
};

export default function MenuPage() {
  return (
    <>
      <PageIntro kicker="The menu, but make it a book" title="The chapters." pip="draw" pipNote="read one. order the sequel.">
        Every chapter comes as <strong>The Page</strong> (rectangular, for walking) or <strong>The Moon</strong> (round, cut in four, for
        sharing). Drinks are footnotes. Seasonal specials are bonus chapters. No spoilers. Just syrup.
      </PageIntro>
      <MenuBook />
    </>
  );
}
