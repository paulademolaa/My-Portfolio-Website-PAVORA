import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import Mockup from "../components/Mockups.jsx";
import Reveal, { useInView } from "../components/Reveal.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { Symbol } from "../components/Logo.jsx";
import { phases, services, servicesGuide } from "../data/content.js";

// The full-detail PDF lives in public/files/ — replace the file to update it
function DownloadButton({ variant = "primary", className = "" }) {
  const styles =
    variant === "light"
      ? "bg-white text-ink-950 hover:bg-blue-100"
      : "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_30px_-8px_rgba(37,99,235,0.6)]";
  return (
    <a
      href={servicesGuide.href}
      download
      className={`group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-full py-3 pr-5 pl-[18px] text-[15px] leading-[1.5] font-medium transition-all duration-300 ease-(--ease-premium) active:scale-[0.97] ${styles} ${className}`}
    >
      <Icon name="download" className="size-5 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
      Download our guide (PDF)
    </a>
  );
}

// The four phases: a line draws across them, then each card pops in
function Phases() {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className="relative mt-10">
      <div
        className={`absolute top-1/2 right-0 left-0 hidden h-px origin-left bg-gradient-to-r from-blue-500 via-blue-500/50 to-transparent transition-transform duration-[1400ms] ease-(--ease-premium) md:block ${
          visible ? "scale-x-100" : "scale-x-0"
        }`}
      />
      <ol className="relative grid auto-rows-fr gap-4 md:grid-cols-4">
        {phases.map((p, i) => (
          <li
            key={p.title}
            style={{ transitionDelay: `${200 + i * 140}ms` }}
            className={`h-full transition-all duration-700 ease-(--ease-premium) ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <div
              className={`group flex h-full flex-col gap-2 rounded-2xl border p-6 transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 ${
                i === 0 ? "border-blue-500 bg-[#0f1d4d]" : "border-ink-800 bg-ink-900 hover:border-blue-500/50"
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-slate-400 uppercase">
                <span className={`size-1.5 rounded-full ${i === 0 ? "animate-pulse bg-blue-400" : "bg-slate-600 transition-colors group-hover:bg-blue-400"}`} />
                {p.tag}
              </span>
              <span className="font-display text-lg font-medium">{p.title}</span>
              <span className="text-[15px] leading-[1.5] text-slate-400">{p.text}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Services() {
  return (
    <>
      {/* Header */}
      <section className="container-page relative pt-[150px] md:pt-[190px]">
        <div className="pointer-events-none absolute top-24 -left-40 -z-10 h-[360px] w-[520px] animate-glow rounded-full bg-blue-600/40 blur-[140px]" />
        <Reveal as="p" className="text-[13px] font-medium tracking-[0.1em] text-blue-400 uppercase">
          Services
        </Reveal>
        <Reveal
          as="h1"
          delay={80}
          className="mt-4 max-w-[860px] font-display text-[40px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[64px]"
        >
          Everything your brand needs, from logo to launch.
        </Reveal>
        <Reveal as="p" delay={160} className="mt-6 max-w-[580px] text-lg leading-[1.6] text-slate-300">
          PAVORA helps startup founders and growing businesses build a brand people remember and a website people use.
          Here's a quick look. The guide has every step in detail.
        </Reveal>
        <Reveal delay={240} className="mt-9 flex flex-wrap gap-3">
          <DownloadButton />
          <Button to="/contact" variant="secondary">
            Start a project
          </Button>
        </Reveal>
      </section>

      {/* Service cards */}
      <section className="container-page pt-20 md:pt-28">
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 100} className="h-full">
              <article className="group flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 p-6 transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-[0_24px_60px_-24px_rgba(37,99,235,0.55)] md:p-7">
                <div className="overflow-hidden rounded-2xl">
                  <Mockup
                    kind={s.art}
                    className="aspect-[420/240] w-full transition-transform duration-700 ease-(--ease-premium) group-hover:scale-[1.04] group-hover:-rotate-1"
                  />
                </div>
                <span className="text-[13px] font-medium tracking-[0.1em] text-slate-500 transition-colors duration-300 group-hover:text-blue-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="-mt-2 font-display text-xl leading-[1.3] font-medium transition-transform duration-500 ease-(--ease-premium) group-hover:translate-x-1.5">
                  {s.title}
                </h2>
                <p className="leading-[1.6] text-slate-400">{s.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-page pt-24 md:pt-32">
        <SectionTitle title="How it works" intro="Every project starts with the logo. You can stop after any phase." />
        <Phases />
      </section>

      {/* Download CTA */}
      <section className="container-page py-24 md:py-32">
        <Reveal className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <Symbol
            color="#FFFFFF"
            className="pointer-events-none absolute -right-10 -bottom-16 h-[280px] w-auto animate-float-slow opacity-10 md:h-[340px]"
          />
          <div className="relative max-w-[560px]">
            <h2 className="font-display text-[28px] leading-[1.2] font-medium md:text-[36px]">Want the full picture?</h2>
            <p className="mt-3 leading-[1.6] text-blue-100">
              Download our guide to see every service step by step: the logo process, the Figma design process,
              development, presentations, and the tools we use.
            </p>
          </div>
          <DownloadButton variant="light" className="relative shrink-0" />
        </Reveal>
      </section>
    </>
  );
}
