// FAQ — native <details> accordion (no client JS needed).
// TODO: confirm the placeholder answers marked below.
const faqs: { q: string; a: string }[] = [
  {
    q: 'What does "Formal Attire" mean?',
    a: "Formal / black-tie optional. For men, a tuxedo or a dark suit and tie. For women, a floor-length gown or an elegant formal cocktail dress. When in doubt, dress up rather than down. Our colors are black and white, but guests are welcome in any color — kindly avoid white.",
  },
  {
    q: "What time should I arrive?",
    a: "Please plan to arrive by 5:30 PM so you're seated before the ceremony begins at 6:00 PM.",
  },
  {
    q: "Is the ceremony indoors or outdoors?",
    a: "The ceremony is held inside Anthony Chapel — a glass chapel set among the trees at Garvan Woodland Gardens. Cocktails and the dinner reception follow at the Hamp Williams Building in downtown Hot Springs.",
  },
  {
    q: "Can I bring a guest or plus-one?",
    a: "Your invitation will note whether a plus-one is included. When you RSVP, you'll be able to add your guest's name if one is reserved for you.",
  },
  {
    q: "Are children welcome?",
    a: "To allow all guests to relax and celebrate, our wedding is adults-only — unless your children are specifically named on your invitation. Thank you for understanding!",
  },
  {
    q: "Where should I stay?",
    a: "See our Accommodations page for a few hotels near the gardens in Hot Springs. Room-block details will be added as we arrange them.",
  },
  {
    q: "Is there parking?",
    a: "Yes — complimentary on-site parking is available at Garvan Woodland Gardens.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-paper">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Good to know</p>
          <h2 className="font-serif text-5xl text-ink font-light">FAQ</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
        </div>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-serif text-lg text-ink font-light">{q}</span>
                <span className="font-sans text-xl text-ink-faint transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
