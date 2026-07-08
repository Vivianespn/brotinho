import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { usePlants } from '../context/PlantsContext';
import EstadoVazio from '../components/EstadoVazio';
import SeletorFoto from '../components/SeletorFoto';

export default function EditarPlanta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obterPlanta, editarPlanta, removerPlanta } = usePlants();
  const planta = obterPlanta(id);

  const [apelido, setApelido] = useState(planta?.apelido || '');
  const [foto, setFoto] = useState(planta?.foto || null);
  const [dataAquisicao, setDataAquisicao] = useState(
    planta?.dataAquisicao ? planta.dataAquisicao.slice(0, 10) : '',
  );
  const [frequencia, setFrequencia] = useState(planta?.frequenciaRegaDias || 7);
  const [erro, setErro] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!apelido.trim()) {
      setErro('Dê um apelido para a sua planta.');
      return;
    }
    editarPlanta(id, {
      apelido: apelido.trim(),
      foto: foto || null,
      dataAquisicao: dataAquisicao
        ? new Date(dataAquisicao).toISOString()
        : null,
      frequenciaRegaDias: Number(frequencia) || 7,
    });
    navigate(`/minhas-plantas/${id}`);
  }

  function handleExcluir() {
    removerPlanta(id);
    navigate('/minhas-plantas');
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <Link
        to={`/minhas-plantas/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-moss font-medium hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold">
          Editar {planta.apelido}
        </h1>
        <p className="text-sm text-ink/60 dark:text-cream/60 mt-1">
          Espécie: {planta.especieNome}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="apelido" className="text-sm font-medium block mb-1.5">
            Apelido
          </label>
          <input
            id="apelido"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-moss/30 bg-white dark:bg-forest-light dark:border-moss/50 dark:text-cream outline-none focus:border-moss text-sm"
          />
        </div>

        <div>
          <label htmlFor="data" className="text-sm font-medium block mb-1.5">
            Data de aquisição
          </label>
          <input
            id="data"
            type="date"
            value={dataAquisicao}
            onChange={(e) => setDataAquisicao(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-moss/30 bg-white dark:bg-forest-light dark:border-moss/50 dark:text-cream outline-none focus:border-moss text-sm"
          />
        </div>

        <SeletorFoto valor={foto} onChange={setFoto} />

        <div>
          <label htmlFor="freq" className="text-sm font-medium block mb-1.5">
            Frequência de rega (dias)
          </label>
          <input
            id="freq"
            type="number"
            min="1"
            value={frequencia}
            onChange={(e) => setFrequencia(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-moss/30 bg-white dark:bg-forest-light dark:border-moss/50 dark:text-cream outline-none focus:border-moss text-sm"
          />
        </div>

        {erro && <p className="text-sm text-critical">{erro}</p>}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors"
          >
            Salvar alterações
          </button>

          {!confirmandoExclusao ? (
            <button
              type="button"
              onClick={() => setConfirmandoExclusao(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-critical text-sm font-medium hover:bg-critical/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink/60 dark:text-cream/60">
                Tem certeza?
              </span>
              <button
                type="button"
                onClick={handleExcluir}
                className="text-critical font-semibold hover:underline"
              >
                Sim, excluir
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoExclusao(false)}
                className="text-ink/60 dark:text-cream/60 hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
