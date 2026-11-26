import { Hero } from "@/components/home/Hero";
import { SunWasWaffle } from "@/components/home/SunWasWaffle";
import { Manifesto } from "@/components/home/Manifesto";
import { TwoWaffles } from "@/components/home/TwoWaffles";
import { ChaptersBook } from "@/components/home/ChaptersBook";
import { TodaysPageTeaser } from "@/components/home/TodaysPageTeaser";
import { UnfinishedStore } from "@/components/home/UnfinishedStore";
import { FridgePreview } from "@/components/home/FridgePreview";

export default function Home() {
  return (
    <>
      <Hero />
      <SunWasWaffle />
      <Manifesto />
      <TwoWaffles />
      <ChaptersBook />
      <TodaysPageTeaser />
      <UnfinishedStore />
      <FridgePreview />
    </>
  );
}
