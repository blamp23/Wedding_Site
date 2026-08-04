"use client";

import { motion } from "framer-motion";

// Add an optional `role` (e.g. "Maid of Honor", "Best Man") to any member,
// and it will display beneath their name.
const party: { name: string; role?: string }[] = [
  { name: "Grace Carter" },
  { name: "Rylie Reed" },
  { name: "Matthew Lamp" },
  { name: "Charlie Mitchell" },
  { name: "Jake Rose" },
  { name: "Martin Guzman" },
  { name: "Tyler Canty" },
  { name: "Nathan Peed" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
};

export default function WeddingParty() {
  return (
    <section id="party" className="py-24 bg-paper">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Standing with us</p>
          <h2 className="font-serif text-5xl text-ink font-light">The Wedding Party</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-center">
          {party.map((m, i) => (
            <motion.div
              key={m.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
            >
              <p className="font-serif text-xl text-ink font-light">{m.name}</p>
              {m.role && (
                <p className="mt-1 font-sans text-[11px] tracking-widest uppercase text-ink-soft">
                  {m.role}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
