"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Venue() {
  return (
    <section id="venue" className="py-24 bg-cream-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-green-accent mb-3">Join us</p>
          <h2 className="font-serif text-5xl text-green-deep font-light">The Venue</h2>
          <div className="section-divider" />
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
              <h3 className="font-serif text-2xl text-green-deep font-light mb-2">The Mitchell Garden Estate</h3>
              <div className="w-8 h-px bg-green-accent mb-4" />
              <address className="font-sans not-italic text-green-deep/80 leading-relaxed space-y-1">
                <p>123 Garden Lane</p>
                <p>Charleston, SC 29401</p>
              </address>
            </div>

            <div className="space-y-4 pt-2">
              <Detail label="Date" value="Saturday, July 12, 2026" />
              <Detail label="Time" value="6:00 PM — 11:00 PM" />
              <Detail label="Dress Code" value="Garden Cocktail Attire" />
              <Detail label="Parking" value="Available on-site, complimentary" />
            </div>

            <div className="pt-4">
              <a
                href="https://maps.google.com/?q=Charleston+SC"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Get Directions
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="w-full aspect-square overflow-hidden border border-green-accent/20"
          >
            {/* Embedded Google Map — replace src with your actual embed URL */}
            <iframe
              title="Venue Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106937.07398987527!2d-79.9976!3d32.7765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88fe7a42408ebb5f%3A0xb2c9c54e5cf5e18d!2sCharleston%2C%20SC!5e0!3m2!1sen!2sus!4v1700000000000"
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
      <span className="font-sans text-xs tracking-widest uppercase text-green-accent w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-sans text-green-deep/80">{value}</span>
    </div>
  );
}
