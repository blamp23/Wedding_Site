import Link from "next/link";
import SaveTheDate from "@/components/SaveTheDate";
import Slideshow from "@/components/Slideshow";

const menu = [
  { label: "Venue & Schedule", href: "/venue" },
  { label: "Accommodations", href: "/accommodations" },
  { label: "Registry", href: "/registry" },
  { label: "Wedding Party", href: "/party" },
  { label: "FAQ", href: "/faq" },
  { label: "RSVP", href: "/rsvp" },
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
            {menu.map(({ label, href }) => {
              const isRsvp = href === "/rsvp";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center justify-between gap-2 px-4 py-3 transition-colors duration-300 ${
                    isRsvp
                      ? "bg-ink border border-ink hover:opacity-90"
                      : "border border-ink/15 bg-paper hover:border-ink"
                  }`}
                >
                  <span
                    className={`font-sans text-xs tracking-widest uppercase ${
                      isRsvp ? "text-paper" : "text-ink"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`font-sans transition-colors ${
                      isRsvp ? "text-paper" : "text-ink-faint group-hover:text-ink"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </main>
  );
}
