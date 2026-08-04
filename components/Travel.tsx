"use client";

import { motion } from "framer-motion";

const DESTINATION = "Hot Springs, AR";
// If a Maps Embed API key is set, use the official directions embed;
// otherwise fall back to the keyless legacy embed.
const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_EMBED_KEY;

function routeSrc(from: string) {
  if (MAPS_KEY) {
    return (
      "https://www.google.com/maps/embed/v1/directions" +
      `?key=${MAPS_KEY}` +
      `&origin=${encodeURIComponent(from)}` +
      `&destination=${encodeURIComponent(DESTINATION)}` +
      "&mode=driving"
    );
  }
  return `https://maps.google.com/maps?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(DESTINATION)}&output=embed`;
}

const routes = [
  { from: "Little Rock, AR", time: "~1 hour · 55 mi" },
  { from: "Dallas, TX", time: "~5 hours · 290 mi" },
  { from: "Houston, TX", time: "~7 hours · 430 mi" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08 } }),
};

export default function Travel() {
  return (
    <section id="travel" className="py-24 bg-paper">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Getting here</p>
          <h2 className="font-serif text-5xl text-ink font-light">Travel</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
        </motion.div>

        {/* Driving routes — one per row, alternating sides */}
        <h3 className="font-serif text-2xl text-ink font-light text-center mb-10">Driving to Hot Springs</h3>
        <div className="space-y-14">
          {routes.map((r, i) => (
            <motion.div
              key={r.from}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden border border-ink/15 bg-paper-soft">
                <iframe
                  title={`Driving route from ${r.from} to Hot Springs`}
                  src={routeSrc(r.from)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="font-serif text-3xl text-ink font-light">From {r.from}</p>
                <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mt-2">{r.time}</p>
                <p className="font-sans text-sm text-ink-soft mt-3">Driving to Hot Springs, Arkansas.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
