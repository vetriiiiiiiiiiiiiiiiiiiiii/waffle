import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { Album } from "@/components/storybook/Album";

export const metadata: Metadata = {
  title: "Your Storybook",
  description: "Every Today's Page you collect, taped into one album. 365 pages to find. Ten pages and the next chapter is free.",
  robots: { index: false },
};

export default function StorybookPage() {
  return (
    <>
      <PageIntro kicker="Your collection" title="Your storybook." highlight="#D3C4EE" pip="wave" pipNote="365 pages. no rush.">
        Every page you stamp gets taped in here. Some pages come back like reruns. One in about five hundred is golden. Empty slots are
        pages still out there, waiting in a pack.
      </PageIntro>
      <Album />
    </>
  );
}
