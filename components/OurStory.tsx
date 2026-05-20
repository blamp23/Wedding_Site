"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const milestones = [
  {
    year: "2020",
    title: "How We Met",
    body: "A chance encounter at a mutual friend's dinner party turned into a three-hour conversation neither of us wanted to end. We've been inseparable ever since.",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    alt: "Couple at dinner",
  },
  {
    year: "2022",
    title: "Our First Adventure",
    body: "We packed our bags and took off to the coast with no real plan. That trip made it clear we were better together than apart.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
    alt: "Couple on adventure",
  },
  {
    year: "2025",
    title: "The Proposal",
    body: "On a quiet evening walk at golden hour, Benji got down on one knee. Mary-Kate said yes before he could finish the question.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    alt: "Engagement moment",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function OurStory() {
  return (
    <section id="story" className="py-24 bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-green-accent mb-3">How it happened</p>
          <h2 className="font-serif text-5xl text-green-deep font-light">Our Story</h2>
          <div className="section-divider" />
        </motion.div>

        <div className="space-y-20">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-10 items-center`}
            >
              <div className="w-full md:w-1/2 relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={m.image}
                    alt={m.alt}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                {/* Year badge */}
                <div className="absolute -bottom-4 -left-4 bg-green-deep text-cream px-4 py-2">
                  <span className="font-serif text-2xl font-light">{m.year}</span>
                </div>
              </div>

              <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pl-6" : "md:pr-6"}`}>
                <h3 className="font-serif text-3xl text-green-deep font-light mb-4">{m.title}</h3>
                <div className="w-8 h-px bg-green-accent mb-4" />
                <p className="font-sans text-green-deep/80 leading-relaxed">{m.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
