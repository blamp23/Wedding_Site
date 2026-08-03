import Link from "next/link";
import SaveTheDate from "@/components/SaveTheDate";
import Gallery from "@/components/Gallery";

const menu = [
  { label: "Venue & Schedule", href: "/venue", blurb: "Where and when to join us" },
  { label: "Accommodations", href: "/accommodations", blurb: "Places to stay in Hot Springs" },
  { label: "RSVP", href: "/rsvp", blurb: "Let us know you're coming" },
  { label: "FAQ", href: "/faq", blurb: "Dress code & details" },
  { label: "Registry", href: "/registry", blurb: "If you'd like to give a gift" },
];

export default function Home() {
  return (
    <main>
      <SaveTheDate />
      <Gallery />

      <section className="py-24 bg-paper-soft">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">Explore</p>
            <h2 className="font-serif text-5xl text-ink font-light">Everything You Need</h2>
            <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {menu.map(({ label, href, blurb }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-4 border border-ink/15 bg-paper px-8 py-7 hover:border-ink transition-colors duration-300"
              >
                <span>
                  <span className="block font-serif text-2xl text-ink font-light">{label}</span>
                  <span className="block font-sans text-xs text-ink-soft mt-1">{blurb}</span>
                </span>
                <span className="font-sans text-ink-faint group-hover:text-ink transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
