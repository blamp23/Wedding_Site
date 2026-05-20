"use client";

import { motion } from "framer-motion";

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
    <section id="registry" className="py-24 bg-cream-secondary">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-green-accent mb-3">For those who asked</p>
          <h2 className="font-serif text-5xl text-green-deep font-light">Registry</h2>
          <div className="section-divider" />
          <p className="font-sans text-green-deep/70 text-sm max-w-md mx-auto">
            Your presence at our celebration is the greatest gift. If you&apos;d like to give a gift, we&apos;ve registered at the following places.
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
              className="group block border border-green-accent/20 bg-cream p-8 hover:border-green-DEFAULT hover:shadow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-green-deep flex items-center justify-center mb-6 group-hover:bg-green-accent transition-colors">
                <span className="font-serif text-cream text-lg font-light">{r.icon}</span>
              </div>
              <h3 className="font-serif text-xl text-green-deep font-light mb-2">{r.name}</h3>
              <p className="font-sans text-xs text-green-deep/60 leading-relaxed mb-4">{r.description}</p>
              <span className="font-sans text-xs tracking-widest uppercase text-green-accent group-hover:text-green-deep transition-colors">
                View Registry →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
