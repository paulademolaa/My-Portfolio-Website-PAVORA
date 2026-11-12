import { useEffect, useRef, useState } from "react";
import Mockup from "./Mockups.jsx";
import Reveal from "./Reveal.jsx";

// One step in the Services process: node on the line, name, description, illustration.
// `fill` = how far (in px) the line has been drawn; the step lights up once it reaches the node.
export default function ServiceRow({ service, index, fill = 0 }) {
  const number = String(index + 1).padStart(2, "0");
  const ref = useRef(null);
  const [top, setTop] = useState(Infinity);

  // Where this step's node sits on the line (re-checked as the page lays out)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Phones: node sits next to the title. Tablet and up: centred on the row.
    setTop(el.offsetTop + (window.innerWidth >= 768 ? el.offsetHeight / 2 : 52));
  }, [fill]);

  const active = fill >= top;

  return (
    <div ref={ref} className="relative">
      {/* Node on the process line */}
      <span
        className={`absolute top-9 -left-12 md:top-1/2 md:-translate-y-1/2 z-10 grid size-8 place-items-center rounded-full border text-[11px] font-semibold transition-all duration-500 ease-(--ease-premium) md:-left-20 md:size-12 md:text-[13px] ${
          active
            ? "scale-100 border-blue-400 bg-blue-600 text-white shadow-[0_0_0_6px_rgba(37,99,235,0.15),0_8px_30px_-4px_rgba(37,99,235,0.7)]"
            : "scale-90 border-ink-700 bg-ink-900 text-slate-500"
        }`}
        aria-hidden="true"
      >
        {number}
      </span>

      <Reveal>
        <div
          className={`group grid cursor-default gap-6 border-b border-ink-800 py-10 transition-opacity duration-700 md:grid-cols-[260px_1fr] md:items-center md:gap-12 lg:grid-cols-[260px_340px_1fr] ${
            active ? "opacity-100" : "opacity-60"
          }`}
        >
          <div className="flex flex-col gap-2">
            <span
              className={`text-[13px] leading-[1.3] font-medium tracking-[0.1em] uppercase transition-colors duration-500 ${
                active ? "text-blue-400" : "text-slate-500"
              }`}
            >
              Step {number}
            </span>
            <h3 className="font-display text-xl leading-[1.3] font-medium tracking-[-0.005em] transition-transform duration-500 ease-(--ease-premium) group-hover:translate-x-2">
              {service.title}
            </h3>
          </div>
          <p className="leading-[1.6] text-slate-400 lg:max-w-[340px]">{service.description}</p>
          <Mockup
            kind={service.art}
            className="aspect-[420/260] w-full transition-all duration-700 ease-(--ease-premium) md:col-span-2 lg:col-span-1 lg:ml-auto lg:max-w-[420px] lg:group-hover:-rotate-2"
          />
        </div>
      </Reveal>
    </div>
  );
}
