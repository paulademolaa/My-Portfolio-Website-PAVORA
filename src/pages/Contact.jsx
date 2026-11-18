import { useState } from "react";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import Select from "../components/Select.jsx";
import { serviceOptions } from "../data/content.js";
import { openBooking } from "../assistant/calendly.js";
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

// Google "G" (the email address is a Gmail account)
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-7" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

// Little calendar page: blue header with rings, "30" for the 30-min call
function CalendarMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-8" aria-hidden="true">
      <rect x="5" y="9" width="38" height="34" rx="7" fill="#fff" stroke="#DBEAFE" strokeWidth="1.5" />
      <path d="M5 16a7 7 0 0 1 7-7h24a7 7 0 0 1 7 7v3H5z" fill="#2563EB" />
      <rect x="14" y="5" width="4" height="9" rx="2" fill="#0D1631" />
      <rect x="30" y="5" width="4" height="9" rx="2" fill="#0D1631" />
      <text x="24" y="37" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="15" fill="#0D1631">30</text>
    </svg>
  );
}

// Card for the call / email options
function ContactCard({ icon, title, text, href, onClick }) {
  const inner = (
    <>
      <span className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-white shadow-[0_8px_24px_-10px_rgba(37,99,235,0.6)] transition-transform duration-500 ease-(--ease-premium) group-hover:-rotate-6 group-hover:scale-105">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
        <span className="font-display text-lg leading-[1.3] font-medium text-white">{title}</span>
        <span className="truncate text-[14px] text-slate-400 max-[359px]:text-[12.5px]">{text}</span>
      </span>
      {(href || onClick) && (
        <Icon name="arrow-up-right" className="size-5 shrink-0 text-slate-500 max-[359px]:hidden transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-400" />
      )}
    </>
  );
  const cls =
    "group flex w-full min-w-0 items-center gap-4 rounded-[20px] border border-ink-800 bg-ink-900 p-4 max-[359px]:gap-3 transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 hover:border-blue-600/60 hover:shadow-[0_16px_40px_-20px_rgba(37,99,235,0.7)]";
  if (href) return <a href={href} className={cls}>{inner}</a>;
  if (onClick) return <button type="button" onClick={onClick} className={`${cls} cursor-pointer`}>{inner}</button>;
  return <div className={cls}>{inner}</div>;
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
    const subject = encodeURIComponent(`New project inquiry: ${form.service || "General"}`);
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
          Tell me about your logo, website or pitch deck project and I'll get back to you. Prefer to talk? Book a free 30-min call.
        </Reveal>
        <Reveal delay={400} className="flex flex-col gap-5 pt-4">
          <UpworkCard />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <ContactCard
              onClick={() => openBooking()}
              icon={<CalendarMark />}
              title="Book a free call"
              text="30 minutes, on video"
            />
            {site.email ? (
              <ContactCard href={`mailto:${site.email}`} icon={<GoogleMark />} title="Email me" text={site.email} />
            ) : (
              <ContactCard icon={<GoogleMark />} title="Email coming soon" text="Reach me on Upwork for now" />
            )}
          </div>
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

          <Select
            label="Service"
            name="service"
            placeholder="Select a service"
            options={serviceOptions}
            value={form.service}
            onChange={(service) => setForm({ ...form, service })}
          />

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
