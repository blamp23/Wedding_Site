export default function Footer() {
  return (
    <footer className="bg-ink py-14 text-center">
      {/* Monogram */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-paper/30 flex items-center justify-center">
        <span className="font-serif text-xl text-paper font-light">M&amp;B</span>
      </div>

      <p className="font-serif text-2xl text-paper font-light mb-2">
        Mary-Kate &amp; Benji
      </p>
      <p className="font-sans text-xs tracking-widest uppercase text-paper/50 mb-8">
        June 5, 2027 · Hot Springs, Arkansas
      </p>

      {/* Questions / inquiries */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-12 bg-paper/20" />
        <p className="font-sans text-xs text-paper/50">
          Questions? Email us at{" "}
          <a
            href="mailto:mk.and.benji@gmail.com"
            className="underline underline-offset-2 hover:text-paper transition-colors"
          >
            mk.and.benji@gmail.com
          </a>
        </p>
        <div className="h-px w-12 bg-paper/20" />
      </div>

      <p className="font-sans text-xs text-paper/30">
        &copy; {new Date().getFullYear()} Mary-Kate Mitchell &amp; Benji Lamp
      </p>
    </footer>
  );
}
