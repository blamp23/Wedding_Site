import type { Metadata } from "next";
import Venue from "@/components/Venue";

export const metadata: Metadata = { title: "Venue & Schedule | Mary-Kate & Benji" };

export default function VenuePage() {
  return (
    <main className="min-h-screen pt-16">
      <Venue />
    </main>
  );
}
