import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";
import Icon from "./Icons.jsx";
import { navLinks } from "../data/site.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add a blurred background once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the page changes
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  // Stop the page scrolling behind the open mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-(--ease-premium) ${
          scrolled
            ? "border-b border-ink-800/80 bg-ink-950/75 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav
          className={`container-page flex items-center justify-between transition-all duration-500 ${
            scrolled ? "py-3.5" : "py-[18px] lg:py-6"
          }`}
        >
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `group relative py-1 text-sm leading-[1.5] font-medium transition-colors duration-300 hover:text-white ${
                      isActive && !link.to.includes("#") ? "text-white" : "text-slate-400"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-blue-500 transition-transform duration-500 ease-(--ease-premium) ${
                          isActive && !link.to.includes("#") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button to="/contact" variant="secondary">
              Let's talk
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid size-11 cursor-pointer place-items-center rounded-full bg-ink-800 transition-colors duration-300 hover:bg-ink-700 md:hidden"
          >
            <Icon name="menu" />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-ink-950 px-5 pt-[18px] pb-10 transition-all duration-500 ease-(--ease-premium) md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-11 cursor-pointer place-items-center rounded-full bg-ink-800 transition-transform duration-300 hover:rotate-90"
          >
            <Icon name="close" />
          </button>
        </div>

        <ul className="mt-14 flex flex-col gap-3">
          {[{ label: "Home", to: "/" }, ...navLinks].map((link, i) => (
            <li
              key={link.label}
              className={`transition-all duration-700 ease-(--ease-premium) ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              <Link
                to={link.to}
                className="font-display text-[32px] leading-[1.2] font-medium text-white transition-colors hover:text-blue-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <Button to="/contact" className="w-full">
            Let's talk
          </Button>
        </div>
      </div>
    </>
  );
}
