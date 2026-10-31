import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";
import Reveal from "./Reveal.jsx";

// Project card used on Home, Work and Project pages.
// The picture comes from "cover" in src/data/projects.js
export default function WorkCard({ project, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/work/${project.slug}`}
        className="group flex cursor-pointer flex-col gap-5 rounded-2xl border border-ink-800 bg-ink-900 p-4 pb-6 transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1.5 hover:bg-ink-800 hover:shadow-[0_30px_60px_-30px_rgba(37,99,235,0.45)] md:p-6 md:pb-7"
      >
        <div className="relative aspect-[570/400] overflow-hidden rounded-xl bg-ink-800">
          <img
            src={project.cover}
            alt={`${project.title} — ${project.type}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1200ms] ease-(--ease-premium) group-hover:scale-[1.06]"
          />
          {/* Arrow button that appears on hover */}
          <span className="absolute top-4 right-4 grid size-11 scale-50 place-items-center rounded-full bg-white text-ink-950 opacity-0 transition-all duration-500 ease-(--ease-premium) group-hover:scale-100 group-hover:rotate-45 group-hover:opacity-100">
            <Icon name="arrow-up-right" className="size-5 -rotate-45" />
          </span>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <h3 className="font-display text-xl leading-[1.3] font-medium tracking-[-0.005em] transition-colors duration-300 group-hover:text-blue-400">
            {project.title}
          </h3>
          <p className="leading-[1.6] text-slate-400">{project.type}</p>
        </div>
      </Link>
    </Reveal>
  );
}
