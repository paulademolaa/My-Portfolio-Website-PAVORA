import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Symbol } from "../components/Logo.jsx";
import Icon from "../components/Icons.jsx";
import ChatPanel from "./ChatPanel.jsx";

// Floating "Ask PAVORA" button + chat window, shown on every page.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const { pathname } = useLocation();

  // A small "Questions?" bubble appears after a few seconds (once per visit)
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("pavora-teaser") === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    const t = setTimeout(() => setTeaser(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const hideTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem("pavora-teaser", "1");
    } catch {
      /* ignore */
    }
  };

  const openChat = () => {
    hideTeaser();
    setOpen(true);
  };

  // Close with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The FAQ page has its own big chat, so hide the floating one there
  if (pathname === "/faq") return null;

  return (
    <>
      {/* Chat window */}
      <div
        role="dialog"
        aria-label="PAVORA Assistant"
        aria-hidden={!open}
        className={`fixed z-[70] origin-bottom-right transition-all duration-500 ease-(--ease-premium) max-sm:inset-0 sm:right-6 sm:bottom-24 sm:h-[min(640px,calc(100vh-8rem))] sm:w-[400px] ${
          open ? "visible scale-100 opacity-100" : "invisible pointer-events-none scale-90 opacity-0 sm:translate-y-4"
        }`}
      >
        <ChatPanel
          storageKey="pavora-assistant"
          onClose={() => setOpen(false)}
          onNavigate={() => setOpen(false)}
          className="h-full border-ink-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:border"
        />
      </div>

      {/* "Questions?" teaser bubble */}
      {teaser && !open && (
        <div className="animate-fade-in fixed right-6 bottom-24 z-[65] flex max-w-[260px] items-start gap-2 rounded-2xl rounded-br-md border border-ink-700 bg-ink-900 p-3.5 shadow-2xl">
          <button type="button" onClick={openChat} className="cursor-pointer text-left text-[13px] leading-relaxed text-slate-200">
            👋 Questions about working with Paul? <span className="font-semibold text-white">Ask me anything.</span>
          </button>
          <button type="button" onClick={hideTeaser} aria-label="Dismiss" className="cursor-pointer text-slate-500 hover:text-white">
            <Icon name="close" className="size-4" />
          </button>
        </div>
      )}

      {/* Launcher button */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "Close chat" : "Ask the PAVORA assistant"}
        className={`group fixed right-5 bottom-5 z-[66] grid size-14 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 shadow-[0_12px_40px_-8px_rgba(37,99,235,0.8)] transition-all duration-500 ease-(--ease-premium) hover:scale-110 active:scale-95 sm:right-6 sm:bottom-6 ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/40 [animation-duration:2.5s]" />}
        <span className={`relative transition-all duration-500 ${open ? "rotate-90 scale-0 opacity-0" : "scale-100 opacity-100"}`}>
          <Symbol color="#FFFFFF" className="h-6 w-auto" />
        </span>
        <span className={`absolute transition-all duration-500 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}>
          <Icon name="close" className="size-6 text-white" />
        </span>
      </button>
    </>
  );
}
