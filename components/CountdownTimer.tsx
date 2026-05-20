"use client";

import { useEffect, useState } from "react";

// July 12, 2026 — update this to the actual party date/time
const PARTY_DATE = new Date("2026-07-12T18:00:00");

function getTimeLeft() {
  const diff = PARTY_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad({ n }: { n: number }) {
  return <>{String(n).padStart(2, "0")}</>;
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section className="bg-green-deep py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-green-light mb-8">
          Counting down to the celebration
        </p>
        <div className="flex items-start justify-center gap-4 sm:gap-10">
          {units.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-serif text-5xl sm:text-7xl text-cream font-light tabular-nums">
                <Pad n={value} />
              </span>
              <span className="font-sans text-xs tracking-widest uppercase text-green-light mt-2">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
