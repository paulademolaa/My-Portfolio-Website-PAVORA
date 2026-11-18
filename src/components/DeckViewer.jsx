import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Icon from "./Icons.jsx";

// Full-screen slide viewer for presentation projects (project.deck).
// The original PDF is never put on the site: each page is shown as an
// image (1280px for phones, 2560px for large screens), with no download
// or print button, and right-click / drag-to-save switched off.

const pad = (n) => String(n).padStart(2, "0");
const noSave = (e) => e.preventDefault();

export default function DeckViewer({ project }) {
  const { path, pages, ratio = 16 / 9 } = project.deck;
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const thumbs = useRef(null);
  const touch = useRef(null);

  const go = useCallback((n) => setI(Math.max(0, Math.min(pages - 1, n))), [pages]);
  const close = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate("/work");
  }, [navigate]);

  // Keyboard: arrows to move, Esc to close. Lock page scroll while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(i + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(i - 1); }
      else if (e.key === "Escape") close();
      else if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [i, go, close]);

  // Keep the active thumbnail in view
  useEffect(() => {
    const el = thumbs.current?.children[i];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [i]);

  // Preload the slides either side
  useEffect(() => {
    [i - 1, i + 1].filter((n) => n >= 0 && n < pages).forEach((n) => {
      const img = new Image();
      img.srcset = `${path}/${pad(n + 1)}-1280.webp 1280w, ${path}/${pad(n + 1)}.webp 2560w`;
      img.sizes = "100vw";
    });
  }, [i, path, pages]);

  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  const arrow =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-ink-700 bg-ink-900/80 text-white backdrop-blur transition-all duration-300 hover:bg-blue-600 hover:border-blue-500 disabled:pointer-events-none disabled:opacity-0 lg:flex";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}, slide ${i + 1} of ${pages}`}
      onContextMenu={noSave}
      className="fixed inset-0 z-[100] flex flex-col bg-ink-950 select-none [-webkit-touch-callout:none]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-ink-800 px-4 py-3 md:px-8 md:py-4">
        <div className="min-w-0">
          <p className="truncate font-display text-[17px] font-medium md:text-xl">{project.title}</p>
          <p className="text-[13px] text-slate-500">{project.type}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 md:gap-5">
          <span className="text-[14px] font-medium tabular-nums text-slate-400">
            {pad(i + 1)} / {pad(pages)}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-ink-700 text-white transition-colors hover:bg-ink-800"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
      </div>

      {/* Slide */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 md:px-6 lg:px-24 lg:py-8"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button type="button" aria-label="Previous slide" onClick={() => go(i - 1)} disabled={i === 0} className={`${arrow} left-6`}>
          <Icon name="chevron-left" className="size-5" />
        </button>

        <div
          className="relative max-h-full w-full max-w-[min(100%,2560px)] overflow-hidden rounded-xl bg-ink-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
          style={{ aspectRatio: ratio, width: `min(100%, calc((100dvh - 230px) * ${ratio}))` }}
        >
          <img
            key={i}
            src={`${path}/${pad(i + 1)}.webp`}
            srcSet={`${path}/${pad(i + 1)}-1280.webp 1280w, ${path}/${pad(i + 1)}.webp 2560w`}
            sizes="(max-width: 768px) 100vw, 90vw"
            alt={`${project.title}, slide ${i + 1}`}
            draggable="false"
            onDragStart={noSave}
            className="pointer-events-none size-full animate-fade-in object-contain"
          />
          {/* transparent layer so the image itself can't be right-clicked or long-pressed */}
          <div className="absolute inset-0" onContextMenu={noSave} />
        </div>

        <button type="button" aria-label="Next slide" onClick={() => go(i + 1)} disabled={i === pages - 1} className={`${arrow} right-6`}>
          <Icon name="chevron-right" className="size-5" />
        </button>
      </div>

      {/* Phone and tablet controls */}
      <div className="flex items-center justify-center gap-3 pb-2 lg:hidden">
        <button type="button" aria-label="Previous slide" onClick={() => go(i - 1)} disabled={i === 0} className="flex size-11 items-center justify-center rounded-full border border-ink-700 text-white disabled:opacity-30">
          <Icon name="chevron-left" className="size-5" />
        </button>
        <span className="text-[13px] text-slate-500">Swipe or tap</span>
        <button type="button" aria-label="Next slide" onClick={() => go(i + 1)} disabled={i === pages - 1} className="flex size-11 items-center justify-center rounded-full border border-ink-700 text-white disabled:opacity-30">
          <Icon name="chevron-right" className="size-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div ref={thumbs} className="flex gap-2 overflow-x-auto border-t border-ink-800 px-4 py-3 md:justify-center-safe md:px-8 [scrollbar-width:none]">
        {Array.from({ length: pages }, (_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => go(n)}
            aria-label={`Go to slide ${n + 1}`}
            className={`shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300 ${
              n === i ? "border-blue-500 opacity-100" : "border-transparent opacity-50 hover:opacity-90"
            }`}
            style={{ width: 96, aspectRatio: ratio }}
          >
            <img src={`${path}/${pad(n + 1)}-1280.webp`} alt="" loading="lazy" draggable="false" className="pointer-events-none size-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
