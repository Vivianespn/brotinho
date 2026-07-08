import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Droplet, Trash2 } from 'lucide-react';
import { usePlants } from '../context/PlantsContext';
import FotoPlanta from '../components/FotoPlanta';
import BarraSaude from '../components/BarraSaude';
import EstadoVazio from '../components/EstadoVazio';
import { formatarUltimaRega } from '../utils/tempo';
import { calcularSaude } from '../utils/saude';

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MinhaPlantaDetalhes() {
  const { id } = useParams();
  const { obterPlanta, registrarRega, adicionarAnotacao, removerAnotacao } =
    usePlants();
  const planta = obterPlanta(id);
  const [texto, setTexto] = useState('');

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

  const saude = calcularSaude(planta.ultimaRega, planta.frequenciaRegaDias);

  function handleAnotar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    adicionarAnotacao(id, texto.trim());
    setTexto('');
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

      <div className="rounded-2xl border border-black/10 p-4">
        <BarraSaude saude={saude} />
        <button
          onClick={() => registrarRega(id)}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors"
        >
          <Droplet className="w-4 h-4" /> Reguei agora
        </button>
      </div>

      <div>
        <h2 className="font-display text-lg font-medium border-b border-black/10 pb-2 mb-3">
          Diário da planta
        </h2>

        <form onSubmit={handleAnotar} className="flex gap-2 mb-4">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva uma anotação (ex: apareceu uma folha nova!)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-moss/30 bg-white outline-none focus:border-moss text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors shrink-0"
          >
            Adicionar
          </button>
        </form>

        {planta.diario.length === 0 ? (
          <p className="text-sm text-ink/50">
            Nenhuma anotação ainda. Registre o que observar na sua planta.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {planta.diario.map((nota) => (
              <li
                key={nota.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-sage p-3"
              >
                <div>
                  <p className="text-sm">{nota.texto}</p>
                  <p className="text-xs text-ink/50 mt-1">
                    {formatarData(nota.data)}
                  </p>
                </div>
                <button
                  onClick={() => removerAnotacao(id, nota.id)}
                  aria-label="Excluir anotação"
                  className="p-1.5 rounded-full hover:bg-black/5 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-critical" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
