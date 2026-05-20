"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import "react-photo-album/masonry.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";

// Replace these Unsplash URLs with your actual photos
// Each photo needs: src, width, height
const photos: Photo[] = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", width: 800, height: 1067, alt: "Couple" },
  { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80", width: 800, height: 533, alt: "Together" },
  { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80", width: 800, height: 534, alt: "Adventure" },
  { src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80", width: 800, height: 1067, alt: "Portrait" },
  { src: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=800&q=80", width: 800, height: 600, alt: "Moment" },
  { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", width: 800, height: 1200, alt: "Golden hour" },
  { src: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80", width: 800, height: 533, alt: "Landscape" },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", width: 800, height: 1067, alt: "Smile" },
];

const lightboxSlides = photos.map(({ src, width, height, alt }) => ({
  src,
  width,
  height,
  alt: alt ?? "",
}));

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  const handleClick = useCallback(({ index: i }: { index: number }) => {
    setIndex(i);
  }, []);

  return (
    <section id="gallery" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-green-accent mb-3">A peek into our world</p>
          <h2 className="font-serif text-5xl text-green-deep font-light">Gallery</h2>
          <div className="section-divider" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MasonryPhotoAlbum
            photos={photos}
            columns={(w) => (w < 640 ? 2 : w < 1024 ? 3 : 4)}
            spacing={8}
            onClick={({ index: i }) => setIndex(i)}
            render={{
              photo: ({ onClick }, { photo }) => (
                <div
                  style={{ overflow: "hidden", cursor: "pointer" }}
                  onClick={onClick}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt ?? ""}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    }}
                  />
                </div>
              ),
            }}
          />
        </motion.div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={lightboxSlides}
        index={index}
        plugins={[Zoom, Slideshow]}
        styles={{
          root: { "--yarl__color_backdrop": "rgba(30, 51, 41, 0.97)" },
        }}
      />
    </section>
  );
}
