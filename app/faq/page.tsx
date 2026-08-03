import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = { title: "FAQ | Mary-Kate & Benji" };

export default function FaqPage() {
  return (
    <main className="min-h-screen pt-16">
      <FAQ />
    </main>
  );
}
