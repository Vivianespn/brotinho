export default function Footer() {
  return (
    <footer className="bg-forest text-cream/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="font-display italic">Cuide com carinho, veja brotar.</p>
        <p>Brotinho © {new Date().getFullYear()} — dados via Perenual API</p>
      </div>
    </footer>
  );
}
