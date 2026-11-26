"use client";
import { forwardRef } from "react";
import { art } from "@/lib/art";
import { TodaysPageCard } from "@/components/draw/TodaysPageCard";

/* eslint-disable @next/next/no-img-element */

/** 1080×1920 story image, rendered off-screen and captured with html-to-image. */
export const ShareCard = forwardRef<HTMLDivElement, { page: number; fortune: string; code: string; golden?: boolean }>(function ShareCard(
  { page, fortune, code, golden },
  ref,
) {
  const logo = art("logo/wordmark");
  const tag = art("logo/tagline");
  const pip = art("pip/draw");
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#FBF6EC",
        backgroundImage: "url(/textures/paper.png)",
        backgroundSize: "128px 128px",
        padding: "120px 110px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 60,
        color: "#26211D",
      }}
    >
      <img src={logo.src} alt="" width={760} style={{ height: "auto" }} />
      <img src={tag.src} alt="" width={460} style={{ height: "auto", marginTop: -30 }} />
      <div style={{ width: 820, transform: "rotate(-3deg)", position: "relative", marginTop: 30 }}>
        <span className="tape" style={{ top: -18, left: 360, width: 150, height: 40 }} />
        <TodaysPageCard page={page} fortune={fortune} code={code} golden={golden} big style={{ minHeight: 820, padding: "70px 60px 50px" }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: "auto" }}>
        <img src={pip.src} alt="" width={200} />
        <p className="font-hand" style={{ fontSize: 46, textTransform: "uppercase", color: "#B23D5B", lineHeight: 1.1, transform: "rotate(-4deg)" }}>
          my page today.
          <br />
          what&rsquo;s yours?
        </p>
      </div>
    </div>
  );
});
