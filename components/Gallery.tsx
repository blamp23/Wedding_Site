"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import { galleryPhotos as photos } from "@/data/gallery";

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
    <section id="gallery" className="py-24 bg-paper">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink-soft mb-3">A peek into our world</p>
          <h2 className="font-serif text-5xl text-ink font-light">Gallery</h2>
          <div className="mx-auto my-6 h-px w-16 bg-ink/30" />
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
          root: { "--yarl__color_backdrop": "rgba(17, 17, 17, 0.97)" },
        }}
      />
    </section>
  );
}
