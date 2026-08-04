"use client";

import { motion } from "framer-motion";

// Hotels near Hot Springs, DoubleTree listed first.
// TODO: confirm details/links; add room-block info when arranged.
const hotels = [
  {
    name: "DoubleTree by Hilton Hot Springs",
    detail: "Full-service hotel on Central Avenue, near downtown and Lake Hamilton.",
    url: "https://www.hilton.com/en/hotels/hothsdt-doubletree-hot-springs/",
  },
  {
    name: "The Waters Hotel",
    detail: "Boutique hotel in historic downtown Hot Springs.",
    url: "https://www.google.com/maps/search/?api=1&query=The+Waters+Hotel+Hot+Springs+AR",
  },
  {
    name: "Embassy Suites by Hilton",
    detail: "All-suite hotel with pool and complimentary breakfast.",
    url: "https://www.google.com/maps/search/?api=1&query=Embassy+Suites+Hot+Springs+AR",
  },
  {
    name: "Hampton Inn & Suites",
    detail: "Reliable, comfortable rooms close to the lake.",
    url: "https://www.google.com/maps/search/?api=1&query=Hampton+Inn+Hot+Springs+AR",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08 } }),
};

export default function Accommodations() {
  return (
    <section id="accommodations" className="py-24 bg-paper-soft">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Where to stay</p>
          <h2 className="font-serif text-5xl text-ink font-light">Accommodations</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
          <p className="font-sans text-ink-soft text-sm max-w-md mx-auto">
            A few places to stay in Hot Springs.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {hotels.map((h, i) => (
            <motion.a
              key={h.name}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="group block border border-ink/15 bg-paper p-8 hover:border-ink transition-all duration-300"
            >
              <h3 className="font-serif text-xl text-ink font-light mb-2">{h.name}</h3>
              <p className="font-sans text-sm text-ink-soft leading-relaxed mb-4">{h.detail}</p>
              <span className="font-sans text-xs tracking-widest uppercase text-ink-soft group-hover:text-ink transition-colors">
                View →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
