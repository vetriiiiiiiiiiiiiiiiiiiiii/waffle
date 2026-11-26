/** Today's Page codes look like WS-0427-K7M. */
export const CODE_RE = /^WS-(\d{4})-([A-Z0-9]{3})$/;

export function formatCode(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // drop any number of leading "WS" (the field is pre-filled, people type it again anyway)
  const body = clean.replace(/^(WS)+/, "");
  const digits = body.slice(0, 4).replace(/\D/g, "");
  if (digits.length < 4) return "WS-" + digits;
  const tail = body.slice(4, 7);
  return `WS-${digits}${body.length > 4 ? "-" + tail : ""}`;
}

export function randomCode(rand: () => number = Math.random, page?: number) {
  const n = page ?? 1 + Math.floor(rand() * 365);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 3; i++) tail += alphabet[Math.floor(rand() * alphabet.length)];
  return `WS-${String(n).padStart(4, "0")}-${tail}`;
}
