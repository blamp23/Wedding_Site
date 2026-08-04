"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { households, findHousehold, type Household } from "@/data/guests";

type Status = "idle" | "submitting" | "success" | "error" | "alreadyRsvped";

type ExistingRsvp = {
  members: { name: string; attending: string }[];
  dietary: string;
  plusOne: string;
  notes: string;
};

const allNames = households.flatMap((h) => h.members);

export default function RSVP() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [primaryName, setPrimaryName] = useState<string | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [bringPlusOne, setBringPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [existingRsvp, setExistingRsvp] = useState<ExistingRsvp | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [checking, setChecking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return allNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectGuest = async (name: string) => {
    const h = findHousehold(name);
    if (!h) return;
    setPrimaryName(name);
    setQuery(name);
    setShowDropdown(false);
    setHousehold(null);
    setStatus("idle");
    setChecking(true);
    const defaults = () =>
      setAttendance(Object.fromEntries(h.members.map((m) => [m, true])));

    try {
      const res = await fetch(`/api/rsvp?householdId=${encodeURIComponent(h.id)}`);
      const data = await res.json();
      if (data.alreadyRsvped) {
        // Already responded — surface the message right away.
        setHousehold(h);
        setExistingRsvp(data.existing);
        setStatus("alreadyRsvped");
      } else {
        setHousehold(h);
        defaults();
      }
    } catch {
      setHousehold(h);
      defaults();
    } finally {
      setChecking(false);
    }
  };

  const onNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const exact = allNames.find((n) => n.toLowerCase() === query.trim().toLowerCase());
    const pick = exact ?? filtered[0];
    if (pick) selectGuest(pick);
  };

  const reset = () => {
    setQuery("");
    setPrimaryName(null);
    setHousehold(null);
    setAttendance({});
    setBringPlusOne(false);
    setPlusOneName("");
    setDietary("");
    setNotes("");
    setStatus("idle");
    setErrorMsg("");
    setExistingRsvp(null);
    setIsUpdating(false);
  };

  const prefillFromExisting = (existing: ExistingRsvp) => {
    setAttendance(
      Object.fromEntries(existing.members.map((m) => [m.name, m.attending === "yes"]))
    );
    setDietary(existing.dietary);
    setNotes(existing.notes);
    setPlusOneName(existing.plusOne);
    setBringPlusOne(Boolean(existing.plusOne));
    setExistingRsvp(null);
    setIsUpdating(true);
    setStatus("idle");
  };

  const submit = async (overwrite = false) => {
    if (!household || !primaryName) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdId: household.id,
          primaryName,
          members: household.members.map((name) => ({
            name,
            attending: attendance[name] ? "yes" : "no",
          })),
          plusOne: household.allowPlusOne && bringPlusOne ? plusOneName : "",
          dietary,
          notes,
          overwrite: overwrite ? "true" : "false",
        }),
      });
      const data = await res.json();

      if (data.alreadyRsvped) {
        setExistingRsvp(data.existing);
        setStatus("alreadyRsvped");
      } else if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(isUpdating);
  };

  const anyAttending = household?.members.some((m) => attendance[m]) ?? false;

  return (
    <section id="rsvp" className="py-24 bg-ink">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-paper/50 mb-3">We hope to see you</p>
          <h2 className="font-serif text-5xl text-paper font-light">RSVP</h2>
          <div className="w-16 h-px bg-paper/40 mx-auto my-6" />
          <p className="font-sans text-paper/70 text-sm leading-relaxed">
            Please RSVP by <strong className="text-paper">May 5, 2027</strong>.<br />
            Enter the first and last name of <strong className="text-paper">one</strong> member of your party.
            If you&apos;re responding for a guest or your family, you&apos;ll be able to RSVP for your
            whole group right here.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-paper/50 flex items-center justify-center">
                <svg className="w-7 h-7 text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-3xl text-paper font-light mb-3">Thank you!</h3>
              <p className="font-sans text-paper/70 text-sm mb-8">
                We&apos;ve received your RSVP and can&apos;t wait to celebrate with you.
              </p>
              <button onClick={reset} className="font-sans text-xs tracking-widest uppercase text-paper/70 border-b border-paper/40 hover:border-paper transition-colors pb-0.5">
                Submit another RSVP
              </button>
            </motion.div>
          )}

          {status === "alreadyRsvped" && existingRsvp && (
            <motion.div
              key="duplicate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border border-paper/20 bg-white/5 p-8 text-center space-y-5"
            >
              <p className="font-sans text-xs tracking-widest uppercase text-paper/50">Heads up</p>
              <h3 className="font-serif text-2xl text-paper font-light">
                Your party has already RSVP&apos;d!
              </h3>
              <div className="text-left space-y-2 border-t border-paper/15 pt-5">
                {existingRsvp.members.map((m) => (
                  <Row
                    key={m.name}
                    label={m.name}
                    value={m.attending === "yes" ? "Attending" : m.attending === "no" ? "Not attending" : "—"}
                  />
                ))}
                {existingRsvp.plusOne && <Row label="Plus one" value={existingRsvp.plusOne} />}
                {existingRsvp.dietary && <Row label="Dietary" value={existingRsvp.dietary} />}
              </div>
              <p className="font-sans text-paper/60 text-sm">Would you like to update your response?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => prefillFromExisting(existingRsvp)}
                  className="flex-1 btn-primary bg-paper text-ink hover:bg-paper-soft"
                >
                  Update our RSVP
                </button>
                <button
                  onClick={reset}
                  className="flex-1 btn-outline border-paper/40 text-paper/60 hover:text-ink hover:bg-paper hover:border-paper"
                >
                  Keep as is
                </button>
              </div>
            </motion.div>
          )}

          {(status === "idle" || status === "submitting" || status === "error") && (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name autocomplete */}
              <div className="relative" ref={dropdownRef}>
                <Label text="Your Name" />
                <p className="mb-2 font-sans text-xs text-paper/40 italic">
                  e.g. Sarah Fortune — not &ldquo;The Fortune Family&rdquo; or &ldquo;Dr. &amp; Mrs. Fortune&rdquo;
                </p>
                <input
                  type="text"
                  value={query}
                  placeholder="Start typing your name…"
                  autoComplete="off"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPrimaryName(null);
                    setHousehold(null);
                    setShowDropdown(true);
                  }}
                  onFocus={() => query.length >= 2 && !household && setShowDropdown(true)}
                  onKeyDown={onNameKeyDown}
                  className="w-full bg-transparent border-b border-paper/30 focus:border-paper py-3 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors"
                />
                {showDropdown && filtered.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 bg-[#222222] border border-paper/20 shadow-xl mt-1 max-h-56 overflow-y-auto">
                    {filtered.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => selectGuest(name)}
                        className="w-full text-left px-4 py-3 font-sans text-sm text-paper/80 hover:bg-white/10 hover:text-paper transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
                {query.length >= 2 && !household && filtered.length === 0 && (
                  <p className="mt-2 font-sans text-xs text-red-300">
                    No match found. Please contact us if you believe this is an error.
                  </p>
                )}
              </div>

              {checking && (
                <p className="font-sans text-sm text-paper/50">Looking up your party…</p>
              )}

              {/* Household members — who's coming */}
              {household && !checking && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Who's coming?" />
                  <div className="mt-2 divide-y divide-paper/10 border-y border-paper/10">
                    {household.members.map((name) => (
                      <label
                        key={name}
                        className="flex items-center justify-between gap-4 py-3.5 cursor-pointer select-none"
                      >
                        <span className="font-sans text-paper">{name}</span>
                        <input
                          type="checkbox"
                          checked={attendance[name] ?? false}
                          onChange={(e) =>
                            setAttendance((a) => ({ ...a, [name]: e.target.checked }))
                          }
                          className="h-5 w-5 accent-paper cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 font-sans text-xs text-paper/40">
                    Check everyone who will attend; leave unchecked for those who can&apos;t make it.
                  </p>
                </motion.div>
              )}

              {/* Plus-one — only when the invitation allows one */}
              {household?.allowPlusOne && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bringPlusOne}
                      onChange={(e) => setBringPlusOne(e.target.checked)}
                      className="h-5 w-5 accent-paper cursor-pointer"
                    />
                    <span className="font-sans text-sm text-paper/80">I&apos;ll bring a guest</span>
                  </label>
                  {bringPlusOne && (
                    <input
                      type="text"
                      value={plusOneName}
                      placeholder="Guest's name"
                      onChange={(e) => setPlusOneName(e.target.value)}
                      className="w-full bg-transparent border-b border-paper/30 focus:border-paper py-3 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors"
                    />
                  )}
                </motion.div>
              )}

              {/* Dietary + notes (party-level) */}
              {household && anyAttending && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Dietary Restrictions (optional)" />
                  <input
                    type="text"
                    value={dietary}
                    placeholder="Anyone in your party — e.g. vegetarian, gluten-free…"
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full bg-transparent border-b border-paper/30 focus:border-paper py-3 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors"
                  />
                </motion.div>
              )}

              {household && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Notes (optional)" />
                  <textarea
                    value={notes}
                    placeholder="Any message for Mary-Kate & Benji…"
                    rows={3}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-transparent border-b border-paper/30 focus:border-paper py-3 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors resize-none"
                  />
                </motion.div>
              )}

              {errorMsg && (
                <p className="font-sans text-xs text-red-300 bg-red-900/20 border border-red-400/20 px-4 py-3">
                  {errorMsg}
                </p>
              )}

              {household && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full btn-primary bg-paper text-ink hover:bg-paper-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Sending…" : "Submit RSVP"}
                  </button>
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Label({ text }: { text: string }) {
  return (
    <span className="block font-sans text-xs tracking-widest uppercase text-paper/50 mb-1">
      {text}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-sans text-xs tracking-widest uppercase text-paper/50 w-28 shrink-0 pt-0.5">{label}</span>
      <span className="font-sans text-paper/80 text-sm">{value}</span>
    </div>
  );
}
