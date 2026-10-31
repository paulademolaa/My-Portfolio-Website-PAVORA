import Reveal from "./Reveal.jsx";

// Section heading: title (+ optional count) on the left, intro on the right
export default function SectionTitle({ title, count, intro, as: Heading = "h2" }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <Reveal className="flex items-start gap-1.5">
        <Heading className="font-display text-[32px] leading-[1.2] font-medium tracking-[-0.01em] md:text-[40px]">
          {title}
        </Heading>
        {count && (
          <span className="text-[13px] leading-[1.3] font-medium tracking-[0.1em] text-slate-400">
            ({count})
          </span>
        )}
      </Reveal>
      {intro && (
        <Reveal delay={120} as="p" className="max-w-[440px] text-base leading-[1.6] md:text-right md:text-lg">
          {intro}
        </Reveal>
      )}
    </div>
  );
}
