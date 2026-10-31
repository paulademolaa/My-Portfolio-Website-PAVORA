import { useState } from "react";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import { serviceOptions } from "../data/content.js";
import { site, stats } from "../data/site.js";

const inputClass =
  "w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3.5 leading-[1.6] text-white placeholder:text-slate-500 transition-all duration-300 hover:border-slate-500/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-600/20 focus:outline-none";

function Field({ label, id, children }) {
  return (
    <label htmlFor={id} className="flex flex-1 cursor-pointer flex-col gap-2">
      <span className="font-medium leading-[1.6]">{label}</span>
      {children}
    </label>
  );
}

// Green "Hire me on Upwork" card
function UpworkCard() {
  const show = stats.filter((s) => s.label !== "Years of experience");

  return (
    <div className="group relative flex flex-col gap-5 overflow-hidden rounded-[20px] bg-upwork p-8 transition-transform duration-500 ease-(--ease-premium) hover:-translate-y-1">
      <span className="pointer-events-none absolute -top-[90px] -right-[90px] size-[200px] rounded-full border-[22px] border-white/10 transition-transform duration-700 group-hover:scale-125" />
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-[14px] bg-white text-upwork">
          <Icon name="upwork" className="size-[26px]" />
        </span>
        <span className="rounded-full bg-upwork-dark px-3 py-1.5 text-[13px] font-medium">
          Hire with confidence
        </span>
      </div>
      <h2 className="font-display text-[32px] leading-[1.2] font-medium tracking-[-0.01em] md:text-[40px]">
        Prefer Upwork? Hire me there.
      </h2>
      <p className="leading-[1.6]">
        Start a contract with Upwork’s payment protection and read verified client reviews.
      </p>
      <div className="flex gap-7 py-1">
        {show.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <span className="font-display text-2xl leading-[1.3] font-medium">
              {s.value}
              {s.suffix}
            </span>
            <span className="text-sm leading-[1.6] opacity-80">{s.label}</span>
          </div>
        ))}
      </div>
      <a
        href={site.links.upwork}
        target="_blank"
        rel="noreferrer"
        className="group/btn inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-white px-[22px] py-3.5 text-[15px] font-medium text-upwork-dark transition-all duration-300 hover:bg-blue-100 active:scale-95"
      >
        Hire Me on Upwork
        <Icon
          name="arrow-up-right"
          className="size-[18px] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      </a>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", details: "" });
  const [sent, setSent] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // There's no server, so the form opens the visitor's email app with the
  // message filled in. Add your email in src/data/site.js to switch this on.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!site.email) {
      window.open(site.links.upwork, "_blank", "noreferrer");
      return;
    }
    const subject = encodeURIComponent(`New project inquiry — ${form.service || "General"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\n${form.details}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="container-page grid gap-12 pt-[150px] pb-28 md:pt-[193px] lg:grid-cols-[520px_1fr] lg:gap-20 lg:pb-[120px]">
      {/* Left column */}
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[64px]">
          <span className="line-mask" style={{ "--delay": "100ms" }}>
            <span>Let's create</span>
          </span>
          <span className="line-mask" style={{ "--delay": "200ms" }}>
            <span>something meaningful.</span>
          </span>
        </h1>
        <Reveal delay={300} as="p" className="text-lg leading-[1.6] text-slate-400">
          Share a few details about your project and I'll get back to you.
        </Reveal>
        <Reveal delay={400} className="flex flex-col gap-5 pt-4">
          <UpworkCard />
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="flex w-fit items-center gap-2.5 font-medium transition-colors hover:text-blue-500"
            >
              <Icon name="mail" />
              {site.email}
            </a>
          ) : (
            <p className="flex items-center gap-2.5 font-medium text-slate-400">
              <Icon name="mail" />
              Email coming soon — reach me on Upwork for now.
            </p>
          )}
        </Reveal>
      </div>

      {/* Form */}
      <Reveal delay={250} className="self-start">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-ink-800 bg-ink-900 p-6 md:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
            <Field label="Name" id="name">
              <input id="name" name="name" required value={form.name} onChange={update} placeholder="Your name" className={inputClass} />
            </Field>
            <Field label="Email" id="email">
              <input id="email" name="email" type="email" required value={form.email} onChange={update} placeholder="you@company.com" className={inputClass} />
            </Field>
          </div>

          <Field label="Service" id="service">
            <span className="relative">
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={update}
                className={`${inputClass} cursor-pointer appearance-none pr-12 ${form.service ? "" : "text-slate-500"}`}
              >
                <option value="">Select a service</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s} className="text-ink-950">
                    {s}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-slate-400" />
            </span>
          </Field>

          <Field label="Project details" id="details">
            <textarea
              id="details"
              name="details"
              rows={5}
              value={form.details}
              onChange={update}
              placeholder="Tell me about your goals, timeline and what success looks like…"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit">Send Inquiry</Button>
            {sent && (
              <span className="animate-fade-in flex items-center gap-2 text-sm text-slate-400">
                <Icon name="check" className="size-4 text-blue-500" />
                Your email app should open with the message ready.
              </span>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
}
