"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Featured hotel. Drop a photo at public/images/hotels/doubletree.jpg to
// show it; until then a placeholder appears. Room-block details TBD.
const featured = {
  name: "DoubleTree by Hilton Hot Springs",
  address: ["4813 Central Ave", "Hot Springs, AR 71913"],
  detail:
    "Our featured hotel: a comfortable, full-service stay along Central Avenue, close to downtown Hot Springs and Lake Hamilton.",
  url: "https://www.hilton.com/en/hotels/hothsdt-doubletree-hot-springs/",
  image: "/images/hotels/hilton.jpeg",
};

// TODO: confirm these nearby options; update names, distances, links.
const others = [
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
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

function FeaturedImage() {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="w-full h-full min-h-[220px] bg-paper flex items-center justify-center">
        <span className="font-sans text-xs tracking-widest uppercase text-ink-faint">Photo coming soon</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={featured.image}
      alt={featured.name}
      onError={() => setErr(true)}
      className="w-full h-full object-cover"
    />
  );
}

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

        {/* Featured hotel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 border border-ink/15 bg-paper overflow-hidden mb-10"
        >
          <div className="min-h-[220px]">
            <FeaturedImage />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-2">Featured Hotel</p>
            <h3 className="font-serif text-2xl text-ink font-light mb-1">{featured.name}</h3>
            <address className="font-sans not-italic text-ink-soft text-sm leading-relaxed mb-3">
              {featured.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <p className="font-sans text-sm text-ink-soft leading-relaxed mb-6">{featured.detail}</p>
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="btn-outline self-start">
              View Hotel
            </a>
          </div>
        </motion.div>

        {/* Other options */}
        <p className="font-sans text-xs tracking-widest uppercase text-ink-soft text-center mb-6">
          Other Nearby Options
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {others.map((h, i) => (
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
              <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">{h.detail}</p>
              <span className="font-sans text-xs tracking-widest uppercase text-ink-soft group-hover:text-ink transition-colors">
                View on Map →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
