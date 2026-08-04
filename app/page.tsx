import Link from "next/link";
import SaveTheDate from "@/components/SaveTheDate";
import Slideshow from "@/components/Slideshow";

const menu = [
  { label: "Venue & Schedule", href: "/venue" },
  { label: "Wedding Party", href: "/party" },
  { label: "Accommodations", href: "/accommodations" },
  { label: "RSVP", href: "/rsvp" },
  { label: "FAQ", href: "/faq" },
  { label: "Registry", href: "/registry" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper pt-16">
      <div className="max-w-6xl mx-auto px-6 md:min-h-[calc(100vh-4rem)] grid md:grid-cols-2 gap-12 lg:gap-16 items-center py-12">
        {/* Left: hero */}
        <SaveTheDate />

        {/* Right: slideshow + menu */}
        <div className="space-y-6">
          <Slideshow />

          <nav className="grid grid-cols-2 gap-3">
            {menu.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-2 border border-ink/15 bg-paper px-4 py-3 hover:border-ink transition-colors duration-300"
              >
                <span className="font-sans text-xs tracking-widest uppercase text-ink">{label}</span>
                <span className="font-sans text-ink-faint group-hover:text-ink transition-colors">→</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
