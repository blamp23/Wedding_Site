"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Headshots live in public/images/party/<slug>.png (slug = name lowercased
// with dashes). Until a photo exists, initials show automatically.
// hornsDown renders 🤘 flipped 180° (no dedicated horns-down emoji exists).
type Social = { type: "linkedin" | "instagram"; url: string };
type Member = { name: string; role?: string; bio?: string; emoji?: string; hornsDown?: boolean; socials?: Social[] };

const bridesmaids: Member[] = [
  { name: "Grace Carter", role: "Bridesmaid", emoji: "🐗", bio: "Scary-movie enjoyer and very good at making stuffed peppers.", socials: [{ type: "linkedin", url: "https://www.linkedin.com/in/grace-carter-24a926245/" }, { type: "instagram", url: "https://www.instagram.com/grace.c.a/" }] },
  { name: "Rylie Reid", role: "Bridesmaid", emoji: "🐗", bio: "Second-best medical device saleswoman at ConMed.", socials: [{ type: "linkedin", url: "https://www.linkedin.com/in/rylie-reid/" }, { type: "instagram", url: "https://www.instagram.com/ryliereid/" }] },
];

const groomsmen: Member[] = [
  { name: "Matthew Lamp", role: "Best Man", hornsDown: true, bio: "Benji's baby brother. The cutest, sweetest baby boy in the whole wide world.", socials: [{ type: "linkedin", url: "https://www.linkedin.com/in/matthewlamp/" }] },
  { name: "Jake Rose", role: "Groomsman", emoji: "👍", bio: "Founding member of the Marlin Hauz, college roommate, world traveler of the United States.", socials: [{ type: "linkedin", url: "https://www.linkedin.com/in/jake-h-rose/" }, { type: "instagram", url: "https://www.instagram.com/jakerose67/" }] },
  { name: "Martin Guzman", role: "Groomsman", emoji: "👍", bio: "Founding member of the Marlin Hauz, college roommate, aka Party Marty.", socials: [{ type: "linkedin", url: "https://www.linkedin.com/in/martin-guzman-1133942ab/" }, { type: "instagram", url: "https://www.instagram.com/mar10_guzman/" }] },
  { name: "Nathan Peed", role: "Groomsman", emoji: "👍", bio: "Founding member of the Lobster Boyz, college neighbor, drives fast cars and slow boats.", socials: [{ type: "linkedin", url: "https://www.linkedin.com/in/nathanpeed/" }, { type: "instagram", url: "https://www.instagram.com/nathan.peed/" }] },
  { name: "Tyler Canty", role: "Groomsman", emoji: "🚑", bio: "Founding member of the Lobster Boyz, college neighbor, really good at dancing and saving lives.", socials: [{ type: "instagram", url: "https://www.instagram.com/tylercanty9/" }] },
  { name: "Charlie Mitchell", role: "Groomsman", hornsDown: true, bio: "Mary-Kate's baby brother, an Aggie at heart.", socials: [{ type: "instagram", url: "https://www.instagram.com/chuck_mitchell5/" }] },
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function SocialIcon({ type }: { type: Social["type"] }) {
  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8h4.52v16H.24V8zm7.5 0h4.33v2.19h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.52v-6.75c0-1.61-.03-3.68-2.24-3.68-2.24 0-2.58 1.75-2.58 3.56V24H7.74V8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
      <div className="space-y-10 max-w-xl mx-auto">
        {members.map((m, i) => (
          <motion.div
            key={m.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="group flex items-start gap-6"
          >
            <div className="shrink-0">
              <Avatar name={m.name} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-xl text-ink font-light">
                {m.name}
                {m.emoji ? ` ${m.emoji}` : ""}
                {m.hornsDown && <span className="inline-block ml-1 rotate-180">🤘</span>}
              </p>
              {m.socials && (
                <div className="mt-2 flex gap-3">
                  {m.socials.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on ${s.type}`}
                      className="inline-flex text-ink-soft hover:text-ink transition-colors"
                    >
                      <SocialIcon type={s.type} />
                    </a>
                  ))}
                </div>
              )}
              {m.bio && <p className="mt-2 font-sans text-sm text-ink-soft leading-relaxed">{m.bio}</p>}
              {m.role && (
                <p className="mt-3 font-sans text-[10px] tracking-widest uppercase text-ink-soft">{m.role}</p>
              )}
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
