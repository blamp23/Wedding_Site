import type { Metadata } from "next";
import Registry from "@/components/Registry";

export const metadata: Metadata = { title: "Registry | Mary-Kate & Benji" };

export default function RegistryPage() {
  return (
    <main className="min-h-screen pt-16">
      <Registry />
    </main>
  );
}
