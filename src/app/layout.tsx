import type { Metadata, Viewport } from "next";
import { Gelasio, Courier_Prime } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { BoilFilter, PaperGrain } from "@/components/draw/BoilFilter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CrayonCursor } from "@/components/site/CrayonCursor";

// Only the weights the site actually uses: fewer files on the critical path.
// Gaegu Bold, Latin only, self-hosted: Google serves it as ~100 Korean unicode-range chunks,
// which made plain A–Z text download 6+ files. One 17KB file instead.
const gaegu = localFont({ src: "./fonts/gaegu-latin-700-normal.woff2", weight: "700", variable: "--font-gaegu", display: "swap", fallback: ["Comic Sans MS", "cursive"] });
const gelasio = Gelasio({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-gelasio", display: "swap" });
const courier = Courier_Prime({ weight: "400", subsets: ["latin"], variable: "--font-courier", display: "swap", preload: false });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://wafflestory.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Waffle Story · Drawn Fresh Daily", template: "%s · Waffle Story" },
  description:
    "A waffle shop drawn by hand. Every square tells a story: a tear-off Today's Page in every pack, chapters instead of a menu, and a store you get to colour in.",
  keywords: ["waffles", "Waffle Story", "Today's Page", "Tiruchirappalli waffles", "Gen Z cafe"],
  openGraph: {
    type: "website",
    siteName: "Waffle Story",
    title: "Waffle Story · Drawn Fresh Daily",
    description: "Every square tells a story. A waffle is graph paper you can eat.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EC",
  width: "device-width",
  initialScale: 1,
};

/** Runs before first paint: enables draw-on initial states only when motion is welcome. */
const motionFlag = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion')}}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${gaegu.variable} ${gelasio.variable} ${courier.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        <BoilFilter />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <PaperGrain />
        <CrayonCursor />
        <SmoothScroll />
      </body>
    </html>
  );
}
