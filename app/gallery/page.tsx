import type { Metadata } from "next";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = { title: "Gallery | Mary-Kate & Benji" };

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-16">
      <Gallery />
    </main>
  );
}
