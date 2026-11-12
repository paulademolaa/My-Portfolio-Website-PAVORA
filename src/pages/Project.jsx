import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import NotFound from "./NotFound.jsx";
import { projects } from "../data/projects.js";

// Individual project page — editorial case-study layout:
// back link → category → big title → one-line summary → details row →
// cover → numbered story sections, each followed by a full-width picture →
// next projects.

const label = "text-[12px] leading-[1.4] font-medium tracking-[0.12em] uppercase";

// A picture that fades up and settles from a slight zoom as it appears
function Picture({ src, alt, className = "" }) {
  return (
    <Reveal className={`group overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-premium) group-hover:scale-[1.02]"
      />
    </Reveal>
  );
}

// 01 — Challenge — text
function StorySection({ number, title, text }) {
  return (
    <section className="grid gap-3 border-t border-ink-800 pt-8 pb-14 md:grid-cols-[72px_1fr_1.35fr] md:gap-8 md:pt-10 md:pb-20">
      <Reveal as="span" className={`${label} pt-2 text-slate-500`}>
        {number}
      </Reveal>
      <Reveal as="h2" delay={80} className="font-display text-[26px] leading-[1.2] font-medium tracking-[-0.01em] md:text-[30px]">
        {title}
      </Reveal>
      <Reveal as="p" delay={160} className="max-w-[520px] text-[17px] leading-[1.65] text-slate-400 md:text-lg">
        {text}
      </Reveal>
    </section>
  );
}

// Card used in "Next project"
function NextCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="group flex flex-col gap-4">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
        <img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-(--ease-premium) group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-[1.3] font-medium transition-colors duration-300 group-hover:text-blue-400 md:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1 text-[15px] text-slate-500">{project.type}</p>
        </div>
        <span className={`${label} shrink-0 pt-1.5 text-slate-500`}>{project.year}</span>
      </div>
    </Link>
  );
}

export default function Project() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return <NotFound />;

  const project = projects[index];
  const nextProjects = [1, 2].map((n) => projects[(index + n) % projects.length]).filter((p) => p.slug !== project.slug);

  const meta = [
    ["Client", project.client],
    ["Role", project.role || project.services],
    ["Year", project.year],
    ["Tools", project.tools],
  ].filter(([, v]) => v);

  // The story: each section is followed by one picture
  const pictures = [...(project.gallery || []), project.finalImage].filter(Boolean);
  const sections = [
    ["Challenge", project.challenge],
    ["Approach", project.approach || project.solution],
    ["Outcome", project.outcome],
  ].filter(([, text]) => text);

  return (
    <article className="mx-auto w-full max-w-[1000px] px-5 md:px-8">
      {/* Header */}
      <header className="flex flex-col pt-[140px] md:pt-[170px]">
        <Reveal>
          <Link
            to="/work"
            className="group inline-flex items-center gap-1.5 border-b border-slate-500 pb-0.5 text-[15px] font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-400"
          >
            <Icon name="arrow-left" className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All work
          </Link>
        </Reveal>

        <Reveal as="p" delay={60} className={`${label} mt-8 text-blue-400`}>
          {project.type}
        </Reveal>

        <h1 className="mt-5 font-display text-[44px] leading-[1] font-medium tracking-[-0.035em] sm:text-[64px] md:text-[96px]">
          <span className="line-mask" style={{ "--delay": "120ms" }}>
            <span>{project.title}</span>
          </span>
        </h1>

        <Reveal as="p" delay={220} className="mt-6 max-w-[680px] text-xl leading-[1.45] text-slate-200 md:text-2xl">
          {project.summary}
        </Reveal>

        <Reveal delay={300} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 md:mt-16 md:grid-cols-4">
          {meta.map(([name, value]) => (
            <div key={name} className="flex flex-col gap-2 border-t border-ink-800 pt-3">
              <span className={`${label} text-slate-500`}>{name}</span>
              <span className="text-[15px] leading-[1.5] text-white">{value}</span>
            </div>
          ))}
        </Reveal>
      </header>

      {/* Cover */}
      <Picture src={project.cover} alt={project.title} className="mt-14 aspect-[16/10] md:mt-20" />

      {/* Story */}
      <div className="mt-20 md:mt-28">
        {sections.map(([title, text], i) => (
          <div key={title}>
            <StorySection number={String(i + 1).padStart(2, "0")} title={title} text={text} />
            {pictures[i] && (
              <Picture
                src={pictures[i]}
                alt={`${project.title}: ${title.toLowerCase()}`}
                className="mb-14 aspect-[16/10] md:mb-20"
              />
            )}
          </div>
        ))}
        {/* any pictures left over */}
        {pictures.slice(sections.length).map((src, i) => (
          <Picture key={src + i} src={src} alt={`${project.title} detail`} className="mb-14 aspect-[16/10] md:mb-20" />
        ))}
      </div>

      {/* Next project */}
      {nextProjects.length > 0 && (
        <section className="pt-12 pb-28 md:pt-20 md:pb-40">
          <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
            <Reveal as="h2" className="font-display text-[40px] leading-[1] font-medium tracking-[-0.03em] md:text-[64px]">
              Next project
            </Reveal>
            <Reveal delay={100}>
              <Link
                to="/work"
                className="group mb-1 inline-flex items-center gap-1 border-b border-slate-500 pb-0.5 text-[15px] font-medium whitespace-nowrap transition-colors hover:border-blue-400 hover:text-blue-400"
              >
                All projects
                <Icon name="arrow-up-right" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>
          <div className="grid gap-10 md:grid-cols-2 md:gap-6">
            {nextProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <NextCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
