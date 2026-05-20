"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import guestList from "@/data/guests.json";

type Status = "idle" | "submitting" | "success" | "error" | "alreadyRsvped";

type ExistingRsvp = {
  attending: string;
  dietary: string;
  plusOne: string;
  notes: string;
};

export default function RSVP() {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [dietary, setDietary] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [existingRsvp, setExistingRsvp] = useState<ExistingRsvp | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const guests = guestList as string[];

  const filtered = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return guests.filter((g) => g.toLowerCase().includes(q)).slice(0, 8);
  }, [query, guests]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectGuest = (name: string) => {
    setSelectedName(name);
    setQuery(name);
    setShowDropdown(false);
  };

  const reset = () => {
    setQuery("");
    setSelectedName(null);
    setAttending("");
    setDietary("");
    setPlusOne("");
    setNotes("");
    setStatus("idle");
    setErrorMsg("");
    setExistingRsvp(null);
    setIsUpdating(false);
  };

  const prefillFromExisting = (existing: ExistingRsvp) => {
    setAttending(existing.attending === "yes" ? "yes" : existing.attending === "no" ? "no" : "");
    setDietary(existing.dietary === "—" ? "" : existing.dietary);
    setPlusOne(existing.plusOne === "—" ? "" : existing.plusOne);
    setNotes(existing.notes === "—" ? "" : existing.notes);
    setExistingRsvp(null);
    setIsUpdating(true);
    setStatus("idle");
  };

  const submit = async (overwrite = false) => {
    if (!selectedName || !attending) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedName,
          attending,
          dietary,
          plusOne,
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

  return (
    <section id="rsvp" className="py-24 bg-green-deep">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-green-light mb-3">We hope to see you</p>
          <h2 className="font-serif text-5xl text-cream font-light">RSVP</h2>
          <div className="w-16 h-px bg-green-accent mx-auto my-6" />
          <p className="font-sans text-cream/70 text-sm leading-relaxed">
            Please RSVP by <strong className="text-cream">June 28, 2026</strong>.<br />
            Begin typing your name to find yourself on the guest list.
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
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-green-light flex items-center justify-center">
                <svg className="w-7 h-7 text-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-3xl text-cream font-light mb-3">Thank you!</h3>
              <p className="font-sans text-cream/70 text-sm mb-8">
                We&apos;ve received your RSVP and can&apos;t wait to celebrate with you.
              </p>
              <button onClick={reset} className="font-sans text-xs tracking-widest uppercase text-green-light border-b border-green-light/40 hover:border-green-light transition-colors pb-0.5">
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
              className="border border-green-accent/30 bg-green-DEFAULT/30 p-8 text-center space-y-5"
            >
              <p className="font-sans text-xs tracking-widest uppercase text-green-light">Heads up</p>
              <h3 className="font-serif text-2xl text-cream font-light">
                It looks like you&apos;ve already RSVP&apos;d!
              </h3>
              <div className="text-left space-y-2 border-t border-green-accent/20 pt-5">
                <Row label="Attending" value={existingRsvp.attending === "yes" ? "Joyfully accepts" : "Regretfully declines"} />
                {existingRsvp.dietary && existingRsvp.dietary !== "—" && (
                  <Row label="Dietary" value={existingRsvp.dietary} />
                )}
                {existingRsvp.plusOne && existingRsvp.plusOne !== "—" && (
                  <Row label="Plus one" value={existingRsvp.plusOne} />
                )}
                {existingRsvp.notes && existingRsvp.notes !== "—" && (
                  <Row label="Notes" value={existingRsvp.notes} />
                )}
              </div>
              <p className="font-sans text-cream/60 text-sm">Would you like to update your response?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => prefillFromExisting(existingRsvp)}
                  className="flex-1 btn-primary bg-cream text-green-deep hover:bg-cream-secondary"
                >
                  Update my RSVP
                </button>
                <button
                  onClick={reset}
                  className="flex-1 btn-outline border-green-accent/40 text-cream/60 hover:text-cream hover:border-cream"
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
                <input
                  type="text"
                  value={query}
                  placeholder="Start typing your name…"
                  autoComplete="off"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedName(null);
                    setShowDropdown(true);
                  }}
                  onFocus={() => query.length >= 2 && setShowDropdown(true)}
                  className="w-full bg-transparent border-b border-green-accent/50 focus:border-cream py-3 font-sans text-cream placeholder:text-cream/30 outline-none transition-colors"
                />
                {showDropdown && filtered.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 bg-green-DEFAULT border border-green-accent/30 shadow-xl mt-1 max-h-56 overflow-y-auto">
                    {filtered.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => selectGuest(name)}
                        className="w-full text-left px-4 py-3 font-sans text-sm text-cream/80 hover:bg-green-accent/20 hover:text-cream transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
                {query.length >= 2 && !selectedName && filtered.length === 0 && (
                  <p className="mt-2 font-sans text-xs text-red-300">
                    No match found. Please contact us if you believe this is an error.
                  </p>
                )}
              </div>

              {/* Attending */}
              {selectedName && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Will you attend?" />
                  <div className="flex gap-4 mt-3">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAttending(v)}
                        className={`flex-1 py-3 font-sans text-xs tracking-widest uppercase border transition-colors ${
                          attending === v
                            ? "bg-cream text-green-deep border-cream"
                            : "bg-transparent text-cream/60 border-green-accent/40 hover:border-cream/60 hover:text-cream"
                        }`}
                      >
                        {v === "yes" ? "Joyfully accepts" : "Regretfully declines"}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Dietary + Plus One + Notes */}
              {selectedName && attending === "yes" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div>
                    <Label text="Dietary Restrictions (optional)" />
                    <input
                      type="text"
                      value={dietary}
                      placeholder="e.g. Vegetarian, gluten-free…"
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full bg-transparent border-b border-green-accent/50 focus:border-cream py-3 font-sans text-cream placeholder:text-cream/30 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <Label text="Plus One Name (optional)" />
                    <input
                      type="text"
                      value={plusOne}
                      placeholder="Guest name, if applicable"
                      onChange={(e) => setPlusOne(e.target.value)}
                      className="w-full bg-transparent border-b border-green-accent/50 focus:border-cream py-3 font-sans text-cream placeholder:text-cream/30 outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* Notes — always visible once name is selected */}
              {selectedName && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Notes (optional)" />
                  <textarea
                    value={notes}
                    placeholder="Any message for Benji & Mary-Kate…"
                    rows={3}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-transparent border-b border-green-accent/50 focus:border-cream py-3 font-sans text-cream placeholder:text-cream/30 outline-none transition-colors resize-none"
                  />
                </motion.div>
              )}

              {errorMsg && (
                <p className="font-sans text-xs text-red-300 bg-red-900/20 border border-red-400/20 px-4 py-3">
                  {errorMsg}
                </p>
              )}

              {selectedName && attending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full btn-primary bg-cream text-green-deep hover:bg-cream-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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
    <span className="block font-sans text-xs tracking-widest uppercase text-green-light mb-1">
      {text}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-sans text-xs tracking-widest uppercase text-green-light w-20 shrink-0 pt-0.5">{label}</span>
      <span className="font-sans text-cream/80 text-sm">{value}</span>
    </div>
  );
}
