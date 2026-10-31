import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import WorkCard from "../components/WorkCard.jsx";
import NotFound from "./NotFound.jsx";
import { projects } from "../data/projects.js";

// A picture that zooms in slightly as it appears
function Picture({ src, alt, className = "" }) {
  return (
    <Reveal className={`overflow-hidden rounded-2xl bg-ink-900 ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
    </Reveal>
  );
}

function TextBlock({ title, children }) {
  return (
    <section className="container-page grid gap-4 pt-16 pb-12 md:grid-cols-[480px_1fr] md:pt-24 md:pb-16">
      <Reveal as="h2" className="font-display text-2xl leading-[1.3] font-medium tracking-[-0.005em]">
        {title}
      </Reveal>
      <Reveal delay={120} as="p" className="text-lg leading-[1.6] text-slate-400">
        {children}
      </Reveal>
    </section>
  );
}

export default function Project() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return <NotFound />;

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const meta = [
    ["Client", project.client],
    ["Services", project.services],
    ["Year", project.year],
    ["Tools", project.tools],
  ];

  return (
    <>
      {/* Header */}
      <header className="container-page flex flex-col gap-6 pt-[150px] pb-12 md:pt-[177px]">
        <Link
          to="/work"
          className="group flex w-fit items-center gap-1.5 text-sm leading-[1.6] text-slate-400 transition-colors hover:text-white"
        >
          <Icon name="arrow-left" className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          All works
        </Link>
        <h1 className="font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[64px]">
          <span className="line-mask" style={{ "--delay": "100ms" }}>
            <span>{project.title}</span>
          </span>
        </h1>
        <Reveal delay={200} as="p" className="max-w-[640px] text-lg leading-[1.6] text-slate-400">
          {project.summary}
        </Reveal>
        <Reveal delay={300} className="grid grid-cols-2 gap-6 border-t border-ink-800 pt-6 md:grid-cols-4">
          {meta.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1.5">
              <span className="text-sm leading-[1.6] text-slate-500">{label}</span>
              <span className="font-medium leading-[1.6]">{value}</span>
            </div>
          ))}
        </Reveal>
      </header>

      {/* Main picture */}
      <div className="container-page">
        <Picture src={project.cover} alt={project.title} className="aspect-[16/9]" />
      </div>

      <TextBlock title="The challenge">{project.challenge}</TextBlock>

      <div className="container-page grid gap-6 md:grid-cols-2">
        {project.gallery.map((src, i) => (
          <Picture key={i} src={src} alt={`${project.title} detail ${i + 1}`} className="aspect-[628/520]" />
        ))}
      </div>

      <TextBlock title="The solution">{project.solution}</TextBlock>

      <div className="container-page">
        <Picture src={project.finalImage} alt={`${project.title} final design`} className="aspect-[2/1]" />
      </div>

      {/* Next project */}
      <section className="container-page flex flex-col gap-6 pt-24 pb-28 lg:pt-[120px] lg:pb-40">
        <Reveal as="h2" className="font-display text-2xl leading-[1.3] font-medium">
          Next project
        </Reveal>
        <div className="md:max-w-[620px]">
          <WorkCard project={next} />
        </div>
      </section>
    </>
  );
}
