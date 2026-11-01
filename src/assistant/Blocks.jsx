import { Link } from "react-router-dom";
import Icon from "../components/Icons.jsx";
import { ACTIONS, upworkRating, upworkReviews } from "../data/assistant.js";
import { services, tools, process } from "../data/content.js";
import { projects } from "../data/projects.js";
import { site } from "../data/site.js";

// Turns **bold** and [text](link) into real formatting
export function RichText({ text, onNavigate }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, url] = link;
      return url.startsWith("/") ? (
        <Link key={i} to={url} onClick={onNavigate} className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
          {label}
        </Link>
      ) : (
        <a key={i} href={url} target="_blank" rel="noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
          {label}
        </a>
      );
    }
    return part;
  });
}

function Stars({ value }) {
  return (
    <span className="flex gap-0.5 text-amber-400" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={`size-3.5 ${n <= Math.round(value) ? "" : "opacity-25"}`} fill="currentColor" aria-hidden="true">
          <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

const serviceAsk = {
  "Product Design": "What does product design include?",
  "Brand Strategy & Identity": "What is included in brand identity?",
  "Graphic Design": "Do you do graphic design?",
  "Presentation Design": "Do you design pitch decks?",
  "Web Development": "Can you build my website?",
};

// Cards the assistant can show inside a message
function Card({ type, filter, limit, onAsk, onNavigate }) {
  if (type === "services") {
    return (
      <div className="grid gap-2">
        {services.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => onAsk(serviceAsk[s.title] || s.title)}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-ink-700 bg-ink-950/60 p-3 text-left transition-all duration-300 hover:border-blue-500/60 hover:bg-ink-800"
          >
            <span className="font-display text-xs font-bold text-blue-400">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-white">{s.title}</span>
              <span className="line-clamp-1 text-xs text-slate-400">{s.description}</span>
            </span>
            <Icon name="arrow-right" className="size-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
          </button>
        ))}
      </div>
    );
  }

  if (type === "tools") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {tools.map((t) => (
          <div key={t.name} className="flex items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-950/60 p-2.5">
            {t.logo ? (
              <img src={t.logo} alt="" className="size-8 object-contain" />
            ) : (
              <span className="grid size-8 place-items-center rounded-lg bg-ink-800 font-display text-[11px] font-bold text-blue-300">
                {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[13px] leading-tight font-medium text-white">{t.name}</span>
              <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-slate-400">{t.caption}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "process") {
    return (
      <ol className="grid gap-2">
        {process.map((p, i) => (
          <li key={p.title} className="flex gap-3 rounded-xl bg-gradient-to-r from-blue-600/25 to-transparent p-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/90 font-display text-[11px] font-bold text-ink-950">
              {i + 1}
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{p.title}</span>
              <span className="block text-xs leading-relaxed text-slate-300">{p.text}</span>
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (type === "projects") {
    const list = (filter ? projects.filter((p) => p.category === filter) : projects).slice(0, 4);
    if (!list.length) return null;
    return (
      <div className="-mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-1">
        {list.map((p) => (
          <Link
            key={p.slug}
            to={`/work/${p.slug}`}
            onClick={onNavigate}
            className="group w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-ink-700 bg-ink-950/60 transition-colors hover:border-blue-500/60"
          >
            <span className="block aspect-[4/3] overflow-hidden">
              <img src={p.cover} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </span>
            <span className="block p-2.5">
              <span className="line-clamp-1 text-xs font-medium text-white">{p.title}</span>
              <span className="line-clamp-1 text-[11px] text-slate-400">{p.type}</span>
            </span>
          </Link>
        ))}
      </div>
    );
  }

  if (type === "reviews") {
    // filter = a service name, e.g. "Brand Identity" (shows matching reviews only)
    const quoted = upworkReviews.filter((r) => r.quote && (!filter || r.service === filter));
    if (!quoted.length) return null;
    return (
      <div className="grid gap-2">
        {filter && <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">What a client said</p>}
        {quoted.slice(0, limit || 3).map((r) => (
          <figure key={r.project} className="rounded-xl border border-ink-700 bg-ink-950/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <Stars value={r.rating} />
              <span className="text-[11px] text-slate-500">{r.date}</span>
            </div>
            <blockquote className="mt-2 text-[13px] leading-relaxed text-slate-200">“{r.quote}”</blockquote>
            <figcaption className="mt-1.5 text-xs text-slate-400">
              <span className="font-medium text-slate-200">{r.client || "Upwork client"}</span> · {r.project}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  if (type === "rating") {
    return (
      <a
        href={site.links.upwork}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-xl border border-upwork/40 bg-upwork/10 p-3 transition-colors hover:bg-upwork/20"
      >
        <span className="font-display text-3xl font-bold text-white">{upworkRating.score}</span>
        <span className="flex-1">
          <Stars value={upworkRating.score} />
          <span className="mt-1 block text-xs text-slate-300">
            from {upworkRating.count} verified Upwork reviews
          </span>
        </span>
        <Icon name="arrow-up-right" className="size-4 text-slate-400" />
      </a>
    );
  }

  return null;
}

// Buttons under a message
function Actions({ items, onAction, onNavigate }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((key, i) => {
        const a = ACTIONS[key];
        if (!a) return null;
        const cls = `inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-300 active:scale-95 ${
          i === 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-ink-700 text-white hover:bg-ink-800"
        }`;
        if (a.action) {
          return (
            <button key={key} type="button" onClick={() => onAction(a.action)} className={cls}>
              {a.label}
              <Icon name="arrow-right" className="size-3.5" />
            </button>
          );
        }
        if (a.to) {
          return (
            <Link key={key} to={a.to} onClick={onNavigate} className={cls}>
              {a.label}
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
          );
        }
        return (
          <a key={key} href={a.href} target="_blank" rel="noreferrer" className={cls}>
            {a.label}
            <Icon name="arrow-up-right" className="size-3.5" />
          </a>
        );
      })}
    </div>
  );
}

// Renders one assistant answer (a list of blocks)
export default function Blocks({ blocks, onAsk, onAction, onNavigate }) {
  return (
    <div className="flex flex-col gap-2.5">
      {blocks.map((b, i) => {
        if (b.text)
          return (
            <p key={i} className="text-[14px] leading-relaxed text-slate-200">
              <RichText text={b.text} onNavigate={onNavigate} />
            </p>
          );
        if (b.list)
          return (
            <ul key={i} className="flex flex-col gap-1.5 text-[14px] leading-relaxed text-slate-200">
              {b.list.map((item) => (
                <li key={item} className="flex gap-2">
                  <Icon name="check" className="mt-1 size-3.5 shrink-0 text-blue-400" />
                  <span>
                    <RichText text={item} onNavigate={onNavigate} />
                  </span>
                </li>
              ))}
            </ul>
          );
        if (b.card) return <Card key={i} type={b.card} filter={b.filter} limit={b.limit} onAsk={onAsk} onNavigate={onNavigate} />;
        if (b.actions) return <Actions key={i} items={b.actions} onAction={onAction} onNavigate={onNavigate} />;
        return null;
      })}
    </div>
  );
}
