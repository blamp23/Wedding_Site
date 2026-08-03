"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Gallery", href: "#gallery" },
  { label: "Venue", href: "#venue" },
  { label: "Accommodations", href: "#accommodations" },
  { label: "RSVP", href: "#rsvp" },
  { label: "Registry", href: "#registry" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-paper/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-serif text-xl tracking-wide text-ink">
          B &amp; MK
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="font-sans text-xs tracking-widest uppercase text-ink transition-opacity hover:opacity-60"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-ink"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-paper/98 backdrop-blur-sm border-t border-ink/10 px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-xs tracking-widest uppercase text-ink hover:opacity-60 transition-opacity"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
