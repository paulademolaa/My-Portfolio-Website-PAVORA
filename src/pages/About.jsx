import Stats from "../components/Stats.jsx";
import Reveal from "../components/Reveal.jsx";
import { whatIDo, tools, process, experience } from "../data/content.js";

function ListColumn({ title, items, delay }) {
  return (
    <Reveal delay={delay} className="flex flex-col">
      <h2 className="font-display text-2xl leading-[1.3] font-medium tracking-[-0.005em]">{title}</h2>
      <ul className="pt-6">
        {items.map((item) => (
          <li
            key={item}
            className="group flex items-center gap-3 border-b border-ink-800 py-3.5 leading-[1.6] text-slate-400 transition-colors duration-300 hover:text-white"
          >
            <span className="h-px w-0 bg-blue-500 transition-all duration-500 ease-(--ease-premium) group-hover:w-4" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function About() {
  // Replace these files in public/images/about/ with your own photos
  const photos = [
    { src: "/images/about/photo-1.jpg", tilt: "lg:-rotate-2", offset: "" },
    { src: "/images/about/photo-2.jpg", tilt: "lg:rotate-2", offset: "lg:mt-3" },
    { src: "/images/about/photo-3.jpg", tilt: "lg:-rotate-1", offset: "" },
    { src: "/images/about/photo-4.jpg", tilt: "lg:rotate-3", offset: "lg:mt-4" },
  ];

  return (
    <>
      {/* Intro */}
      <section className="container-page flex flex-col items-center gap-7 pt-[150px] pb-20 text-center md:pt-[193px]">
        <div className="pop-in h-[200px] w-40 overflow-hidden rounded-2xl" style={{ "--delay": "100ms" }}>
          <img src="/images/paul-ademola.jpg" alt="Paul Ademola" className="size-full object-cover" />
        </div>
        <h1 className="font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[64px]">
          <span className="line-mask" style={{ "--delay": "250ms" }}>
            <span>The person behind the pixels</span>
          </span>
        </h1>
        <Reveal delay={400} as="p" className="max-w-[720px] text-lg leading-[1.6] text-slate-400">
          I'm Paul Ademola, a designer and web developer in Nigeria working with clients worldwide. I
          combine product thinking, brand strategy and visual design — then build it with React and
          Tailwind CSS, so what you approve is what ships.
        </Reveal>
      </section>

      <div className="container-page">
        <Stats />
      </div>

      {/* What I do / Tools / How I work */}
      <section className="container-page grid gap-12 pt-20 md:grid-cols-3 md:gap-10">
        <ListColumn title="What I do" items={whatIDo} delay={0} />
        <ListColumn title="Tools" items={tools} delay={120} />
        <ListColumn title="How I work" items={process} delay={240} />
      </section>

      {/* Experience */}
      <section className="container-page flex flex-col gap-6 pt-24 lg:pt-[120px]">
        <Reveal as="h2" className="font-display text-2xl leading-[1.3] font-medium">
          Experience
        </Reveal>
        <div>
          {experience.map((job, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="grid gap-1 border-b border-ink-800 py-5 transition-colors duration-300 hover:bg-ink-900/60 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-6 md:px-2">
                <span className="font-display text-lg leading-[1.3] font-medium">{job.role}</span>
                <span className="leading-[1.6] text-slate-400">{job.place}</span>
                <span className="leading-[1.6] text-slate-500">{job.years}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Photos */}
      <section className="container-page grid grid-cols-2 gap-5 py-24 md:grid-cols-4 lg:py-[120px]">
        {photos.map((photo, i) => (
          <Reveal key={photo.src} delay={i * 100} className={photo.offset}>
            <div
              className={`aspect-[280/340] overflow-hidden rounded-2xl transition-all duration-700 ease-(--ease-premium) hover:-translate-y-3 hover:rotate-0 ${photo.tilt}`}
            >
              <img src={photo.src} alt="" loading="lazy" className="size-full object-cover" />
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
