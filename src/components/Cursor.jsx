import { useEffect, useRef } from "react";

// PAVORA cursor: a blue dot + a soft ring that trails the mouse.
// Over anything clickable (links, buttons, cards) the ring grows and glows,
// and every click sends out a glow pulse. Mouse/trackpad only: phones and
// tablets keep their normal touch behaviour.
const CLICKABLE = 'a, button, [role="button"], summary, label[for], select, [data-cursor="link"]';
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

    const loop = () => {
      // the ring eases after the dot for a smooth, premium feel
      const k = still ? 1 : 0.2;
      trail.x += (pos.x - trail.x) * k;
      trail.y += (pos.y - trail.y) * k;
      if (dot.current) dot.current.style.translate = `${pos.x}px ${pos.y}px`;
      if (ring.current) ring.current.style.translate = `${trail.x}px ${trail.y}px`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const setState = (target) => {
      const el = target instanceof Element ? target : null;
      root.dataset.cursor = el?.closest(TEXT) ? "text" : el?.closest(CLICKABLE) ? "link" : "";
    };

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
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
    const onUp = () => (root.dataset.cursorDown = "");
    const onLeave = () => (root.dataset.cursorHidden = "true");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <span ref={ring} className="cursor-ring" />
      <span ref={dot} className="cursor-dot" />
    </div>
  );
}
