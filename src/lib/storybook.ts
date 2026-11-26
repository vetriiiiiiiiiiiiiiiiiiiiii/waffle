"use client";
/**
 * Demo Storybook stored in localStorage.
 * TODO(backend): replace with an authenticated /api/storybook endpoint once accounts exist.
 */
export type SavedPage = {
  code: string;
  page: number;
  fortune: string;
  kind: "everyday" | "rerun" | "golden" | "blank";
  savedAt: string;
  drawing?: string; // data URL for blank pages
};

const KEY = "waffle-story:storybook:v1";
const EVT = "waffle-story:storybook";

export function readStorybook(): SavedPage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePage(p: SavedPage): { added: boolean; pages: SavedPage[] } {
  const pages = readStorybook();
  if (pages.some((x) => x.code === p.code)) return { added: false, pages };
  const next = [...pages, p];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVT));
  return { added: true, pages: next };
}

export function onStorybookChange(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Collect 10 pages and the next Chapter is free. */
export const PAGES_PER_FREE_CHAPTER = 10;
