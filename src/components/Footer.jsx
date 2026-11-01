import { Link } from "react-router-dom";
import { SYMBOL_PATHS, WORDMARK_PATHS } from "./Logo.jsx";
import Button from "./Button.jsx";
import Icon from "./Icons.jsx";
import Reveal, { useInView } from "./Reveal.jsx";
import { services } from "../data/content.js";
import { navLinks, site, socialLinks } from "../data/site.js";

// Words that slide across the top of the footer — edit freely
const MARQUEE = ["Designed with vision", "Built for impact", "Product design", "Brand identity", "Web development"];

// Round social icon button
export function SocialButton({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid size-11 cursor-pointer place-items-center rounded-full border border-ink-800 text-slate-400 transition-all duration-300 ease-(--ease-premium) hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
    >
      <Icon name={icon} />
    </a>
  );
}

function Column({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] font-medium text-blue-400">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

const linkClass = "w-fit leading-[1.5] text-slate-200 transition-all duration-300 hover:translate-x-1 hover:text-white";

// Small PAVORA symbol used between the sliding words
function Divider() {
  return (
    <svg viewBox="0 0 132 160" className="h-[0.7em] w-auto shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="footer-sym" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      {SYMBOL_PATHS.map((d) => (
        <path key={d} d={d} fill="url(#footer-sym)" />
      ))}
    </svg>
  );
}

export default function Footer() {
  const [logoRef, logoVisible] = useInView({ threshold: 0.2 });

  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16">
      {MARQUEE.map((word) => (
        <span key={word} className="flex items-center gap-10 md:gap-16">
          <span className="bg-gradient-to-r from-blue-800 via-blue-500 to-slate-300 bg-clip-text whitespace-nowrap text-transparent">
            {word}
          </span>
          <Divider />
        </span>
      ))}
    </div>
  );

  return (
    <footer className="relative overflow-hidden bg-ink-950">
      {/* Big sliding words */}
      <div
        className="border-t border-ink-900 py-16 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] md:py-24"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee-slow font-display text-[64px] leading-none font-medium tracking-[-0.03em] uppercase md:text-[136px]">
          {row}
          {row}
        </div>
      </div>

      <div className="container-page relative">
        {/* Call to action + link columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.5fr_1fr_1fr_0.8fr] lg:gap-10">
          <Reveal className="col-span-2 flex max-w-[480px] flex-col gap-5 lg:col-span-1">
            <p className="text-[15px] font-medium text-blue-400">Let’s talk</p>
            <h2 className="font-display text-[30px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[36px]">
              Have something great in mind? Let’s make it happen.
            </h2>
            <p className="leading-[1.6] text-slate-400">I’m always up for a new project and a good chat about design.</p>
            <div className="flex flex-wrap gap-2.5">
              <Button to="/contact">Start a Project</Button>
              <Button href={site.links.upwork} variant="secondary" icon="arrow-up-right">
                Hire Me on Upwork
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Column title="Sitemap">
              {[{ label: "Home", to: "/" }, ...navLinks].map((link) => (
                <Link key={link.label} to={link.to} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </Column>
          </Reveal>

          <Reveal delay={180}>
            <Column title="Services">
              {services.map((s) => (
                <Link key={s.title} to="/#services" className={linkClass}>
                  {s.title}
                </Link>
              ))}
            </Column>
          </Reveal>

          <Reveal delay={260}>
            <Column title="Social">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {s.label}
                </a>
              ))}
            </Column>
          </Reveal>
        </div>

        {/* Giant outline logo that draws itself */}
        <div
          ref={logoRef}
          className={`mt-20 flex items-end gap-[4%] md:mt-28 ${logoVisible ? "is-visible" : ""}`}
          aria-hidden="true"
        >
          <svg viewBox="-1 -1 134 162" className="draw-path h-auto w-[17%] shrink-0" fill="none">
            {SYMBOL_PATHS.map((d) => (
              <path key={d} d={d} pathLength="900" fill="#0B1226" stroke="#2563EB" strokeOpacity="0.7" strokeWidth="1" />
            ))}
          </svg>
          <svg viewBox="-2 -2 572 104" className="draw-path h-auto flex-1" fill="none">
            {WORDMARK_PATHS.map((d) => (
              <path
                key={d}
                d={d}
                pathLength="900"
                fill="#0B1226"
                fillRule="evenodd"
                stroke="#2563EB"
                strokeOpacity="0.7"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-ink-800 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {site.brand} — {site.name}
          </p>
          <p className="text-sm text-slate-400">{site.tagline}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex w-fit cursor-pointer items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            Back to top
            <Icon name="arrow-up" className="size-4 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
