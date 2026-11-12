import { site } from "../data/site.js";

// Opens Paul's Calendly booking page in a pop-up over the site.
// The visitor's name and email are filled in for them when the chat
// already knows them. If Calendly can't load (offline, blocked),
// the booking page opens in a new tab instead.

const SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
const STYLES = "https://assets.calendly.com/assets/external/widget.css";

let loading;
function loadCalendly() {
  if (window.Calendly) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = STYLES;
      document.head.appendChild(css);

      const js = document.createElement("script");
      js.src = SCRIPT;
      js.async = true;
      js.onload = () => resolve();
      js.onerror = () => {
        loading = null;
        reject(new Error("Calendly failed to load"));
      };
      document.head.appendChild(js);
    });
  }
  return loading;
}

export function bookingUrl(prefill = {}) {
  const url = new URL(site.links.calendly);
  if (prefill.name) url.searchParams.set("name", prefill.name);
  if (prefill.email) url.searchParams.set("email", prefill.email);
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}

export async function openBooking(prefill) {
  const url = bookingUrl(prefill);
  try {
    await loadCalendly();
    window.Calendly.initPopupWidget({ url });
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// Calls `onBooked` when the visitor finishes booking in the pop-up
export function onCalendlyBooked(onBooked) {
  const listener = (e) => {
    if (e.origin === "https://calendly.com" && e.data?.event === "calendly.event_scheduled") onBooked();
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
