import type { Metadata } from "next";
import Accommodations from "@/components/Accommodations";
import Travel from "@/components/Travel";

export const metadata: Metadata = { title: "Travel & Accommodations | Mary-Kate & Benji" };

export default function AccommodationsPage() {
  return (
    <main className="min-h-screen pt-16">
      <Accommodations />
      <Travel />
    </main>
  );
}
