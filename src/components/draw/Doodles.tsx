/** Hand-drawn doodle icons. Never an icon library. */
type P = { className?: string; colour?: string; title?: string };

const a11y = (title?: string) => (title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const });

export function Star({ className = "", colour = "#F6D776", title }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...a11y(title)}>
      <path d="M21 4 L25.5 15 L37 15.5 L28 23 L31.5 35 L20.5 28 L9.5 35.5 L13 23.5 L3.5 15.5 L16 14.6 Z" fill={colour} transform="translate(1.5 1.5)" />
      <path d="M20 3 L24.6 14.4 L36.5 15 L27.2 22.6 L30.6 34.8 L20 27.8 L9 35.2 L12.6 23 L3 15.2 L15.4 14.2 L20.4 3.6" fill="none" stroke="#26211D" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Heart({ className = "", colour = "#F4B6C2", title }: P) {
  return (
    <svg viewBox="0 0 40 36" className={className} {...a11y(title)}>
      <path d="M20 33 C 6 24, 2 16, 5 9 C 8 3, 16 3, 20 10 C 24 3, 33 3, 36 9 C 39 17, 33 25, 20 33 Z" fill={colour} transform="translate(2 2)" />
      <path d="M20 32 C 6 23, 2 15, 5 8.5 C 8 2.5, 16 2.6, 20 9.6 C 24 2.4, 33 2.6, 35.6 8.6 C 38.4 16, 32.6 24, 19.4 32.6" fill="none" stroke="#26211D" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Arrow({ className = "", colour = "#C9506D", title }: P) {
  return (
    <svg viewBox="0 0 80 60" className={className} {...a11y(title)} fill="none">
      <path d="M4 6 C 20 4, 44 10, 56 30 S 66 50, 70 54" stroke={colour} strokeWidth="2.4" strokeLinecap="round" pathLength={1} />
      <path d="M60 50 L 70.5 55 L 73 43.5" stroke={colour} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
    </svg>
  );
}

export function Squiggle({ className = "", colour = "#C9506D" }: P) {
  return (
    <svg viewBox="0 0 200 14" className={className} aria-hidden="true" preserveAspectRatio="none" fill="none">
      <path d="M2 8 C 18 2, 26 13, 42 7 S 68 2, 82 8 S 108 13, 122 6 S 150 2, 164 8 S 188 12, 198 5" stroke={colour} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Sun({ className = "", title }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...a11y(title)} fill="none">
      <circle cx="25" cy="25" r="10" fill="#F6D776" />
      <path d="M24 14 C 30 13.6, 34.5 18.6, 34 24.5 C 33.4 30.6, 28 34.4, 22.8 33.8 C 17 33, 13.8 28, 14.4 22.6 C 15 17.4, 19.6 14.2, 25.6 14.6" stroke="#26211D" strokeWidth="1.7" strokeLinecap="round" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <path key={d} d="M24 7 L24 2" stroke="#E9B562" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${d} 24 24)`} />
      ))}
    </svg>
  );
}

export function Crayon({ className = "", colour = "#F4B6C2" }: P) {
  return (
    <svg viewBox="0 0 24 64" className={className} aria-hidden="true">
      <path d="M6 18 L12 3 L18 18 Z" fill={colour} transform="translate(1 1)" />
      <rect x="6" y="18" width="12" height="42" rx="2" fill={colour} transform="translate(1 1)" />
      <path d="M6 18 L12 2.5 L18 18 M6 18 L6 60 L18 60.5 L18 18 M6 24 L18 24 M6 54 L18 54.5" fill="none" stroke="#26211D" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* Hand-drawn social icons */
export function InstaDoodle({ className = "" }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke="#26211D" strokeWidth="2" strokeLinecap="round">
      <path d="M10 5.5 C 18 4.6, 25 4.8, 31 5.6 C 34.6 6.4, 35 9, 35 13 C 35.4 19, 35.2 25, 34.4 30 C 33.8 34, 31 34.6, 27 34.8 C 20 35.2, 14 35, 9.6 34.4 C 6 33.8, 5.2 31, 5.2 27 C 4.8 20, 5 14, 5.6 10 C 6.2 6.6, 8 5.8, 11 5.4" />
      <path d="M20 13.4 C 24.2 13.2, 26.8 16.4, 26.6 20.2 C 26.4 24, 23.4 26.8, 19.6 26.6 C 15.8 26.2, 13.2 23.2, 13.6 19.4 C 14 16, 16.6 13.6, 20.6 13.8" />
      <path d="M28.6 10.6 L28.8 10.8" strokeWidth="3.4" />
    </svg>
  );
}
export function YoutubeDoodle({ className = "" }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke="#26211D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12 C 12 9.6, 28 9.4, 35.4 11.6 C 37 18, 37 23, 35.2 28.6 C 27 30.6, 13 30.8, 4.8 28.4 C 3.4 22, 3.4 17, 5.4 11.4" />
      <path d="M17 15 L 25.6 20 L 16.8 25.2 Z" fill="#F4B6C2" />
    </svg>
  );
}
export function WhatsDoodle({ className = "" }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke="#26211D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 5 C 29 4.8, 35.4 11.4, 35 20 C 34.6 28.6, 27.6 35, 19.4 34.6 C 16.4 34.4, 14 33.6, 11.6 32.2 L 5 34.6 L 7.4 28.4 C 5.8 25.6, 5 23, 5.2 19.6 C 5.6 11.2, 12 5.2, 20.8 5.2" />
      <path d="M15 14 C 15.6 19, 19.6 24.4, 25.6 26" />
    </svg>
  );
}
