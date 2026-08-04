"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Headshots: drop a photo in public/images/party/<slug>.jpg (slug = the name
// lowercased with dashes, e.g. "Grace Carter" -> grace-carter.jpg). Until a
// photo exists, initials show automatically.
// The `bio` lines are playful placeholders — edit to taste!
type Member = { name: string; role?: string; bio: string };

const bridesmaids: Member[] = [
  { name: "Grace Carter", bio: "Will absolutely cry during the vows — and be first on the dance floor." },
  { name: "Rylie Reed", bio: "Certified hype-woman and keeper of Mary-Kate's secrets since day one." },
];

const groomsmen: Member[] = [
  { name: "Matthew Lamp", bio: "Benji's right-hand man; will tell you an embarrassing story if you let him." },
  { name: "Charlie Mitchell", bio: "Brings the energy, the snacks, and questionable dance moves." },
  { name: "Jake Rose", bio: "Professional wingman, amateur karaoke legend." },
  { name: "Martin Guzman", bio: "The calm one — until the music starts." },
  { name: "Tyler Canty", bio: "Will challenge you to a dance-off and lose gracefully." },
  { name: "Nathan Peed", bio: "Guaranteed to be the last one to leave the reception." },
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Avatar({ name }: { name: string }) {
  const [err, setErr] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  if (!err) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={`/images/party/${slug(name)}.jpg`}
        alt={name}
        onError={() => setErr(true)}
        className="h-24 w-24 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="h-24 w-24 rounded-full bg-paper-soft border border-ink/15 flex items-center justify-center shrink-0">
      <span className="font-serif text-xl text-ink-soft">{initials}</span>
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
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {members.map((m, i) => (
          <motion.div
            key={m.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="flex items-center gap-5"
          >
            <Avatar name={m.name} />
            <div>
              <p className="font-serif text-xl text-ink font-light">{m.name}</p>
              {m.role && (
                <p className="font-sans text-[11px] tracking-widest uppercase text-ink-soft mt-0.5">{m.role}</p>
              )}
              <p className="font-sans text-sm text-ink-soft leading-relaxed mt-1.5">{m.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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

        <div className="space-y-20">
          <Group title="Bridesmaids" subtitle="The Bride's Side" members={bridesmaids} />
          <Group title="Groomsmen" subtitle="The Groom's Side" members={groomsmen} />
        </div>
      </div>
    </section>
  );
}
