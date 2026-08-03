"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const GARVAN_EMBED =
  "https://www.google.com/maps?q=Garvan%20Woodland%20Gardens%2C%20550%20Arkridge%20Rd%2C%20Hot%20Springs%2C%20AR%2071913&output=embed";
const GARVAN_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Garvan+Woodland+Gardens%2C+550+Arkridge+Rd%2C+Hot+Springs%2C+AR+71913";

const HAMP_EMBED =
  "https://www.google.com/maps?q=Hamp%20Williams%20Building%2C%20Hot%20Springs%2C%20AR&output=embed";
const HAMP_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Hamp+Williams+Building%2C+Hot+Springs%2C+AR";

type Block = {
  eyebrow: string;
  name: string;
  address: string[];
  note?: string;
  schedule: [string, string][];
  mapEmbed: string;
  directions: string;
  reverse?: boolean;
};

const blocks: Block[] = [
  {
    eyebrow: "The Ceremony",
    name: "Anthony Chapel at Garvan Woodland Gardens",
    address: ["550 Arkridge Road", "Hot Springs, AR 71913"],
    schedule: [["Ceremony", "6:00 PM"]],
    mapEmbed: GARVAN_EMBED,
    directions: GARVAN_DIRECTIONS,
  },
  {
    eyebrow: "Cocktails & Reception",
    name: "The Hamp Williams Building",
    address: ["Downtown Hot Springs, Arkansas"],
    note: "A short drive from the gardens.",
    schedule: [
      ["Cocktails", "7:30 PM · Courtyard"],
      ["Dinner & Reception", "8:30 PM"],
    ],
    mapEmbed: HAMP_EMBED,
    directions: HAMP_DIRECTIONS,
    reverse: true,
  },
];

export default function Venue() {
  return (
    <section id="venue" className="py-24 bg-paper">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Join us</p>
          <h2 className="font-serif text-5xl text-ink font-light">Ceremony &amp; Reception</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
          <p className="font-sans text-ink-soft text-sm">
            Saturday, June 5, 2027 · Formal Attire
          </p>
        </motion.div>

        <div className="space-y-16">
          {blocks.map((b) => (
            <div
              key={b.name}
              className={`grid md:grid-cols-2 gap-10 items-center ${
                b.reverse ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="space-y-5"
              >
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-2">
                    {b.eyebrow}
                  </p>
                  <h3 className="font-serif text-2xl text-ink font-light mb-2">{b.name}</h3>
                  <div className="w-8 h-px bg-ink/40 mb-4" />
                  <address className="font-sans not-italic text-ink-soft leading-relaxed space-y-1">
                    {b.address.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>
                  {b.note && <p className="font-sans text-ink-faint text-sm mt-2">{b.note}</p>}
                </div>

                <div className="space-y-3">
                  {b.schedule.map(([label, value]) => (
                    <div key={label} className="flex gap-4">
                      <span className="font-sans text-xs tracking-widest uppercase text-ink-soft w-24 shrink-0 pt-0.5">
                        {label}
                      </span>
                      <span className="font-sans text-ink">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <a href={b.directions} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    Get Directions
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="w-full aspect-[4/3] overflow-hidden border border-ink/15"
              >
                <iframe
                  title={`${b.name} map`}
                  src={b.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
