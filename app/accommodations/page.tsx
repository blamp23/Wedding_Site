import type { Metadata } from "next";
import Accommodations from "@/components/Accommodations";

export const metadata: Metadata = { title: "Accommodations | Mary-Kate & Benji" };

export default function AccommodationsPage() {
  return (
    <main className="min-h-screen pt-16">
      <Accommodations />
    </main>
  );
}
