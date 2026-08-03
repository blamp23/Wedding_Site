"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galleryPhotos } from "@/data/gallery";

const INTERVAL = 4000;

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (galleryPhotos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % galleryPhotos.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  const photo = galleryPhotos[index];

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden bg-paper-soft">
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
    </div>
  );
}
