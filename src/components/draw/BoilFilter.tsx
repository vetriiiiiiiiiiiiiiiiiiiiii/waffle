/**
 * LINE BOIL: three slightly different displacement states.
 * `.boil` (globals.css) swaps between them at ~9fps with steps(), never tweened.
 * Rendered once in the root layout.
 */
export function BoilFilter() {
  const seeds = [2, 7, 13];
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {seeds.map((seed, i) => (
          <filter id={`boil-${i}`} key={seed} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={i === 1 ? 3 : 2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
        {/* crayon tooth: knocks paper-coloured gaps into a fill */}
        <filter id="crayon-tooth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.55" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" />
        </filter>
        {/* watercolour rim: darker edge, blotchy */}
        <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d" />
          <feMorphology in="d" operator="erode" radius="2" result="inner" />
          <feComposite in="d" in2="inner" operator="out" result="rim" />
          <feComponentTransfer in="rim" result="rimDark">
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feComponentTransfer in="d" result="body">
            <feFuncA type="linear" slope="0.75" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="body" />
            <feMergeNode in="rimDark" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** Faint feTurbulence grain over the whole page at 4% opacity. */
export function PaperGrain() {
  return (
    <svg className="paper-grain" aria-hidden="true" focusable="false" width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
