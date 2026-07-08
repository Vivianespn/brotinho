import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Droplet } from 'lucide-react';
import { usePlants } from '../context/PlantsContext';
import FotoPlanta from '../components/FotoPlanta';
import EstadoVazio from '../components/EstadoVazio';
import { formatarUltimaRega } from '../utils/tempo';

export default function MinhaPlantaDetalhes() {
  const { id } = useParams();
  const { obterPlanta, registrarRega } = usePlants();
  const planta = obterPlanta(id);

  if (!planta) {
    return (
      <EstadoVazio
        titulo="Planta não encontrada"
        descricao="Ela pode já ter sido removida."
        acao={
          <Link
            to="/minhas-plantas"
            className="text-moss font-medium hover:underline text-sm"
          >
            Voltar para Minhas Plantas
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <Link
        to="/minhas-plantas"
        className="inline-flex items-center gap-1.5 text-sm text-moss font-medium hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="flex gap-4 items-start flex-wrap">
        <FotoPlanta
          src={planta.foto}
          alt={planta.apelido}
          className="w-24 h-24 rounded-2xl object-cover shrink-0"
        />
        <div className="hidden w-24 h-24 rounded-2xl bg-sage shrink-0" />

        <div className="flex-1 min-w-[12rem]">
          <h1 className="font-display text-2xl font-semibold">
            {planta.apelido}
          </h1>
          <p className="text-sm text-ink/50 italic">
            {planta.cientifico || planta.especieNome}
          </p>
          <p className="text-xs text-ink/50 mt-1">
            {formatarUltimaRega(planta.ultimaRega)} · rega a cada{' '}
            {planta.frequenciaRegaDias} dias
          </p>
        </div>

        <Link
          to={`/minhas-plantas/${id}/editar`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-moss/30 text-sm font-medium hover:bg-sage transition-colors shrink-0"
        >
          <Pencil className="w-4 h-4" /> Editar
        </Link>
      </div>

      <button
        onClick={() => registrarRega(id)}
        className="w-fit flex items-center gap-1.5 px-4 py-2 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors"
      >
        <Droplet className="w-4 h-4" /> Reguei agora
      </button>

      <p className="text-sm text-ink/50">
        📓 O diário de anotações chega na Semana 3, junto com a barra de saúde.
      </p>
    </div>
  );
}
