import type { Photo } from "react-photo-album";

// Photos live in public/images/ and are referenced as /images/<file>.
// width/height just need the correct ratio to drive the layout.
export const galleryPhotos: Photo[] = [
  { src: "/images/benji-mary-kate-1.jpg", width: 2400, height: 3600, alt: "Mary-Kate & Benji" },
  { src: "/images/benji-mary-kate-11.jpg", width: 2400, height: 3600, alt: "Mary-Kate & Benji" },
  { src: "/images/benji-mary-kate-27.jpg", width: 2400, height: 3600, alt: "Mary-Kate & Benji" },
  { src: "/images/benji-mary-kate-47.jpg", width: 2400, height: 3600, alt: "Mary-Kate & Benji" },
];
