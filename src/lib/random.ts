/** Deterministic randomness so server and client draw the same wobble. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seeded(key: string) {
  return mulberry32(hashString(key));
}

export const PASTELS = ["#F6D776", "#F4B6C2", "#BFE3D0", "#B9D4F1", "#D3C4EE"] as const;

/** Round path numbers so server (Node) and browser Math agree to the last digit. */
export function roundPath(d: string) {
  return d.replace(/-?\d+\.\d+(e-?\d+)?/g, (n) => {
    const v = Math.round(Number(n) * 10) / 10;
    return Object.is(v, -0) ? "0" : String(v);
  });
}
