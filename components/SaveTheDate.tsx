"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Laurel from "@/components/Laurel";
import AddToCalendar from "@/components/AddToCalendar";

// Wedding day — June 5, 2027, 6:00 PM ceremony at Anthony Chapel, Hot Springs, AR
const WEDDING_DATE = new Date("2027-06-05T18:00:00");

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.2 + i * 0.2 },
  }),
};

export default function SaveTheDate() {
  // Start null so server and first client render match (avoids hydration mismatch),
  // then tick every second in the browser.
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time?.days },
    { label: "Hours", value: time?.hours },
    { label: "Minutes", value: time?.minutes },
    { label: "Seconds", value: time?.seconds },
  ];

  return (
    <div className="text-center md:text-left">
      <motion.p
        custom={0}
        initial="hidden"
        animate="show"
        variants={fade}
        className="font-sans text-[11px] sm:text-xs tracking-[0.4em] uppercase text-ink-soft mb-6"
      >
        Save the Date
      </motion.p>

      <div className="relative inline-block">
        <Laurel className="pointer-events-none absolute left-1/2 top-1/2 w-[380px] sm:w-[460px] -translate-x-1/2 -translate-y-1/2 text-ink/[0.12]" />
        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fade}
          className="relative font-serif font-light text-ink"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.05 }}
        >
          Mary-Kate
          <span className="block italic text-ink-soft" style={{ fontSize: "0.5em" }}>
            &amp;
          </span>
          Benji
        </motion.h1>
      </div>

      <motion.div
        custom={2}
        initial="hidden"
        animate="show"
        variants={fade}
        className="mx-auto md:mx-0 my-7 h-px w-16 bg-ink/30"
      />

      <motion.p
        custom={2}
        initial="hidden"
        animate="show"
        variants={fade}
        className="font-serif text-2xl sm:text-3xl text-ink"
      >
        Saturday, June 5, 2027
      </motion.p>

      <motion.div
        custom={3}
        initial="hidden"
        animate="show"
        variants={fade}
        className="mt-4 font-sans text-sm sm:text-base text-ink-soft leading-relaxed"
      >
        <p className="tracking-wide">Anthony Chapel at Garvan Woodland Gardens</p>
        <p className="tracking-wide">Hot Springs, Arkansas</p>
      </motion.div>

      <motion.div
        custom={4}
        initial="hidden"
        animate="show"
        variants={fade}
        className="mt-8 flex items-start justify-center md:justify-start gap-6 sm:gap-8"
      >
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-light text-ink tabular-nums">
              {value === undefined ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-ink-soft">
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div
        custom={5}
        initial="hidden"
        animate="show"
        variants={fade}
        className="mt-8 flex justify-center md:justify-start"
      >
        <AddToCalendar />
      </motion.div>

      <motion.p
        custom={6}
        initial="hidden"
        animate="show"
        variants={fade}
        className="mt-8 font-sans text-[11px] tracking-[0.3em] uppercase text-ink-faint"
      >
        Formal invitation to follow
      </motion.p>
    </div>
  );
}
