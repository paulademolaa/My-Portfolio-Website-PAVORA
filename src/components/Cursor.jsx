import { useEffect, useRef } from "react";

// PAVORA cursor: a blue dot + a soft ring that trails the mouse.
// Over anything clickable (links, buttons, cards) the ring grows and glows,
// and every click sends out a glow pulse. Mouse/trackpad only: phones and
// tablets keep their normal touch behaviour.
const CLICKABLE = 'a, button, [role="button"], summary, label[for], select, [data-cursor-link]';
const TEXT = 'input, textarea, [contenteditable="true"]';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let frame;
    let tick = 0;
    let seen = false;

    const loop = () => {
      // the ring eases after the dot for a smooth, premium feel
      const k = still ? 1 : 0.2;
      trail.x += (pos.x - trail.x) * k;
      trail.y += (pos.y - trail.y) * k;
      if (dot.current) dot.current.style.translate = `${pos.x}px ${pos.y}px`;
      if (ring.current) ring.current.style.translate = `${trail.x}px ${trail.y}px`;
      // Re-check what's under the cursor a few times a second, so the glow
      // switches off when the page scrolls, a menu closes or the page changes
      // under a still mouse.
      if (seen && ++tick % 6 === 0) recheck();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const setState = (target) => {
      const el = target instanceof Element ? target : null;
      const next = el?.closest(TEXT) ? "text" : el?.closest(CLICKABLE) ? "link" : "";
      if (root.dataset.cursor !== next) root.dataset.cursor = next;
    };
    const recheck = () => setState(document.elementFromPoint(pos.x, pos.y));
    const reset = () => {
      root.dataset.cursor = "";
      root.dataset.cursorDown = "";
    };

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      seen = true;
      root.dataset.cursorHidden = "";
      setState(e.target);
    };
    const onDown = () => {
      root.dataset.cursorDown = "true";
      if (still || !ring.current) return;
      // glow pulse that spreads out from the click
      const pulse = document.createElement("span");
      pulse.className = "cursor-pulse";
      pulse.style.left = `${pos.x}px`;
      pulse.style.top = `${pos.y}px`;
      document.body.appendChild(pulse);
      pulse.addEventListener("animationend", () => pulse.remove());
    };
    const onUp = () => {
      root.dataset.cursorDown = "";
      requestAnimationFrame(recheck);
    };
    const onLeave = () => {
      root.dataset.cursorHidden = "true";
      reset();
    };
    // mouse left the window (relatedTarget is null when leaving the page)
    const onOut = (e) => {
      if (!e.relatedTarget) onLeave();
    };
    const onScroll = () => requestAnimationFrame(recheck);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerout", onOut);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerout", onOut);
      reset();
    };
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <span ref={ring} className="cursor-ring" />
      <span ref={dot} className="cursor-dot" />
    </div>
  );
}
