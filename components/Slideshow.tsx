"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galleryPhotos } from "@/data/gallery";

const INTERVAL = 20000;

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  const go = (next: number) =>
    setIndex((next + galleryPhotos.length) % galleryPhotos.length);

  useEffect(() => {
    if (galleryPhotos.length <= 1) return;
    const id = setInterval(() => go(index + 1), INTERVAL);
    return () => clearInterval(id);
  }, [index]);

  const photo = galleryPhotos[index];

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden bg-paper-soft group">
      <AnimatePresence>
        <motion.img
          key={index}
          src={photo.src}
          alt={photo.alt ?? ""}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {galleryPhotos.length > 1 && (
        <>
          {/* Prev / next clickers */}
          <button
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-ink/30 text-paper opacity-0 group-hover:opacity-100 hover:bg-ink/60 transition-all"
          >
            ‹
          </button>
          <button
            aria-label="Next photo"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-ink/30 text-paper opacity-0 group-hover:opacity-100 hover:bg-ink/60 transition-all"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {galleryPhotos.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-paper" : "bg-paper/40 hover:bg-paper/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
