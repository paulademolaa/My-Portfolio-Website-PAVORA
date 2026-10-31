import Mockup from "./Mockups.jsx";
import Reveal from "./Reveal.jsx";

// One row in the Services list: number + name, description, illustration
export default function ServiceRow({ service, index }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal>
      <div className="group grid cursor-default gap-6 border-b border-ink-800 py-10 transition-colors duration-500 md:grid-cols-[300px_1fr] md:items-center md:gap-12 lg:grid-cols-[300px_340px_1fr]">
        <div className="flex flex-col gap-4">
          <span className="text-[13px] leading-[1.3] font-medium tracking-[0.1em] text-slate-500 transition-colors duration-300 group-hover:text-blue-500">
            {number}
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
  );
}
