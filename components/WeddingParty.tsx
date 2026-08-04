"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Headshots live in public/images/party/<slug>.png (slug = name lowercased
// with dashes). Until a photo exists, initials show automatically.
// The `bio` lines are playful placeholders — edit to taste!
// hornsDown renders 🤘 flipped 180° (no dedicated horns-down emoji exists).
type Member = { name: string; role?: string; bio: string; emoji?: string; hornsDown?: boolean };

const bridesmaids: Member[] = [
  { name: "Grace Carter", emoji: "🐗", bio: "Will absolutely cry during the vows — and be first on the dance floor." },
  { name: "Rylie Reed", emoji: "🐗", bio: "Certified hype-woman and keeper of Mary-Kate's secrets since day one." },
];

const groomsmen: Member[] = [
  { name: "Matthew Lamp", hornsDown: true, bio: "Benji's right-hand man; will tell you an embarrassing story if you let him." },
  { name: "Charlie Mitchell", hornsDown: true, bio: "Brings the energy, the snacks, and questionable dance moves." },
  { name: "Jake Rose", emoji: "👍 🐟", bio: "Professional wingman, amateur karaoke legend." },
  { name: "Martin Guzman", emoji: "👍 🐟", bio: "The calm one — until the music starts." },
  { name: "Tyler Canty", emoji: "🐟 🚑", bio: "Will challenge you to a dance-off and lose gracefully." },
  { name: "Nathan Peed", emoji: "👍 🐟", bio: "Guaranteed to be the last one to leave the reception." },
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Avatar({ name }: { name: string }) {
  const [err, setErr] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative h-28 w-28 rounded-full overflow-hidden ring-1 ring-ink/10 transition-all duration-300 group-hover:ring-2 group-hover:ring-ink/50 group-hover:scale-105 group-hover:shadow-lg">
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/party/${slug(name)}.png`}
          alt={name}
          onError={() => setErr(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-paper-soft flex items-center justify-center">
          <span className="font-serif text-xl text-ink-soft">{initials}</span>
        </div>
      )}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
};

function Group({ title, subtitle, members }: { title: string; subtitle: string; members: Member[] }) {
  return (
    <div>
      <div className="text-center mb-10">
        <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-2">{subtitle}</p>
        <h3 className="font-serif text-3xl text-ink font-light">{title}</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
        {members.map((m, i) => (
          <motion.div
            key={m.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="group w-36 text-center cursor-default"
          >
            <div className="flex justify-center">
              <Avatar name={m.name} />
            </div>
            <p className="mt-4 font-serif text-lg text-ink font-light">
              {m.name}
              {m.emoji ? ` ${m.emoji}` : ""}
              {m.hornsDown && <span className="inline-block ml-1 rotate-180">🤘</span>}
            </p>
            {m.role && (
              <p className="font-sans text-[10px] tracking-widest uppercase text-ink-soft mt-0.5">{m.role}</p>
            )}
            <p className="mt-1.5 font-sans text-xs text-ink-soft leading-relaxed">{m.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function WeddingParty() {
  return (
    <section id="party" className="py-24 bg-paper">
      <div className="max-w-5xl mx-auto px-6">
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

        <div className="space-y-20">
          <Group title="Bridesmaids" subtitle="The Bride's Side" members={bridesmaids} />
          <Group title="Groomsmen" subtitle="The Groom's Side" members={groomsmen} />
        </div>
      </div>
    </section>
  );
}
