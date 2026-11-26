import fortunes from "@/data/fortunes.json";
import { CODE_RE } from "@/lib/code";
import { hashString } from "@/lib/random";

/**
 * MOCK code redemption for Today's Page.
 *
 * TODO(backend):
 *  - look the code up in the real pages table (code → page number, fortune, rarity, printed batch)
 *  - reject codes already redeemed by another account (one code, one Storybook)
 *  - rate-limit by IP + account to stop code guessing
 *  - for GOLDEN pages, issue a voucher (two waffles) and return its id
 *  - for BLANK pages, accept the drawing upload (POST /api/blank-page) into the moderation queue
 *
 * Demo rules (so the site can be explored without a backend):
 *  WS-0427-K7M → everyday page     WS-0365-GLD → golden page
 *  WS-0109-BLK → blank page        page numbers outside 0001–0365 → not in the book
 *  any other well-formed code: ~1 in 500 golden, ~1 in 120 blank, the rest everyday
 */
export async function POST(req: Request) {
  let code = "";
  try {
    const body = await req.json();
    code = String(body?.code ?? "").toUpperCase().trim();
  } catch {
    return Response.json({ status: "invalid", reason: "bad-request" }, { status: 400 });
  }
  const m = CODE_RE.exec(code);
  if (!m) return Response.json({ status: "invalid", reason: "format" });
  const page = Number(m[1]);
  if (page < 1 || page > 365) return Response.json({ status: "invalid", reason: "not-in-book" });

  const h = hashString(code);
  const tail = m[2];
  const status = tail === "GLD" || h % 500 === 0 ? "golden" : tail === "BLK" || h % 120 === 7 ? "blank" : "valid";
  const fortune = status === "blank" ? "" : fortunes[page % fortunes.length];
  const rerun = status === "valid" && page % 7 === 0;
  return Response.json({ status, page, fortune, rerun, code });
}
