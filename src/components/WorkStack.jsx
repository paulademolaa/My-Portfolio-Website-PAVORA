import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import Reveal from "./Reveal.jsx";

// Selected Works as stacking cards.
// Each card sticks near the top of the screen. As the next card slides
// up over it, the card underneath tilts back, shrinks and dims — like a
// deck of cards. Projects come from src/data/projects.js.

const STICKY_TOP = 104; // px from the top of the screen (just under the navbar)

function StackCard({ project, index }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group grid gap-5 rounded-3xl border border-ink-800 bg-ink-900 p-4 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] md:grid-cols-2 md:gap-6 md:p-5">
      {/* Text side */}
      <div className="flex flex-col p-2 md:p-8 lg:p-10">
        <span className="font-display text-5xl leading-none font-medium tracking-[-0.03em] md:text-[64px]">
          {number}
        </span>

        <div className="mt-10 flex flex-col gap-3 md:mt-auto md:pt-16">
          <h3 className="font-display text-2xl leading-[1.2] font-medium tracking-[-0.01em] md:text-[32px]">
            {project.title}
          </h3>
          <p className="max-w-[440px] leading-[1.6] text-slate-400">
            {project.type} — {project.summary}
          </p>
        </div>

        {project.tags && (
          <ul className="mt-7 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-ink-800 px-3 py-1.5 text-[13px] leading-none font-medium text-slate-400 transition-colors duration-300 group-hover:text-white"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-9">
          <Button to={`/work/${project.slug}`} variant="light" icon="arrow-up-right">
            View project
          </Button>
        </div>
      </div>

      {/* Picture side — click it to open the project */}
      <Link
        to={`/work/${project.slug}`}
        aria-label={`Open ${project.title}`}
        className="relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-ink-800 md:aspect-auto md:min-h-[480px]"
      >
        <img
          src={project.cover}
          alt={`${project.title} — ${project.type}`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-(--ease-premium) group-hover:scale-[1.05]"
        />
      </Link>
    </article>
  );
}

export default function WorkStack({ projects }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    // Skip the 3D effect for people who prefer less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame;
    const update = () => {
      const cards = cardRefs.current.filter(Boolean);
      const isPhone = window.innerWidth < 768; // cards just scroll normally on phones
      cards.forEach((card, i) => {
        const inner = card.firstElementChild;
        const next = cards[i + 1];
        if (!next || isPhone) {
          inner.style.transform = "";
          inner.style.filter = "";
          return;
        }

        // progress = 0 while the next card is a full card-height away,
        // and 1 once it has slid all the way up over this card
        const gap = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
        const progress = Math.min(Math.max(1 - gap / card.offsetHeight, 0), 1);

        inner.style.transform = `perspective(1600px) translateY(${-progress * 36}px) rotateX(${progress * 12}deg) scale(${1 - progress * 0.1})`;
        inner.style.filter = `brightness(${1 - progress * 0.5})`;
      });
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
  }, [projects]);

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      {projects.map((project, i) => (
        <div
          key={project.slug}
          ref={(el) => (cardRefs.current[i] = el)}
          className="md:sticky"
          style={{ top: STICKY_TOP }}
        >
          <div className="origin-top will-change-transform">
            <Reveal>
              <StackCard project={project} index={i} />
            </Reveal>
          </div>
        </div>
      ))}
    </div>
  );
}
