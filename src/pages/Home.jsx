import Button from "../components/Button.jsx";
import Stats from "../components/Stats.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import WorkStack from "../components/WorkStack.jsx";
import ServiceRow from "../components/ServiceRow.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Mockup from "../components/Mockups.jsx";
import Reveal from "../components/Reveal.jsx";
import { Symbol } from "../components/Logo.jsx";
import { projects } from "../data/projects.js";
import { services } from "../data/content.js";
import { site } from "../data/site.js";

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-[150px] pb-20 md:pt-[180px] lg:pb-[120px]">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-[-40px] left-1/2 h-[520px] w-[900px] max-w-[160vw] -translate-x-1/2 animate-glow rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="container-page relative flex flex-col items-center text-center">
        {/* Location pill */}
        <div className="pop-in flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900 py-1.5 pr-3.5 pl-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
          </span>
          <span className="text-xs leading-[1.6] text-slate-400 sm:text-sm">{site.location}</span>
        </div>

        {/* Big headline. Everything inside uses "em" so it scales with the font size. */}
        <h1 className="relative mt-8 font-display text-[64px] leading-[0.95] font-bold tracking-[-0.04em] uppercase sm:text-[104px] lg:text-[160px]">
          <span className="line-mask" style={{ "--delay": "150ms" }}>
            <span>Product</span>
          </span>
          <span className="line-mask" style={{ "--delay": "280ms" }}>
            <span>Designer</span>
          </span>

          {/* Your photo — replace public/images/paul-ademola.jpg to change it */}
          <img
            src="/images/paul-ademola.jpg"
            alt="Paul Ademola"
            className="pop-in absolute top-[-0.21em] left-[0.25em] size-[0.75em] rounded-full border-[3px] border-white object-cover shadow-[0_10px_40px_rgba(37,99,235,0.45)]"
            style={{ "--delay": "650ms" }}
          />

          {/* PAVORA app icon */}
          <span
            className="pop-in absolute top-[0.06em] left-[4.38em] hidden w-max sm:block"
            style={{ "--delay": "800ms" }}
          >
            <span
              className="grid size-[0.62em] animate-float place-items-center rounded-[0.14em] bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.7)]"
              style={{ "--tilt": "10deg" }}
            >
              <Symbol color="#FFFFFF" className="h-[0.37em] w-auto" />
            </span>
          </span>

          {/* Tool icons */}
          <span className="pop-in absolute top-[1.69em] left-[-0.16em] w-max" style={{ "--delay": "950ms" }}>
            <img
              src="/images/vscode.webp"
              alt=""
              className="w-[0.45em] max-w-none animate-float-slow drop-shadow-[0_12px_24px_rgba(37,99,235,0.5)]"
              style={{ "--tilt": "-12deg", animationDelay: "1s" }}
            />
          </span>
          <span
            className="pop-in absolute top-[2.75em] left-[4.4em] hidden w-max sm:block"
            style={{ "--delay": "1100ms" }}
          >
            <img
              src="/images/figma.webp"
              alt=""
              className="w-[0.54em] max-w-none animate-float drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              style={{ "--tilt": "8deg", animationDelay: "2s" }}
            />
          </span>
        </h1>

        <Reveal delay={450}>
          <p className="mt-8 font-display text-[26px] leading-[1.2] font-medium tracking-[-0.01em] sm:text-[32px] lg:text-[40px]">
            brand strategist &amp; web developer
          </p>
        </Reveal>
        <Reveal delay={550}>
          <p className="mx-auto mt-8 max-w-[480px] leading-[1.6] text-slate-400">
            Designing and building digital experiences that look exceptional and work with purpose,
            for ambitious businesses worldwide.
          </p>
        </Reveal>
        <Reveal delay={650} className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Button to="/work">Explore My Work</Button>
          <Button to="/contact" variant="secondary">
            Let's Work Together
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Upwork stats ---------------- */
function UpworkStats() {
  return (
    <section className="container-page flex flex-col items-center gap-5 pt-6">
      <Stats className="w-full" />
      <Button href={site.links.upwork} variant="link" icon="arrow-up-right">
        View my Upwork profile
      </Button>
    </section>
  );
}

/* ---------------- Selected works ---------------- */
function SelectedWorks() {
  return (
    <section id="work" className="container-page flex flex-col gap-14 pt-24 lg:pt-[120px]">
      <SectionTitle
        title="Selected Works"
        count={String(projects.length).padStart(2, "0")}
        intro="A selection of recent projects across product, brand, presentation and web development."
      />
      {/* Stacking cards — see src/components/WorkStack.jsx */}
      <WorkStack projects={projects.slice(0, 6)} />
      <Reveal className="flex justify-center">
        <Button to="/work" variant="secondary">
          View all works
        </Button>
      </Reveal>
    </section>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  return (
    <section id="services" className="container-page flex scroll-mt-24 flex-col gap-14 pt-28 lg:pt-40">
      <SectionTitle
        title="Services"
        intro="From first idea to launch — five ways I help founders and teams bring their ideas to life."
      />
      <div className="border-t border-ink-800">
        {services.map((service, i) => (
          <ServiceRow key={service.title} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- About teaser ---------------- */
function AboutTeaser() {
  const photos = [
    { kind: "photo", offset: "lg:mt-0", tilt: "lg:-rotate-3" },
    { kind: "web", offset: "lg:mt-4", tilt: "lg:rotate-2" },
    { kind: "brand", offset: "lg:mt-1", tilt: "lg:-rotate-1" },
    { kind: "mobile", offset: "lg:mt-5", tilt: "lg:rotate-3" },
  ];

  return (
    <section className="container-page pt-28 lg:pt-40">
      <Reveal className="relative flex flex-col items-center gap-7 overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 px-5 pt-16 pb-12 text-center md:px-16 md:pt-24 md:pb-[72px]">
        <div className="pointer-events-none absolute -top-[180px] left-1/2 h-[300px] w-[700px] -translate-x-1/2 animate-glow rounded-full bg-blue-600 blur-[160px]" />
        <h2 className="relative font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[64px]">
          Beyond the pixels
        </h2>
        <p className="relative max-w-[500px] leading-[1.6] text-slate-400">
          I'm Paul — a multidisciplinary designer who believes great design should solve problems,
          communicate value and create meaningful experiences.
        </p>
        <Button to="/about" variant="light" className="relative">
          More About Me
        </Button>

        <div className="relative mt-6 grid w-full max-w-[1000px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {photos.map((p, i) => (
            <Reveal key={i} delay={i * 100} className={p.offset}>
              <div
                className={`group aspect-[220/270] overflow-hidden rounded-2xl transition-all duration-700 ease-(--ease-premium) hover:-translate-y-3 hover:rotate-0 ${p.tilt}`}
              >
                {p.kind === "photo" ? (
                  <img
                    src="/images/paul-ademola.jpg"
                    alt="Paul Ademola"
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Mockup kind={p.kind} className="size-full" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <UpworkStats />
      <SelectedWorks />
      <Services />
      <AboutTeaser />
      <Testimonials />
    </>
  );
}
