"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Venue", href: "/venue" },
  { label: "Accommodations", href: "/accommodations" },
  { label: "FAQ", href: "/faq" },
  { label: "Registry", href: "/registry" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-wide text-ink">
          MK &amp; B
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-sans text-xs tracking-widest uppercase text-ink transition-opacity hover:opacity-60"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/rsvp"
              className="font-sans text-xs tracking-widest uppercase bg-ink text-paper px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              RSVP
            </Link>
          </li>
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
        <div className="md:hidden bg-paper border-t border-ink/10 px-6 py-4">
          <ul className="flex flex-col gap-4">
            {[...links, { label: "RSVP", href: "/rsvp" }].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-xs tracking-widest uppercase text-ink hover:opacity-60 transition-opacity"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
