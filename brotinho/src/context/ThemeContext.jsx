import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'brotinho:tema';

function temaInicial() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) return salvo;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'escuro'
      : 'claro';
  } catch {
    return 'claro';
  }
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro');
    try {
      localStorage.setItem(STORAGE_KEY, tema);
    } catch {
      // segue sem persistir a preferência
    }
  }, [tema]);

  const alternarTema = () =>
    setTema((t) => (t === 'escuro' ? 'claro' : 'escuro'));

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto)
    throw new Error('useTheme precisa estar dentro de ThemeProvider');
  return contexto;
}
