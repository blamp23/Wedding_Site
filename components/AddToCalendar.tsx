"use client";

import { useEffect, useRef, useState } from "react";

// June 5, 2027, 6:00 PM Central (CDT, UTC-5) → UTC. Ends ~11:00 PM CDT.
const START = "20270605T230000Z";
const END = "20270606T040000Z";
const TITLE = "Mary-Kate & Benji's Wedding";
const LOCATION = "Anthony Chapel at Garvan Woodland Gardens, 550 Arkridge Rd, Hot Springs, AR 71913";
const DETAILS =
  "Ceremony 6:00 PM at Anthony Chapel. Cocktails 7:30 PM and dinner reception 8:30 PM at the Hamp Williams Building, downtown Hot Springs.";

const googleUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(TITLE)}` +
  `&dates=${START}/${END}` +
  `&details=${encodeURIComponent(DETAILS)}` +
  `&location=${encodeURIComponent(LOCATION)}`;

function downloadIcs() {
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mary-Kate & Benji//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:mk-benji-wedding-20270605@wedding",
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${START}`,
    `DTEND:${END}`,
    `SUMMARY:${TITLE}`,
    `LOCATION:${LOCATION}`,
    `DESCRIPTION:${DETAILS}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mk-benji-wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AddToCalendar({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="btn-outline">
        Add to Calendar
      </button>

      {open && (
        <div className="absolute z-20 left-0 mt-2 w-56 bg-paper border border-ink/15 shadow-lg">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 font-sans text-xs tracking-widest uppercase text-ink hover:bg-paper-soft transition-colors"
          >
            Google Calendar
          </a>
          <button
            type="button"
            onClick={() => {
              downloadIcs();
              setOpen(false);
            }}
            className="block w-full text-left px-5 py-3 font-sans text-xs tracking-widest uppercase text-ink hover:bg-paper-soft transition-colors border-t border-ink/10"
          >
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
