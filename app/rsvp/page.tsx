import type { Metadata } from "next";
import RSVP from "@/components/RSVP";

export const metadata: Metadata = { title: "RSVP | Mary-Kate & Benji" };

export default function RsvpPage() {
  return (
    <main className="min-h-screen bg-ink pt-16">
      <RSVP />
    </main>
  );
}
