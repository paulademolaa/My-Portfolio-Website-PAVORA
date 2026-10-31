import { useState } from "react";
import Button from "./Button.jsx";
import Icon from "./Icons.jsx";
import Reveal from "./Reveal.jsx";
import { testimonials } from "../data/content.js";
import { site } from "../data/site.js";

function QuoteCard({ item, active }) {
  return (
    <figure
      className={`flex min-h-[330px] w-[85vw] max-w-[520px] shrink-0 flex-col justify-between gap-10 rounded-2xl border border-ink-800 bg-ink-900 p-7 transition-opacity duration-700 ease-(--ease-premium) ${
        active ? "opacity-100" : "opacity-40"
      }`}
    >
      <div className="flex flex-col gap-4">
        <Icon name="quote" className="size-7 text-slate-500" strokeWidth={2} />
        <blockquote className="text-lg leading-[1.6]">{item.quote}</blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink-700 text-[15px] font-medium">
          {item.name.charAt(0)}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="font-medium leading-[1.6]">{item.name}</span>
          <span className="text-sm leading-[1.6] text-slate-400">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Client reviews carousel (reviews come from src/data/content.js)
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const last = testimonials.length - 1;
  const go = (i) => setIndex(Math.max(0, Math.min(last, i)));

  return (
    <section className="overflow-hidden py-24 lg:py-40">
      <div className="container-page flex flex-col gap-12 lg:flex-row lg:gap-16 lg:pr-0">
        <Reveal className="flex shrink-0 flex-col items-start gap-4 lg:w-[360px]">
          <h2 className="font-display text-[32px] leading-[1.2] font-medium tracking-[-0.01em] md:text-[40px]">
            What Clients Say
          </h2>
          <p className="leading-[1.6] text-slate-400">
            Founders and teams I’ve worked with on Upwork, in their own words.
          </p>
          <Button href={site.links.upwork} variant="link" icon="arrow-up-right">
            Read more on Upwork
          </Button>
        </Reveal>

        <Reveal delay={150} className="flex min-w-0 flex-1 flex-col gap-6">
          <div
            className="flex gap-5 transition-transform duration-700 ease-(--ease-premium)"
            style={{ transform: `translateX(calc(${index} * (-1 * min(85vw, 520px) - 20px)))` }}
          >
            {testimonials.map((item, i) => (
              <QuoteCard key={i} item={item} active={i === index || i === index + 1} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show review ${i + 1}`}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-slate-500 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <div className="ml-auto flex gap-2 lg:mr-20">
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="Previous review"
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-ink-700 transition-all duration-300 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevron-left" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                disabled={index === last}
                aria-label="Next review"
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-ink-700 transition-all duration-300 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevron-right" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
