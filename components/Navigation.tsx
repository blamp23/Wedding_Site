"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Our Story", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Venue", href: "#venue" },
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
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          className={`font-serif text-xl tracking-wide transition-colors ${
            scrolled ? "text-green-deep" : "text-cream"
          }`}
        >
          B & MK
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={`font-sans text-xs tracking-widest uppercase transition-colors hover:opacity-70 ${
                  scrolled ? "text-green-deep" : "text-cream"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors ${
            scrolled ? "text-green-deep" : "text-cream"
          }`}
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
        <div className="md:hidden bg-cream/98 backdrop-blur-sm border-t border-cream-dark px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-xs tracking-widest uppercase text-green-deep hover:text-green-accent transition-colors"
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
