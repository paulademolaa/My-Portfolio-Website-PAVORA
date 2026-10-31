import { Link } from "react-router-dom";

// The PAVORA symbol and wordmark, drawn as SVG so they stay sharp.
export const SYMBOL_PATHS = [
  "M0 160V50A50 50 0 0 1 50 0h20a50 50 0 0 1 0 100H60l36-36H70a14 14 0 0 0 0-28H50a14 14 0 0 0-14 14v74z",
  "M60 160l36-36h36l-36 36z",
];

const WORDMARK_PATHS = [
  "M0,100V0H44A30,30 0 0 1 44,60L34,60L54,40L44,40A10,10 0 0 0 44,20L20,20L20,100Z", // P
  "M88,100L121,0L141,0L174,100L154,100L131,31L108,100Z", // A
  "M176,0L196,0L219,69L242,0L262,0L229,100L209,100Z", // V
  "M278,50A51,51 0 1 0 380,50A51,51 0 1 0 278,50ZM298,50A31,31 0 1 0 360,50A31,31 0 1 0 298,50Z", // O
  "M394,100V0H438A30,30 0 0 1 438,60H414V100ZM414,20H438A10,10 0 0 1 438,40H414Z", // R
  "M424,50L448,50L474,100L450,100Z", // R leg
  "M482,100L515,0L535,0L568,100L548,100L525,31L502,100Z", // A
];

export function Symbol({ className = "h-7 w-auto", color = "#2563EB" }) {
  return (
    <svg viewBox="0 0 132 160" className={className} aria-hidden="true">
      {SYMBOL_PATHS.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  );
}

export function Wordmark({ className = "h-3 w-auto", color = "#FFFFFF" }) {
  return (
    <svg viewBox="0 -1 568 102" className={className} aria-hidden="true">
      {WORDMARK_PATHS.map((d) => (
        <path key={d} d={d} fill={color} fillRule="evenodd" />
      ))}
    </svg>
  );
}

// Horizontal logo that links back to the home page
export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      aria-label="PAVORA — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <Symbol className="h-7 w-auto transition-transform duration-500 ease-(--ease-premium) group-hover:-rotate-6 group-hover:scale-110" />
      <Wordmark className="h-3 w-auto" />
    </Link>
  );
}
