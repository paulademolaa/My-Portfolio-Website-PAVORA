import { useState } from "react";
import SectionTitle from "../components/SectionTitle.jsx";
import WorkCard from "../components/WorkCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { projects } from "../data/projects.js";

// Filter names. Each project's "category" in src/data/projects.js must match one.
const filters = [
  "All",
  "Product Design",
  "Brand Identity",
  "Graphic Design",
  "Presentations",
  "Web Development",
];

export default function Work() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="container-page pt-[150px] pb-28 md:pt-[190px] lg:pb-40">
      <SectionTitle
        as="h1"
        title="All Works"
        count={String(projects.length).padStart(2, "0")}
        intro="Digital products, brand identities and presentations shaped by strategy and thoughtful execution."
      />

      {/* Filter chips */}
      <Reveal delay={200} className="mt-10 mb-10 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={`cursor-pointer rounded-full border px-[18px] py-2.5 text-sm leading-[1.5] font-medium transition-all duration-300 ease-(--ease-premium) active:scale-95 ${
              active === filter
                ? "border-white bg-white text-ink-950"
                : "border-ink-700 text-slate-400 hover:bg-ink-800 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </Reveal>

      {/* key={active} replays the card animation when the filter changes */}
      <div key={active} className="grid gap-6 md:grid-cols-2 lg:gap-10">
        {shown.map((project, i) => (
          <WorkCard key={project.slug} project={project} delay={(i % 2) * 120} />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-20 text-center text-slate-400">
          No projects in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}
