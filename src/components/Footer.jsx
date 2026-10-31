import { Link } from "react-router-dom";
import Logo, { SYMBOL_PATHS } from "./Logo.jsx";
import Button from "./Button.jsx";
import Icon from "./Icons.jsx";
import { useInView } from "./Reveal.jsx";
import Reveal from "./Reveal.jsx";
import { navLinks, site, socialLinks } from "../data/site.js";

// Round social icon button
export function SocialButton({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid size-11 cursor-pointer place-items-center rounded-full text-slate-400 transition-all duration-300 ease-(--ease-premium) hover:-translate-y-1 hover:bg-blue-600 hover:text-white"
    >
      <Icon name={icon} />
    </a>
  );
}

export default function Footer() {
  const [symbolRef, symbolVisible] = useInView({ threshold: 0.2 });

  return (
    <footer className="relative overflow-hidden bg-ink-950">
      {/* Soft blue glow at the bottom */}
      <div className="pointer-events-none absolute -bottom-72 left-1/2 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/40 blur-[180px]" />

      {/* Outline symbol that draws itself when it scrolls into view */}
      <svg
        ref={symbolRef}
        viewBox="0 0 132 160"
        className={`draw-path pointer-events-none absolute -right-10 bottom-[-160px] hidden h-[512px] w-auto opacity-70 lg:block ${
          symbolVisible ? "is-visible" : ""
        }`}
        fill="none"
        aria-hidden="true"
      >
        {SYMBOL_PATHS.map((d) => (
          <path key={d} d={d} stroke="#24324F" strokeWidth="0.9" />
        ))}
      </svg>

      <div className="container-page relative pt-24 pb-10 lg:pt-[120px]">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          {/* Call to action */}
          <Reveal className="flex max-w-[560px] flex-col gap-6">
            <h2 className="font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[64px]">
              Have something great in mind? Let's make it happen.
            </h2>
            <p className="leading-[1.6] text-slate-400">
              I'm always up for a new project and a good chat about design.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button to="/contact">Start a Project</Button>
              <Button href={site.links.upwork} variant="secondary">
                Hire Me on Upwork
              </Button>
            </div>
            <div className="flex gap-1">
              {socialLinks.map((s) => (
                <SocialButton key={s.label} {...s} />
              ))}
            </div>
          </Reveal>

          {/* Link columns */}
          <Reveal delay={150} className="flex gap-20">
            <div className="flex flex-col gap-3">
              <p className="text-[13px] leading-[1.3] font-medium tracking-[0.1em] text-slate-500 uppercase">
                Explore
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="w-fit font-medium leading-[1.6] text-white transition-all duration-300 hover:translate-x-1 hover:text-blue-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[13px] leading-[1.3] font-medium tracking-[0.1em] text-slate-500 uppercase">
                Connect
              </p>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit font-medium leading-[1.6] text-white transition-all duration-300 hover:translate-x-1 hover:text-blue-500"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="mt-24 flex flex-col gap-4 border-t border-ink-800 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <Logo />
            <p className="text-sm leading-[1.6] text-slate-500">
              © {new Date().getFullYear()} {site.brand} — {site.name}
            </p>
          </div>
          <p className="text-sm leading-[1.6] text-slate-400">{site.tagline}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex w-fit cursor-pointer items-center gap-2 text-sm leading-[1.6] text-slate-400 transition-colors hover:text-white"
          >
            Back to top
            <Icon name="arrow-up" className="size-4 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
