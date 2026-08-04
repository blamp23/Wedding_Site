"use client";

import { motion } from "framer-motion";

// Approximate — verify/adjust as needed.
const airports = [
  {
    name: "Little Rock — Clinton National (LIT)",
    detail: "Closest major airport with full commercial service.",
    drive: "~1 hr drive to Hot Springs (55 mi)",
  },
  {
    name: "Hot Springs — Memorial Field (HOT)",
    detail: "Small regional airport; limited flights, but the closest option.",
    drive: "~15 min drive",
  },
  {
    name: "Dallas–Fort Worth (DFW)",
    detail: "Large hub if you'd rather fly into Texas and drive up.",
    drive: "~5 hr drive to Hot Springs",
  },
];

const drives = [
  { from: "Little Rock, AR", time: "~1 hour" },
  { from: "Dallas, TX", time: "~5 hours" },
  { from: "Houston, TX", time: "~7 hours" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Travel() {
  return (
    <section id="travel" className="py-24 bg-paper">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Getting here</p>
          <h2 className="font-serif text-5xl text-ink font-light">Travel</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* By air */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <h3 className="font-serif text-2xl text-ink font-light mb-1">By Air</h3>
            <div className="w-8 h-px bg-ink/40 mb-6" />
            <div className="space-y-6">
              {airports.map((a) => (
                <div key={a.name}>
                  <p className="font-serif text-lg text-ink font-light">{a.name}</p>
                  <p className="font-sans text-sm text-ink-soft leading-relaxed">{a.detail}</p>
                  <p className="font-sans text-xs tracking-widest uppercase text-ink-faint mt-1">{a.drive}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* By car */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <h3 className="font-serif text-2xl text-ink font-light mb-1">By Car</h3>
            <div className="w-8 h-px bg-ink/40 mb-6" />
            <p className="font-sans text-sm text-ink-soft mb-6">
              Approximate driving times to Hot Springs:
            </p>
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {drives.map((d) => (
                <div key={d.from} className="flex items-center justify-between py-3.5">
                  <span className="font-sans text-ink">{d.from}</span>
                  <span className="font-sans text-sm text-ink-soft">{d.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
