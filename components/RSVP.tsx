"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { households, findHousehold, type Household } from "@/data/guests";

type Status = "idle" | "submitting" | "success" | "error" | "alreadyRsvped";

type ExistingMember = { name: string; attending: string; plusOne: string };
type ExistingRsvp = { members: ExistingMember[]; dietary: string; emails: string; notes: string };

const allNames = households.flatMap((h) => h.members.map((m) => m.name));

// White checkmark for the custom (blue) "attending" checkbox.
const CHECK_ICON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 13l4 4L19 7'/%3E%3C/svg%3E\")";

export default function RSVP() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [household, setHousehold] = useState<Household | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [plusOneOn, setPlusOneOn] = useState<Record<string, boolean>>({});
  const [plusOneNames, setPlusOneNames] = useState<Record<string, string>>({});
  const [dietary, setDietary] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
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
    setQuery(name);
    setShowDropdown(false);
    setHousehold(null);
    setStatus("idle");
    setChecking(true);
    const defaults = () => {
      setAttendance(Object.fromEntries(h.members.map((m) => [m.name, true])));
      setPlusOneOn({});
      setPlusOneNames({});
      setEmails([""]);
    };

    try {
      const res = await fetch(`/api/rsvp?householdId=${encodeURIComponent(h.id)}`);
      const data = await res.json();
      if (data.alreadyRsvped) {
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
    setHousehold(null);
    setAttendance({});
    setPlusOneOn({});
    setPlusOneNames({});
    setDietary("");
    setEmails([""]);
    setNotes("");
    setStatus("idle");
    setErrorMsg("");
    setExistingRsvp(null);
    setIsUpdating(false);
  };

  const prefillFromExisting = (existing: ExistingRsvp) => {
    setAttendance(Object.fromEntries(existing.members.map((m) => [m.name, m.attending === "yes"])));
    setPlusOneOn(Object.fromEntries(existing.members.filter((m) => m.plusOne).map((m) => [m.name, true])));
    setPlusOneNames(Object.fromEntries(existing.members.filter((m) => m.plusOne).map((m) => [m.name, m.plusOne])));
    setDietary(existing.dietary);
    const priorEmails = existing.emails ? existing.emails.split(/,\s*/).filter(Boolean) : [];
    setEmails(priorEmails.length ? priorEmails : [""]);
    setNotes(existing.notes);
    setExistingRsvp(null);
    setIsUpdating(true);
    setStatus("idle");
  };

  const submit = async (overwrite = false) => {
    if (!household) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdId: household.id,
          members: household.members.map((m) => ({
            name: m.name,
            attending: attendance[m.name] ? "yes" : "no",
            plusOne: m.plusOne && plusOneOn[m.name] ? plusOneNames[m.name] ?? "" : "",
          })),
          dietary,
          emails: emails.map((x) => x.trim()).filter(Boolean),
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

  const anyAttending = household?.members.some((m) => attendance[m.name]) ?? false;

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
                  <div key={m.name}>
                    <Row
                      label={m.name}
                      value={m.attending === "yes" ? "Attending" : m.attending === "no" ? "Not attending" : "TBD"}
                    />
                    {m.plusOne && <Row label="+ Guest" value={m.plusOne} />}
                  </div>
                ))}
                {existingRsvp.dietary && <Row label="Dietary" value={existingRsvp.dietary} />}
              </div>
              <p className="font-sans text-paper/60 text-sm">Would you like to update your response?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => prefillFromExisting(existingRsvp)}
                  className="flex-1 inline-block px-8 py-3 bg-paper text-ink font-sans text-sm tracking-widest uppercase hover:bg-paper-soft transition-colors duration-300 cursor-pointer"
                >
                  Update our RSVP
                </button>
                <button
                  onClick={reset}
                  className="flex-1 inline-block px-8 py-3 border border-paper/40 text-paper font-sans text-sm tracking-widest uppercase hover:bg-paper hover:text-ink transition-colors duration-300 cursor-pointer"
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
                  e.g. Sarah Fortune, not &ldquo;The Fortune Family&rdquo; or &ldquo;Dr. &amp; Mrs. Fortune&rdquo;
                </p>
                <input
                  type="text"
                  value={query}
                  placeholder="Start typing your name…"
                  autoComplete="off"
                  onChange={(e) => {
                    setQuery(e.target.value);
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

              {/* Household members: who's coming (plus-one nested under eligible members) */}
              {household && !checking && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Who's coming?" />
                  <div className="mt-2 divide-y divide-paper/10 border-y border-paper/10">
                    {household.members.map((m) => {
                      const coming = attendance[m.name] ?? false;
                      return (
                      <div key={m.name} className="py-3.5">
                        <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
                          <span className="font-sans text-paper">{m.name}</span>
                          <input
                            type="checkbox"
                            checked={coming}
                            onChange={(e) => setAttendance((a) => ({ ...a, [m.name]: e.target.checked }))}
                            className={`appearance-none h-5 w-5 rounded-sm border-2 cursor-pointer transition-colors ${
                              coming ? "bg-blue-600 border-blue-600" : "bg-transparent border-red-500"
                            }`}
                            style={
                              coming
                                ? { backgroundImage: CHECK_ICON, backgroundSize: "72%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }
                                : undefined
                            }
                          />
                        </label>

                        {m.plusOne && coming && (
                          <div className="mt-3 pl-4 border-l border-paper/15 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={plusOneOn[m.name] ?? false}
                                onChange={(e) => setPlusOneOn((p) => ({ ...p, [m.name]: e.target.checked }))}
                                className="h-4 w-4 accent-blue-600 cursor-pointer"
                              />
                              <span className="font-sans text-sm text-paper/80">Bringing a guest?</span>
                            </label>
                            {plusOneOn[m.name] && (
                              <input
                                type="text"
                                value={plusOneNames[m.name] ?? ""}
                                placeholder="Guest's name"
                                onChange={(e) => setPlusOneNames((p) => ({ ...p, [m.name]: e.target.value }))}
                                className="w-full bg-transparent border-b border-paper/30 focus:border-paper py-2 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors"
                              />
                            )}
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-sans text-xs text-paper/40">
                    Check everyone who will attend; leave unchecked for those who can&apos;t make it.
                  </p>
                </motion.div>
              )}

              {/* Dietary + notes (party-level) */}
              {household && !checking && anyAttending && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Dietary Restrictions (optional)" />
                  <input
                    type="text"
                    value={dietary}
                    placeholder="Anyone in your party, e.g. vegetarian, gluten-free…"
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full bg-transparent border-b border-paper/30 focus:border-paper py-3 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors"
                  />
                </motion.div>
              )}

              {household && !checking && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Label text="Email(s)" />
                  <div className="space-y-2">
                    {emails.map((email, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="email"
                          value={email}
                          placeholder="you@example.com"
                          onChange={(e) => setEmails((list) => list.map((v, idx) => (idx === i ? e.target.value : v)))}
                          className="flex-1 bg-transparent border-b border-paper/30 focus:border-paper py-2 font-sans text-paper placeholder:text-paper/30 outline-none transition-colors"
                        />
                        {emails.length > 1 && (
                          <button
                            type="button"
                            aria-label="Remove email"
                            onClick={() => setEmails((list) => list.filter((_, idx) => idx !== i))}
                            className="text-paper/40 hover:text-paper text-xl leading-none px-1"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmails((list) => [...list, ""])}
                    className="mt-2 font-sans text-xs tracking-widest uppercase text-paper/60 hover:text-paper transition-colors"
                  >
                    + Add another email
                  </button>
                </motion.div>
              )}

              {household && !checking && (
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

              {household && !checking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full inline-block px-8 py-3 bg-paper text-ink font-sans text-sm tracking-widest uppercase hover:bg-paper-soft transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
