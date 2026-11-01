import { useEffect, useRef, useState } from "react";
import Icon from "./Icons.jsx";
import Reveal from "./Reveal.jsx";
import { upworkRating, upworkReviews, upworkTestimonials } from "../data/assistant.js";
import { site } from "../data/site.js";

// Reviews come from src/data/assistant.js:
//   upworkReviews      → Upwork jobs (shows "Upwork client")
//   upworkTestimonials → clients outside Upwork (shows "Direct client")
// The big quote at the bottom is the review marked by FEATURED (project name).
const FEATURED = "Travel Agency Website Development";

const reviews = [
  ...upworkReviews
    .filter((r) => r.quote && r.project !== FEATURED)
    .map((r) => ({
      quote: r.quote,
      name: r.client || "Upwork client",
      role: r.project,
      rating: r.rating,
      source: "upwork",
    })),
  ...upworkTestimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    role: `${t.role} · ${t.project}`,
    rating: 5,
    source: "direct",
  })),
];
// Mix direct clients in between the Upwork reviews
const mixed = [...reviews.slice(0, 3), reviews.at(-3), ...reviews.slice(3, 6), reviews.at(-2), ...reviews.slice(6, -3), reviews.at(-1)];

const featured = upworkReviews.find((r) => r.project === FEATURED);

function Stars({ value }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} viewBox="0 0 24 24" className={`size-3.5 ${n <= Math.round(value) ? "text-white" : "text-slate-600"}`} fill="currentColor" aria-hidden="true">
            <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
          </svg>
        ))}
      </span>
      <span className="text-[13px] text-slate-300">
        {Number.isInteger(value) ? value : value.toFixed(1)} <span className="text-slate-500">/ 5</span>
      </span>
    </span>
  );
}

function Avatar({ name, source, size = "size-12" }) {
  if (source === "upwork" && name === "Upwork client") {
    return (
      <span className={`grid ${size} shrink-0 place-items-center rounded-xl bg-upwork text-white`}>
        <Icon name="upwork" className="size-5" />
      </span>
    );
  }
  return (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-xl bg-gradient-to-br font-display text-lg font-medium text-white ${
        source === "direct" ? "from-slate-500 to-ink-700" : "from-blue-500 to-blue-800"
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}

function ReviewCard({ item }) {
  return (
    <figure className="flex h-[248px] w-[300px] shrink-0 flex-col gap-4 md:w-[340px]">
      <Stars value={item.rating} />
      <blockquote className="line-clamp-5 flex-1 text-[15px] leading-[1.6] text-slate-300">{item.quote}</blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar name={item.name} source={item.source} />
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="text-[14px] font-semibold tracking-wide text-white uppercase">{item.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                item.source === "upwork" ? "bg-upwork/15 text-[#4ade80]" : "bg-slate-500/20 text-slate-300"
              }`}
            >
              {item.source === "upwork" ? "Upwork" : "Direct client"}
            </span>
          </span>
          <span className="line-clamp-1 text-[13px] text-slate-400">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Big quote whose words light up one by one as you scroll
function FeaturedQuote({ text }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const { top } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.55))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lit = Math.round(progress * words.length);

  return (
    <blockquote
      ref={ref}
      className="font-display text-[26px] leading-[1.3] font-medium tracking-[-0.02em] md:text-[40px] lg:text-[44px]"
    >
      {words.map((w, i) => (
        <span key={i} className={`transition-colors duration-300 ${i < lit ? "text-white" : "text-slate-700"}`}>
          {w}{" "}
        </span>
      ))}
    </blockquote>
  );
}

export default function Testimonials() {
  return (
    <section className="overflow-hidden py-24 lg:py-32">
      {/* Label row */}
      <div className="container-page">
        <Reveal className="flex items-center gap-4 text-[13px] font-medium tracking-[0.08em] uppercase">
          <a
            href={site.links.upwork}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
          >
            ★ {upworkRating.score} on Upwork
          </a>
          <span className="h-px flex-1 bg-ink-700" />
          <span className="text-white">/Client stories</span>
        </Reveal>

        <Reveal as="h2" delay={80} className="mt-10 flex items-end gap-3 font-display text-[56px] leading-[0.9] font-bold tracking-[-0.05em] lowercase md:text-[104px]">
          <span className="mb-[0.12em] flex gap-1.5" aria-hidden="true">
            <span className="size-3 rounded-full bg-blue-500 md:size-4" />
            <span className="size-3 rounded-full bg-slate-500 md:size-4" />
          </span>
          testimonials
        </Reveal>
      </div>

      {/* Endless row of reviews (pauses on hover) */}
      <Reveal delay={150} className="group mt-14 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee-slow gap-10 group-hover:[animation-play-state:paused] md:gap-14">
          {[...mixed, ...mixed].map((item, i) => (
            <ReviewCard key={i} item={item} />
          ))}
        </div>
      </Reveal>

      {/* Featured quote */}
      {featured && (
        <div className="container-page mt-16 md:mt-20">
          <div className="border-t border-ink-700 pt-12 md:pt-16">
            <FeaturedQuote text={featured.quote} />
            <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <span className="grid size-8 place-items-center rounded-lg bg-upwork text-white">
                  <Icon name="upwork" className="size-4" />
                </span>
                {featured.project}
              </span>
              <span className="flex flex-col gap-3 md:items-start">
                <Stars value={featured.rating} />
                <span className="flex items-center gap-3">
                  <Avatar name={featured.client || "Upwork client"} source="upwork" />
                  <span>
                    <span className="block text-[14px] font-semibold tracking-wide uppercase">{featured.client || "Upwork client"}</span>
                    <span className="block text-[13px] tracking-wide text-slate-400 uppercase">Upwork client</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
