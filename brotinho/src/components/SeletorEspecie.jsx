import { useEffect, useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buscarPlantas } from '../services/perenualApi';
import FotoPlanta from './FotoPlanta';

export default function SeletorEspecie({ especieSelecionada, onSelecionar }) {
  const { i18n } = useTranslation();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (termo.trim().length < 2) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const debounce = setTimeout(() => {
      buscarPlantas(termo, i18n.language).then(({ resultados }) => {
        setResultados(resultados);
        setBuscando(false);
      });
    }, 350);
    return () => clearTimeout(debounce);
  }, [termo, i18n.language]);

  if (especieSelecionada) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-moss/40 bg-sage p-3">
        <div className="flex items-center gap-2 min-w-0">
          <Check className="w-4 h-4 text-moss shrink-0" />
          <div className="min-w-0">
            <p className="font-medium truncate">
              {especieSelecionada.especieNome}
            </p>
            {especieSelecionada.cientifico && (
              <p className="text-xs italic text-ink/50 truncate">
                {especieSelecionada.cientifico}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelecionar(null)}
          className="p-1.5 rounded-full hover:bg-black/5 shrink-0"
          aria-label="Trocar espécie"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
        <input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar espécie no catálogo…"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-moss/30 bg-white outline-none focus:border-moss text-sm"
        />
      </div>
      {buscando && <p className="text-xs text-ink/50 mt-2">Buscando…</p>}
      {resultados.length > 0 && (
        <ul className="mt-2 border border-black/10 rounded-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-black/5">
          {resultados.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() =>
                  onSelecionar({
                    especieId: r.id,
                    especieNome: r.common_name,
                    cientifico: r.scientific_name?.[0] || '',
                    frequenciaRegaDias: r.watering_days,
                    foto: r.image_url,
                  })
                }
                className="w-full flex items-center gap-2 p-2 hover:bg-sage text-left text-sm"
              >
                <FotoPlanta
                  src={r.image_url}
                  alt={r.common_name}
                  className="w-8 h-8 rounded-md object-cover shrink-0"
                />
                <div className="hidden w-8 h-8 rounded-md bg-sage shrink-0" />
                <span className="truncate">{r.common_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
