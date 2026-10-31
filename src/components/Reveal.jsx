import { useEffect, useRef, useState } from "react";

// Returns [ref, isVisible]. isVisible turns true the first time the
// element scrolls into view.
export function useInView(options = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}

// Wrap anything in <Reveal> to fade + slide it in on scroll.
//   delay: milliseconds to wait (use it to stagger items)
//   as:    which HTML tag to render (default "div")
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...props }) {
  const [ref, visible] = useInView();

  return (
    <Tag
      ref={ref}
      style={{ "--delay": `${delay}ms` }}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
