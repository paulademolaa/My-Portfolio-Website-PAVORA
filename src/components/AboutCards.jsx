import { useEffect, useRef, useState } from "react";
import { clientInsights, site, stats } from "../data/site.js";
import { useInView } from "./Reveal.jsx";

// Returns how far an element has moved through the screen while scrolling:
// 0 when its top touches the bottom of the screen, 1 when its top reaches
// `endAt` (a fraction of the screen height, e.g. 0.35).
function useScrollProgress(endAt = 0.35) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const p = (vh - top) / (vh - vh * endAt);
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [endAt]);

  return [ref, progress];
}

/* ------------------------------------------------------------------
   1) Stat cards — start as a staircase, slide into a level row
------------------------------------------------------------------- */
function Count({ value, decimals = 0, suffix = "", start }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const begin = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min((now - begin) / 1600, 1);
      setN(value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);
  return (
    <>
      {n.toFixed(decimals)}
      {suffix}
    </>
  );
}

export function StatCards() {
  const [ref, progress] = useScrollProgress(0.4);
  const [countRef, visible] = useInView({ threshold: 0.3 });
  const isPhone = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div ref={ref}>
      <div ref={countRef} className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            // Each card starts lower than the one before and rises into line
            // (on phones only the right-hand column steps down, by less)
            style={{ transform: `translateY(${(1 - progress) * (isPhone ? (i % 2) * 32 : i * 56)}px)` }}
            className="group flex aspect-[5/4] cursor-default flex-col justify-between rounded-2xl border border-ink-800 bg-ink-900 p-5 transition-colors duration-500 hover:border-ink-700 hover:bg-ink-800 md:aspect-[4/3.4] md:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm leading-[1.4] text-slate-400">{stat.label}</span>
              <span className="flex gap-1 pt-1">
                {stats.map((_, d) => (
                  <span
                    key={d}
                    className={`size-1.5 rounded-[2px] transition-colors duration-500 ${
                      d <= i ? "bg-blue-500" : "bg-ink-700"
                    }`}
                  />
                ))}
              </span>
            </div>
            <p className="font-display text-[44px] leading-none font-bold tracking-[-0.03em] transition-transform duration-500 ease-(--ease-premium) group-hover:-translate-y-1 md:text-[64px]">
              <Count {...stat} start={visible} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   2) Tool tiles — spin a full turn in 3D on hover
------------------------------------------------------------------- */
export function ToolGrid({ tools }) {
  const [ref, visible] = useInView({ threshold: 0.2 });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {tools.map((tool, i) => (
        <div
          key={tool.name}
          className="tool-tile group"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(40px) scale(0.94)",
            transition: `opacity .9s var(--ease-premium) ${i * 80}ms, transform .9s var(--ease-premium) ${i * 80}ms`,
          }}
        >
          <div className="tool-tile-inner flex h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-ink-800 bg-[radial-gradient(ellipse_at_center,#16213f_0%,#0d1631_55%,#080f25_100%)] px-4 text-center transition-colors duration-500 group-hover:border-blue-500/40 md:h-52">
            {/* Logo — every logo sits in the same square so they line up */}
            <span className="grid size-14 shrink-0 place-items-center md:size-16">
              {tool.logo ? (
                <img
                  src={tool.logo}
                  alt=""
                  style={{ transform: `rotate(${tool.tilt ? 14 : 0}deg) scale(${tool.scale || 1})` }}
                  className="size-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
                />
              ) : (
                <span className="font-display text-2xl font-bold text-blue-300">
                  {tool.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              )}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-[15px] leading-tight font-medium whitespace-nowrap text-white sm:text-lg">{tool.name}</span>
              <span className="text-xs leading-[1.4] whitespace-nowrap text-slate-400 sm:text-[13px]">{tool.caption}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   3) "How I work" cards — fly up one by one and land tilted
------------------------------------------------------------------- */
const cardStyles = [
  { bg: "from-blue-400 to-blue-800", rotate: -8, x: "0%", y: 40 },
  { bg: "from-blue-500 to-ink-900", rotate: 6, x: "24%", y: 90 },
  { bg: "from-blue-600 to-blue-800", rotate: -5, x: "48%", y: 30 },
  { bg: "from-blue-400 to-blue-600", rotate: 8, x: "72%", y: 110 },
];

function Card({ step, i }) {
  return (
    <div
      className={`flex aspect-square w-full flex-col justify-between rounded-[28px] bg-gradient-to-br p-6 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.55)] ${cardStyles[i % 4].bg}`}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-white/90 font-display text-sm font-bold text-ink-950">
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="font-display text-2xl font-medium">{step.title}</span>
      </div>
      <p className="text-lg leading-[1.4] font-medium">{step.text}</p>
    </div>
  );
}

export function ProcessCards({ steps, heading }) {
  // The section is tall; its inside stays pinned while you scroll through it
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setProgress(Math.min(Math.max(-rect.top / total, 0), 1));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);


  return (
    <>
      {/* Desktop: pinned, scroll-driven */}
      <div ref={wrapRef} className="relative hidden h-[260vh] lg:block">
        <div className="sticky top-24 flex h-[calc(100vh-6rem)] flex-col">
          {/* The heading stays pinned while the cards fly in */}
          <div className="pt-6">{heading}</div>
          <div className="relative mx-auto w-full max-w-[1280px] flex-1">
            {steps.map((step, i) => {
              const s = cardStyles[i % 4];
              // each card gets its own slice of the scroll
              const local = Math.min(Math.max((progress - i * 0.2) / 0.3, 0), 1);
              const eased = 1 - Math.pow(1 - local, 3);
              return (
                <div
                  key={step.title}
                  className="absolute top-[10%] w-[280px] xl:w-[310px]"
                  style={{
                    left: s.x,
                    transform: `translateY(${(1 - eased) * 110 + s.y / 10}vh) rotate(${s.rotate + (1 - eased) * -24}deg)`,
                    opacity: local > 0 ? 1 : 0,
                  }}
                >
                  <Card step={step} i={i} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phones & tablets: simple grid, cards tilt in as they appear */}
      <div className="lg:hidden">{heading}</div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:hidden">
        {steps.map((step, i) => (
          <TiltIn key={step.title} rotate={cardStyles[i % 4].rotate / 2} delay={i * 80}>
            <Card step={step} i={i} />
          </TiltIn>
        ))}
      </div>
    </>
  );
}

function TiltIn({ children, rotate, delay }) {
  const [ref, visible] = useInView({ threshold: 0.25 });
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? `rotate(${rotate}deg)` : `translateY(80px) rotate(${rotate * 4}deg)`,
        opacity: visible ? 1 : 0,
        transition: `transform 1s var(--ease-premium) ${delay}ms, opacity 1s var(--ease-premium) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   4) Client insights — bars fill one after another when scrolled into view
   (numbers come from clientInsights in src/data/site.js)
------------------------------------------------------------------- */
export function ClientInsights() {
  const [ref, visible] = useInView({ threshold: 0.25 });
  const max = Math.max(...clientInsights.map((i) => i.count));

  return (
    <div ref={ref} className="grid gap-10 rounded-3xl border border-ink-800 bg-ink-900 p-6 md:p-10 lg:grid-cols-[320px_1fr] lg:gap-16">
      <div className="flex flex-col items-start gap-4">
        <span className="rounded-full bg-upwork/15 px-3 py-1.5 text-[13px] font-medium text-[#4ade80]">Insights from completed jobs</span>
        <h2 className="font-display text-[32px] leading-[1.2] font-medium md:text-[40px]">What clients say I’m like</h2>
        <p className="leading-[1.6] text-slate-400">
          The qualities clients endorsed most after working with me on Upwork.
        </p>
        <a
          href={site.links.upwork}
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-[15px] font-medium text-white underline-offset-4 transition-colors hover:text-blue-400 hover:underline"
        >
          See my Upwork profile ↗
        </a>
      </div>

      <ul className="flex flex-col gap-4">
        {clientInsights.map((item, i) => (
          <li key={item.label} className="group flex flex-col gap-2">
            <span className="flex items-baseline justify-between gap-4">
              <span className="font-medium transition-colors group-hover:text-blue-400">{item.label}</span>
              <span className="text-sm text-slate-400">
                <span className="font-display text-lg font-bold text-white">{item.count}</span> clients
              </span>
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-ink-800">
              <span
                className="block h-full origin-left rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-transform duration-[1200ms] ease-(--ease-premium)"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  transform: `scaleX(${visible ? 1 : 0})`,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
