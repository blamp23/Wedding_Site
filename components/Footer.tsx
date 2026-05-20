export default function Footer() {
  return (
    <footer className="bg-green-deep py-12 text-center">
      {/* Monogram */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-green-light/30 flex items-center justify-center">
        <span className="font-serif text-xl text-cream font-light">B&amp;M</span>
      </div>

      <p className="font-serif text-2xl text-cream font-light mb-2">
        Benji &amp; Mary-Kate
      </p>
      <p className="font-sans text-xs tracking-widest uppercase text-green-light/60 mb-6">
        Engagement Party · July 2026
      </p>

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-12 bg-green-light/20" />
        <p className="font-sans text-xs text-green-light/40">
          Questions? Reach us at{" "}
          <a
            href="mailto:lampbenji@gmail.com"
            className="underline underline-offset-2 hover:text-green-light transition-colors"
          >
            lampbenji@gmail.com
          </a>
        </p>
        <div className="h-px w-12 bg-green-light/20" />
      </div>

      <p className="font-sans text-xs text-green-light/30">
        &copy; {new Date().getFullYear()} Benji Lamp &amp; Mary-Kate Mitchell
      </p>
    </footer>
  );
}
