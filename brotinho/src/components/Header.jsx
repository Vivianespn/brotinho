import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const linkClasses = ({ isActive }) =>
  `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
    isActive
      ? 'bg-sage text-forest-dark dark:bg-forest-light dark:text-cream'
      : 'text-cream/90 hover:bg-forest-light/60'
  }`;

const linkClassesMobile = ({ isActive }) =>
  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-sage text-forest-dark dark:bg-forest-light dark:text-cream'
      : 'text-cream/90 hover:bg-forest-light/60'
  }`;

export default function Header() {
  const { t, i18n } = useTranslation();
  const { tema, alternarTema } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);

  function alternarIdioma() {
    const novo = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(novo);
    localStorage.setItem('brotinho:idioma', novo);
  }

  return (
    <header className="sticky top-0 z-40 bg-forest dark:bg-forest-dark text-cream shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 shrink-0"
          onClick={() => setMenuAberto(false)}
        >
          <Sprout className="w-6 h-6 text-moss-light" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Brotinho
          </span>
        </NavLink>

        {/* Navegação desktop */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
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

          <button
            onClick={alternarTema}
            aria-label={
              tema === 'escuro' ? 'Ativar tema claro' : 'Ativar tema escuro'
            }
            className="p-2 rounded-full hover:bg-forest-light/60 transition-colors"
          >
            {tema === 'escuro' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </nav>

        {/* Botão do menu mobile */}
        <button
          onClick={() => setMenuAberto((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-forest-light/60 transition-colors"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
        >
          {menuAberto ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Painel do menu mobile */}
      {menuAberto && (
        <nav className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          <NavLink
            to="/catalogo"
            className={linkClassesMobile}
            onClick={() => setMenuAberto(false)}
          >
            {t('nav.catalogo')}
          </NavLink>
          <NavLink
            to="/minhas-plantas"
            className={linkClassesMobile}
            onClick={() => setMenuAberto(false)}
          >
            {t('nav.minhasPlantas')}
          </NavLink>
          <NavLink
            to="/sobre"
            className={linkClassesMobile}
            onClick={() => setMenuAberto(false)}
          >
            {t('nav.sobre')}
          </NavLink>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
            <button
              onClick={alternarIdioma}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-forest-light/60 transition-colors text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              {i18n.language === 'pt' ? 'English' : 'Português'}
            </button>
            <button
              onClick={alternarTema}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-forest-light/60 transition-colors text-sm font-medium"
            >
              {tema === 'escuro' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              {tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
