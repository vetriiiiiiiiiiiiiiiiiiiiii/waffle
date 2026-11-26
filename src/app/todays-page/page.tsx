import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { Redeem } from "@/components/redeem/Redeem";

export const metadata: Metadata = {
  title: "Today's Page",
  description: "Found a code on your tear-off page? Stamp it into your Storybook. Collect 10 pages and the next chapter is free.",
};

export default function TodaysPage() {
  return (
    <>
      <PageIntro kicker="Found a code on your page?" title="Today's page." highlight="#BFE3D0">
        Every pack hides a tear-off page with a code like <span className="font-type">WS-0427-K7M</span>. Write it on the label, stamp it,
        and the page goes into your Storybook. Ten pages and the next chapter is on us.
      </PageIntro>
      <Redeem />
    </>
  );
}
