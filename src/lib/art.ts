import sizes from "@/data/art.json";

export type ArtKey = keyof typeof sizes;

/** Path + intrinsic size of a piece of brand art in /public/art. */
export function art(key: ArtKey) {
  const [w, h] = sizes[key];
  return { src: `/art/${key}.webp`, line: `/art/${key}-line.webp`, w, h };
}
