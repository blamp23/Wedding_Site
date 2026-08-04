import type { Metadata } from "next";
import WeddingParty from "@/components/WeddingParty";

export const metadata: Metadata = { title: "Wedding Party | Mary-Kate & Benji" };

export default function PartyPage() {
  return (
    <main className="min-h-screen pt-16">
      <WeddingParty />
    </main>
  );
}
