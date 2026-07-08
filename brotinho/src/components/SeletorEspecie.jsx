import { useEffect, useState } from 'react';
import { Search, Check, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buscarPlantas, buscarDetalhesPlanta } from '../services/perenualApi';
import FotoPlanta from './FotoPlanta';

export default function SeletorEspecie({ especieSelecionada, onSelecionar }) {
  const { i18n } = useTranslation();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [confirmandoEspecie, setConfirmandoEspecie] = useState(false);

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

  // A busca (species-list) não traz frequência de rega real — só o endpoint
  // de detalhes tem isso. Então, ao escolher uma espécie sem esse dado,
  // buscamos os detalhes completos antes de confirmar a seleção.
  async function handleSelecionar(r) {
    let frequenciaRegaDias = r.watering_days;
    let frequenciaEstimada = false;

    if (!frequenciaRegaDias) {
      setConfirmandoEspecie(true);
      const detalhes = await buscarDetalhesPlanta(r.id, i18n.language);
      setConfirmandoEspecie(false);

      if (detalhes?.watering_days) {
        frequenciaRegaDias = detalhes.watering_days;
      } else {
        frequenciaRegaDias = 7;
        frequenciaEstimada = true;
      }
    }

    onSelecionar({
      especieId: r.id,
      especieNome: r.common_name,
      cientifico: r.scientific_name?.[0] || '',
      frequenciaRegaDias,
      frequenciaEstimada,
      foto: r.image_url,
    });
  }

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
          disabled={confirmandoEspecie}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-moss/30 bg-white outline-none focus:border-moss text-sm disabled:opacity-60"
        />
      </div>

      {confirmandoEspecie && (
        <p className="text-xs text-ink/50 mt-2 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Confirmando frequência de rega da espécie…
        </p>
      )}

      {buscando && !confirmandoEspecie && (
        <p className="text-xs text-ink/50 mt-2">Buscando…</p>
      )}

      {resultados.length > 0 && !confirmandoEspecie && (
        <ul className="mt-2 border border-black/10 rounded-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-black/5">
          {resultados.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => handleSelecionar(r)}
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
