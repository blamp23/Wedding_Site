"use client";

import { motion } from "framer-motion";

// TODO: replace with the real Venmo handle (no @).
const VENMO_HANDLE = "your-venmo-handle";
const VENMO_URL = `https://venmo.com/u/${VENMO_HANDLE}`;

// TODO: replace with real registry links once created.
const registries = [
  {
    name: "Zola",
    description: "Our primary registry with curated home goods and experiences.",
    url: "https://www.zola.com",
    icon: "Z",
  },
  {
    name: "Amazon",
    description: "A mix of everyday essentials and wish-list items.",
    url: "https://www.amazon.com",
    icon: "A",
  },
  {
    name: "Crate & Barrel",
    description: "Kitchen, dining, and entertaining favorites.",
    url: "https://www.crateandbarrel.com",
    icon: "C",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Registry() {
  return (
    <section id="registry" className="py-24 bg-paper">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">For those who asked</p>
          <h2 className="font-serif text-5xl text-ink font-light">Registry</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
          <p className="font-sans text-ink-soft text-sm max-w-md mx-auto">
            Your presence at our celebration is the greatest gift. If you&apos;d like to give a gift, we&apos;ve registered at the following places.
          </p>
        </motion.div>

        {/* Honeymoon fund — featured */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="border border-ink bg-ink text-paper p-10 text-center mb-6"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-paper/50 mb-3">Honeymoon Fund</p>
          <h3 className="font-serif text-3xl text-paper font-light mb-3">Toward Our First Adventure</h3>
          <p className="font-sans text-sm text-paper/70 max-w-md mx-auto mb-7">
            More than anything, we&apos;re dreaming of an unforgettable honeymoon. If you&apos;d
            like to help us celebrate, a gift toward the trip means the world to us.
          </p>
          <a
            href={VENMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-paper text-ink hover:bg-paper-soft"
          >
            Contribute via Venmo
          </a>
          <p className="mt-4 font-sans text-xs tracking-widest uppercase text-paper/40">
            @{VENMO_HANDLE}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {registries.map((r, i) => (
            <motion.a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="group block border border-ink/15 bg-paper p-8 hover:border-ink hover:shadow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center mb-6 transition-colors">
                <span className="font-serif text-paper text-lg font-light">{r.icon}</span>
              </div>
              <h3 className="font-serif text-xl text-ink font-light mb-2">{r.name}</h3>
              <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">{r.description}</p>
              <span className="font-sans text-xs tracking-widest uppercase text-ink-soft group-hover:text-ink transition-colors">
                View Registry →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
