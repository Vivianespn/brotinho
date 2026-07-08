import { NavLink } from 'react-router-dom';
import { Sprout, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const linkClasses = ({ isActive }) =>
  `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
    isActive
      ? 'bg-sage text-forest-dark'
      : 'text-cream/90 hover:bg-forest-light/60'
  }`;

export default function Header() {
  const { t, i18n } = useTranslation();

  function alternarIdioma() {
    const novo = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(novo);
    localStorage.setItem('brotinho:idioma', novo);
  }

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
            {t('nav.catalogo')}
          </NavLink>
          <NavLink to="/minhas-plantas" className={linkClasses}>
            {t('nav.minhasPlantas')}
          </NavLink>
          <NavLink to="/sobre" className={linkClasses}>
            {t('nav.sobre')}
          </NavLink>
          <button
            onClick={alternarIdioma}
            aria-label="Trocar idioma / Switch language"
            className="ml-1 flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-forest-light/60 transition-colors text-sm font-medium"
          >
            <Languages className="w-4 h-4" />
            {i18n.language === 'pt' ? 'EN' : 'PT'}
          </button>
        </nav>
      </div>
    </header>
  );
}
