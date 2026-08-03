"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const MAP_EMBED =
  "https://www.google.com/maps?q=Garvan%20Woodland%20Gardens%2C%20550%20Arkridge%20Rd%2C%20Hot%20Springs%2C%20AR%2071913&output=embed";
const DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Garvan+Woodland+Gardens%2C+550+Arkridge+Rd%2C+Hot+Springs%2C+AR+71913";

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
          <h2 className="font-serif text-5xl text-ink font-light">The Venue</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="space-y-6"
          >
            <div>
              <h3 className="font-serif text-2xl text-ink font-light mb-2">
                Anthony Chapel at Garvan Woodland Gardens
              </h3>
              <div className="w-8 h-px bg-ink/40 mb-4" />
              <address className="font-sans not-italic text-ink-soft leading-relaxed space-y-1">
                <p>550 Arkridge Road</p>
                <p>Hot Springs, AR 71913</p>
              </address>
            </div>

            <div className="space-y-4 pt-2">
              <Detail label="Date" value="Saturday, June 5, 2027" />
              <Detail label="Ceremony" value="6:00 PM" />
              <Detail label="Cocktails" value="7:30 PM" />
              <Detail label="Dinner & Reception" value="8:30 PM" />
              <Detail label="Dress Code" value="Formal Attire" />
              <Detail label="Parking" value="Available on-site" />
            </div>

            <div className="pt-4">
              <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Get Directions
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="w-full aspect-square overflow-hidden border border-ink/15"
          >
            <iframe
              title="Garvan Woodland Gardens map"
              src={MAP_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-sans text-xs tracking-widest uppercase text-ink-soft w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-sans text-ink">{value}</span>
    </div>
  );
}
