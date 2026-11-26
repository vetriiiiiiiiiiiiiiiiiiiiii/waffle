import type { Metadata } from "next";
import stores from "@/data/stores.json";
import { PageIntro } from "@/components/site/PageIntro";
import { StoreFinder } from "@/components/stores/StoreFinder";

export const metadata: Metadata = {
  title: "Stores",
  description: "Find an Unfinished Store near you: a waffle shop that opens as a line drawing and gets coloured in by its neighbourhood, one part a month.",
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://wafflestory.example";

export default function StoresPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": stores.map((s) => ({
      "@type": ["Restaurant", "LocalBusiness"],
      "@id": `${SITE}/stores#${s.id}`,
      name: s.name,
      servesCuisine: ["Waffles", "Desserts", "Coffee"],
      priceRange: "₹₹",
      url: `${SITE}/stores#${s.id}`,
      image: `${SITE}/opengraph-image.jpg`,
      telephone: s.phone,
      address: { "@type": "PostalAddress", streetAddress: s.street, addressLocality: s.city, postalCode: s.postcode, addressRegion: s.region, addressCountry: "IN" },
      geo: { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng },
      openingHours: `Mo-Su ${s.hours.replace("–", "-")}`,
      brand: { "@type": "Brand", name: "Waffle Story", slogan: "Drawn Fresh Daily" },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageIntro kicker="The Unfinished Stores" title="Find a store." highlight="#F4B6C2" pip="wave" pipNote="i'm on the roof">
        Every store opens as a black line drawing and gets coloured in by its neighbourhood, one part a month. No two look the same. Come
        see what changed.
      </PageIntro>
      <StoreFinder />
    </>
  );
}
