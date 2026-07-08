import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const LIMITE_SCROLL = 400; // px rolados até o botão aparecer

export default function BotaoTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisivel(window.scrollY > LIMITE_SCROLL);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function voltarAoTopo() {
    const reduzirMovimento = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? 'auto' : 'smooth' });
  }

  return (
    <button
      onClick={voltarAoTopo}
      aria-label="Voltar ao topo"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-moss text-white shadow-lg hover:bg-moss-dark transition-all duration-300 ${
        visivel
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
