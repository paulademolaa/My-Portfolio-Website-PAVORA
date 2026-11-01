import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import ChatPanel from "../assistant/ChatPanel.jsx";
import { topics, upworkRating, upworkReviews, upworkTestimonials } from "../data/assistant.js";
import { site } from "../data/site.js";

// FAQ questions come from src/data/assistant.js (any topic with a `faq`),
// so the page and the assistant always say the same thing.
const GROUP_ORDER = ["Working together", "Services", "Tools & tech", "Pricing & timelines"];

function Stars({ value, className = "size-4" }) {
  return (
    <span className="flex gap-0.5 text-amber-400" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={`${className} ${n <= Math.round(value) ? "" : "opacity-25"}`} fill="currentColor" aria-hidden="true">
          <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

// One question that opens and closes smoothly
function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className={`rounded-2xl border transition-colors duration-300 ${open ? "border-blue-500/50 bg-ink-900" : "border-ink-800 hover:border-ink-700"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
      >
        <span className="text-base font-medium leading-[1.5] md:text-lg">{q}</span>
        <span className={`grid size-8 shrink-0 place-items-center rounded-full border border-ink-700 transition-all duration-500 ease-(--ease-premium) ${open ? "rotate-45 border-blue-500 bg-blue-600" : ""}`}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div className={`grid transition-all duration-500 ease-(--ease-premium) ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 leading-[1.7] text-slate-300 md:px-6 md:pb-6">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const groups = useMemo(() => {
    const map = {};
    topics.filter((t) => t.faq).forEach((t) => {
      (map[t.faq.group] ||= []).push({ id: t.id, ...t.faq });
    });
    return GROUP_ORDER.filter((g) => map[g]).map((g) => ({ name: g, items: map[g] }));
  }, []);

  const [group, setGroup] = useState(groups[0]?.name);
  const [openId, setOpenId] = useState(groups[0]?.items[0]?.id);
  const current = groups.find((g) => g.name === group) || groups[0];

  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-[1280px] px-5 pt-36 pb-12 md:px-10 md:pt-44">
        <Reveal as="p" className="text-[13px] font-medium tracking-[0.1em] text-blue-400 uppercase">
          FAQ & Assistant
        </Reveal>
        <Reveal as="h1" delay={80} className="mt-4 max-w-[820px] font-display text-[40px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[64px]">
          Everything you need to know before we work together.
        </Reveal>
        <Reveal as="p" delay={160} className="mt-6 max-w-[560px] text-lg leading-[1.6] text-slate-300">
          Ask the assistant anything about services, tools, process or timelines — or browse the common questions below.
        </Reveal>
      </section>

      {/* Assistant + rating */}
      <section className="mx-auto grid max-w-[1280px] gap-6 px-5 md:px-10 lg:grid-cols-[1fr_380px]">
        <Reveal className="h-[600px] overflow-hidden rounded-3xl border border-ink-700 shadow-[0_30px_80px_-30px_rgba(37,99,235,0.45)]">
          <ChatPanel storageKey="pavora-assistant-faq" className="h-full" />
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={100} className="flex flex-col gap-4 rounded-3xl bg-upwork p-7">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Icon name="upwork" className="size-5" /> Upwork client rating
            </span>
            <span className="flex items-end gap-3">
              <span className="font-display text-6xl leading-none font-medium">{upworkRating.score}</span>
              <span className="pb-1">
                <Stars value={upworkRating.score} />
                <span className="mt-1 block text-sm opacity-80">{upworkRating.count} verified reviews</span>
              </span>
            </span>
            <a href={site.links.upwork} target="_blank" rel="noreferrer" className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-upwork-dark transition-all hover:bg-blue-100 active:scale-95">
              See all reviews on Upwork <Icon name="arrow-up-right" className="size-4" />
            </a>
          </Reveal>

          <Reveal delay={180} className="flex flex-col gap-3 rounded-3xl border border-ink-800 bg-ink-900 p-7">
            <p className="font-display text-xl font-medium">Prices & delivery times</p>
            <p className="leading-[1.6] text-slate-300">
              Every project is different, so Paul quotes each one personally. Send a short brief through the assistant and he’ll reply with a price and timeline.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Questions */}
      <section className="mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
        <Reveal as="h2" className="font-display text-[32px] leading-[1.2] font-medium tracking-[-0.01em] md:text-[40px]">
          Frequently asked questions
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {groups.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => {
                  setGroup(g.name);
                  setOpenId(g.items[0]?.id);
                }}
                className={`flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-full px-5 py-3 text-left text-[15px] font-medium transition-all duration-300 lg:rounded-2xl ${
                  g.name === current?.name ? "bg-blue-600 text-white" : "border border-ink-800 text-slate-300 hover:border-ink-700 hover:text-white"
                }`}
              >
                {g.name}
                <span className="text-xs opacity-70">{g.items.length}</span>
              </button>
            ))}
          </div>

          <div key={current?.name} className="animate-fade-in flex flex-col gap-3">
            {current?.items.map((item) => (
              <FaqItem
                key={item.id}
                q={item.question}
                a={item.answer}
                open={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 md:px-10 md:pb-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal as="h2" className="font-display text-[32px] leading-[1.2] font-medium tracking-[-0.01em] md:text-[40px]">
            What clients say
          </Reveal>
          <Reveal as="p" delay={100} className="max-w-[420px] text-slate-300 md:text-right">
            Real reviews from Upwork, in clients’ own words.
          </Reveal>
        </div>

        {/* Verified testimonials */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {upworkTestimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 80}
              className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-blue-600/25 via-ink-900 to-ink-900 p-7 ring-1 ring-blue-500/25"
            >
              <Icon name="quote" className="size-7 text-blue-400" />
              <p className="line-clamp-[9] leading-[1.7] text-slate-100">“{t.quote}”</p>
              <span className="mt-auto flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-ink-700 font-medium">{t.name.charAt(0)}</span>
                <span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {t.name}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">
                      <Icon name="check" className="size-3" /> Verified
                    </span>
                  </span>
                  <span className="text-sm text-slate-400">{t.role} · {t.project}</span>
                </span>
              </span>
            </Reveal>
          ))}
        </div>

        {/* Job reviews */}
        <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {upworkReviews.filter((r) => r.quote).map((r, i) => (
            <Reveal
              key={r.project}
              delay={(i % 3) * 70}
              className="mb-4 flex break-inside-avoid flex-col gap-4 rounded-3xl border border-ink-800 bg-ink-900 p-6 transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 hover:border-blue-500/50"
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="text-sm font-medium">{r.rating.toFixed(1)}</span>
                </span>
                <span className="text-sm text-slate-500">{r.date}</span>
              </span>
              <p className="leading-[1.65] text-slate-200">“{r.quote}”</p>
              {r.tags && (
                <span className="flex flex-wrap gap-1.5">
                  {r.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-ink-800 px-2.5 py-1 text-[12px] text-slate-300">{tag}</span>
                  ))}
                </span>
              )}
              <span className="border-t border-ink-800 pt-4">
                <span className="block font-medium">{r.project}</span>
                <span className="text-sm text-slate-400">
                  {r.service}
                  {r.location ? ` · ${r.location}` : ""}
                </span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 md:px-10 md:pb-32">
        <Reveal className="flex flex-col items-start gap-6 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <h2 className="max-w-[560px] font-display text-[28px] leading-[1.2] font-medium md:text-[36px]">
            Still have a question? Paul is happy to help.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="light" to="/contact">Get in touch</Button>
            <Button variant="secondary" href={site.links.upwork} icon="arrow-up-right">Hire on Upwork</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
