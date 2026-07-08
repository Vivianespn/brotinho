import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Pencil, AlertTriangle } from 'lucide-react';
import FotoPlanta from './FotoPlanta';
import BarraSaude from './BarraSaude';
import { diasDesde, formatarUltimaRega } from '../utils/tempo';
import { calcularSaude, estaAtrasada } from '../utils/saude';
import { usePlants } from '../context/PlantsContext';

const BORDA = {
  bem: 'border-ok/40 dark:border-moss-light/50',
  atencao: 'border-warn/50',
  critico: 'border-critical/50',
};

export default function CardMinhaPlanta({ planta }) {
  const { registrarRega } = usePlants();
  const [gotinhas, setGotinhas] = useState([]);

  const saude = calcularSaude(planta.ultimaRega, planta.frequenciaRegaDias);
  const atrasada = estaAtrasada(planta.ultimaRega, planta.frequenciaRegaDias);
  const dias = diasDesde(planta.ultimaRega);

  function handleRegar() {
    registrarRega(planta.id);
    const id = Date.now();
    setGotinhas((g) => [...g, id]);
    setTimeout(() => setGotinhas((g) => g.filter((x) => x !== id)), 700);
  }

  return (
    <div
      className={`relative rounded-2xl border-2 ${BORDA[saude.estado]} bg-white dark:bg-forest-light p-4 flex flex-col gap-3 shadow-sm`}
    >
      {atrasada && (
        <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-critical text-white text-[11px] font-semibold px-2 py-1 rounded-full animate-pulse-badge shadow">
          <AlertTriangle className="w-3 h-3" />
          Atrasada · {dias}d
        </span>
      )}

      <div className="flex gap-3">
        <FotoPlanta
          src={planta.foto}
          alt={planta.apelido}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
        />
        <div className="hidden w-16 h-16 rounded-xl bg-sage dark:bg-forest shrink-0" />
        <div className="min-w-0">
          <p className="font-display font-medium text-ink dark:text-cream truncate">
            {planta.apelido}
          </p>
          <p className="text-xs text-ink/50 dark:text-cream/50 truncate">
            {planta.especieNome}
          </p>
          <p className="text-xs text-ink/50 dark:text-cream/50 mt-0.5">
            {formatarUltimaRega(planta.ultimaRega)}
          </p>
        </div>
      </div>

      <BarraSaude saude={saude} compacta />

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleRegar}
          className="relative overflow-visible flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-moss text-white text-xs font-medium hover:bg-moss-dark transition-colors"
        >
          <Droplet className="w-3.5 h-3.5" />
          Reguei agora
          {gotinhas.map((id) => (
            <span
              key={id}
              className="absolute left-1/2 -translate-x-1/2 -top-1 text-base animate-droplet pointer-events-none"
            >
              💧
            </span>
          ))}
        </button>
        <Link
          to={`/minhas-plantas/${planta.id}/editar`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-moss/30 text-ink dark:text-cream text-xs font-medium hover:bg-sage dark:hover:bg-forest transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </Link>
        <Link
          to={`/minhas-plantas/${planta.id}`}
          className="px-3 py-1.5 rounded-full border border-moss/30 text-ink dark:text-cream text-xs font-medium hover:bg-sage dark:hover:bg-forest transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
