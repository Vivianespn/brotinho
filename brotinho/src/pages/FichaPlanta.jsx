import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sun,
  Droplet,
  Thermometer,
  AlertTriangle,
} from 'lucide-react';
import FotoPlanta from '../components/FotoPlanta';
import EstadoVazio from '../components/EstadoVazio';
import { buscarDetalhesPlanta, listarCatalogo } from '../services/perenualApi';

const NIVEIS_DIFICULDADE = { Fácil: 2, Moderada: 3, Difícil: 5 };

export default function FichaPlanta() {
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    buscarDetalhesPlanta(id).then((dados) => {
      setPlanta(dados);
      setCarregando(false);
    });
    listarCatalogo().then(({ resultados }) =>
      setRelacionadas(resultados.filter((p) => p.id !== id).slice(0, 3)),
    );
  }, [id]);

  if (carregando) {
    return (
      <p className="text-center text-sm text-ink/50 py-12">Carregando ficha…</p>
    );
  }

  if (!planta) {
    return (
      <EstadoVazio
        titulo="Planta não encontrada"
        descricao="Essa espécie não foi localizada no catálogo."
        acao={
          <Link
            to="/catalogo"
            className="text-moss font-medium hover:underline text-sm"
          >
            Voltar ao catálogo
          </Link>
        }
      />
    );
  }

  const nivelDificuldade = NIVEIS_DIFICULDADE[planta.difficulty] || 3;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-moss font-medium hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <FotoPlanta
        src={planta.image_url}
        alt={planta.common_name}
        className="w-full h-64 object-cover rounded-2xl"
      />
      <div className="hidden w-full h-64 rounded-2xl bg-sage" />

      <div>
        <h1 className="font-display text-2xl font-semibold">
          {planta.common_name}
        </h1>
        {planta.scientific_name?.[0] && (
          <p className="text-sm italic text-ink/50">
            {planta.scientific_name[0]}
          </p>
        )}
      </div>

      <h2 className="font-display text-lg font-medium border-b border-black/10 pb-2">
        Cuidados
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-black/10 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-1">
            <Sun className="w-3.5 h-3.5" /> Luminosidade
          </div>
          <p className="font-medium capitalize">
            {planta.sunlight?.join(', ')}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-1">
            <Droplet className="w-3.5 h-3.5" /> Frequência de rega
          </div>
          <p className="font-medium">a cada {planta.watering_days} dias</p>
        </div>
        <div className="rounded-xl border border-black/10 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-1">
            <Thermometer className="w-3.5 h-3.5" /> Temperatura
          </div>
          <p className="font-medium">{planta.temperature}</p>
        </div>
        <div
          className={`rounded-xl border p-3 ${planta.toxicity === 'Tóxica para pets' ? 'border-critical/40 bg-critical-bg' : 'border-black/10'}`}
        >
          <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Toxicidade
          </div>
          <p
            className={`font-medium ${planta.toxicity === 'Tóxica para pets' ? 'text-critical' : ''}`}
          >
            {planta.toxicity}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-ink/50 mb-2">
          Dificuldade: <span className="font-medium">{planta.difficulty}</span>
        </p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`w-6 h-2.5 rounded-full ${i < nivelDificuldade ? 'bg-moss' : 'bg-black/10'}`}
            />
          ))}
        </div>
      </div>

      {relacionadas.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-medium border-b border-black/10 pb-2 mb-3">
            Plantas relacionadas
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {relacionadas.map((r) => (
              <Link
                key={r.id}
                to={`/catalogo/planta/${r.id}`}
                className="shrink-0 w-32 rounded-xl border border-black/10 p-2 text-center hover:border-moss transition-colors"
              >
                <FotoPlanta
                  src={r.image_url}
                  alt={r.common_name}
                  className="w-full h-16 object-cover rounded-lg mb-1"
                />
                <div className="hidden w-full h-16 rounded-lg bg-sage mb-1" />
                <p className="text-xs font-medium truncate">{r.common_name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
