"use client";

import { motion } from "framer-motion";

// Approximate — verify/adjust as needed.
const airports = [
  { name: "Little Rock — Clinton National (LIT)", detail: "Closest major airport; about a 1 hour drive to Hot Springs (55 mi)." },
  { name: "Dallas–Fort Worth (DFW)", detail: "Large hub if you'd rather fly into Texas and drive up (~5 hr)." },
];

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

        {/* Flying in */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h3 className="font-serif text-2xl text-ink font-light mb-6">Flying In</h3>
          <div className="space-y-4">
            {airports.map((a) => (
              <div key={a.name}>
                <p className="font-serif text-lg text-ink font-light">{a.name}</p>
                <p className="font-sans text-sm text-ink-soft">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Driving routes */}
        <h3 className="font-serif text-2xl text-ink font-light text-center mb-8">Driving to Hot Springs</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((r, i) => (
            <motion.div
              key={r.from}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="text-center"
            >
              <div className="aspect-[4/3] overflow-hidden border border-ink/15 bg-paper-soft">
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
              <p className="mt-3 font-serif text-lg text-ink font-light">From {r.from}</p>
              <p className="font-sans text-xs tracking-widest uppercase text-ink-soft">{r.time}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
