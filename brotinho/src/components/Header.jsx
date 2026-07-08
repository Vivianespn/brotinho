import { NavLink } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const linkClasses = ({ isActive }) =>
  `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
    isActive
      ? 'bg-sage text-forest-dark'
      : 'text-cream/90 hover:bg-forest-light/60'
  }`;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-forest text-cream shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <Sprout className="w-6 h-6 text-moss-light" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Brotinho
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/catalogo" className={linkClasses}>
            Catálogo
          </NavLink>
          <NavLink to="/minhas-plantas" className={linkClasses}>
            Minhas plantas
          </NavLink>
          <NavLink to="/sobre" className={linkClasses}>
            Sobre
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
