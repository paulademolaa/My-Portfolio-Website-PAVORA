import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icons.jsx";

// Custom dropdown that looks the same on every browser and system
// (the built-in <select> menu can't be styled and shows dark text on Windows).
//   label, options (list of strings), value, onChange(value), placeholder
export default function Select({ label, options, value, onChange, placeholder = "Select…", name }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();

  // Close when clicking anywhere else
  useEffect(() => {
    const onDown = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Keep the highlighted option in view
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const choose = (option) => {
    onChange(option);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(options.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    else if (e.key === "Home") (e.preventDefault(), setActive(0));
    else if (e.key === "End") (e.preventDefault(), setActive(options.length - 1));
    else if (e.key === "Enter" || e.key === " ") (e.preventDefault(), choose(options[active]));
    else if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      // Jump to the first option starting with the typed letter
      const i = options.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div ref={wrapRef} className="relative flex flex-1 flex-col gap-2">
      <span id={`${id}-label`} className="font-medium leading-[1.6]">
        {label}
      </span>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-ink-900 px-4 py-3.5 text-left leading-[1.6] transition-all duration-300 focus:outline-none ${
          open
            ? "border-blue-500 ring-4 ring-blue-600/20"
            : "border-ink-700 hover:border-slate-500/60 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-600/20"
        }`}
      >
        <span className={value ? "text-white" : "text-slate-500"}>{value || placeholder}</span>
        <Icon
          name="chevron-down"
          className={`size-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-blue-400" : ""}`}
        />
      </button>

      {/* Options */}
      <ul
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        aria-labelledby={`${id}-label`}
        className={`absolute top-full right-0 left-0 z-30 mt-2 max-h-[340px] origin-top overflow-y-auto rounded-xl border border-ink-700 bg-ink-900 p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] transition-all duration-200 ease-(--ease-premium) ${
          open ? "visible scale-100 opacity-100" : "invisible pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        {options.map((option, i) => {
          const selected = option === value;
          return (
            <li
              key={option}
              role="option"
              aria-selected={selected}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(option)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors duration-150 ${
                i === active ? "bg-blue-600/15 text-white" : "text-slate-300"
              } ${selected ? "font-medium text-white" : ""}`}
            >
              {option}
              {selected && <Icon name="check" className="size-4 text-blue-400" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
