import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { FridgeGallery } from "@/components/fridge/FridgeGallery";

export const metadata: Metadata = {
  title: "The Fridge Wall",
  description: "Drawings pinned up by people who came in for a waffle. Pin yours. The best get the Day Stamp and might become next month's Today's Page.",
};

export default function FridgeWallPage() {
  return (
    <>
      <PageIntro kicker="Customer drawings, pinned with magnets" title="The fridge wall." highlight="#B9D4F1" pip="draw" pipNote="mine's the wonky one">
        Just like the fridge at home. Every drawing here was made by someone who came in for a waffle and left a page behind. Staff picks get
        the Day Stamp, slightly crooked.
      </PageIntro>
      <FridgeGallery />
    </>
  );
}
