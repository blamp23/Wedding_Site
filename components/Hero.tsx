"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay"
      style={{ background: "linear-gradient(160deg, #1E3329 0%, #2C4A3E 60%, #4A7C6F 100%)" }}
    >
      {/* Subtle botanical line art decorations */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none"
        aria-hidden
      >
        <svg viewBox="0 0 400 400" className="w-[600px] h-[600px]" fill="none" stroke="currentColor" strokeWidth="0.5" color="#F8F5EE">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="170" />
          <line x1="200" y1="10" x2="200" y2="390" />
          <line x1="10" y1="200" x2="390" y2="200" />
          <line x1="55" y1="55" x2="345" y2="345" />
          <line x1="345" y1="55" x2="55" y2="345" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle
              key={deg}
              cx={200 + 170 * Math.cos((deg * Math.PI) / 180)}
              cy={200 + 170 * Math.sin((deg * Math.PI) / 180)}
              r="5"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-green-light mb-6"
        >
          We&apos;re engaged
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-serif text-cream"
          style={{ fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 1, fontWeight: 300 }}
        >
          Benji
          <span className="block italic text-green-light" style={{ fontSize: "0.55em" }}>
            &amp;
          </span>
          Mary-Kate
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-green-light/50" />
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-green-light">
            Engagement Party &nbsp;·&nbsp; July 2026
          </p>
          <div className="h-px w-12 bg-green-light/50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10"
        >
          <a href="#rsvp" className="btn-primary bg-cream text-green-deep hover:bg-cream-secondary">
            RSVP
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[10px] tracking-widest uppercase text-green-light/70">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-green-light/40"
        />
      </motion.div>
    </section>
  );
}
