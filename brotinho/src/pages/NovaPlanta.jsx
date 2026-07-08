import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SeletorEspecie from '../components/SeletorEspecie';
import SeletorFoto from '../components/SeletorFoto';
import { usePlants } from '../context/PlantsContext';

export default function NovaPlanta() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { adicionarPlanta } = usePlants();

  const prefill = searchParams.get('especieId')
    ? {
        especieId: searchParams.get('especieId'),
        especieNome: searchParams.get('especieNome') || '',
        cientifico: searchParams.get('cientifico') || '',
        frequenciaRegaDias: Number(searchParams.get('freq')) || 7,
        foto: null,
      }
    : null;

  const [especie, setEspecie] = useState(prefill);
  const [apelido, setApelido] = useState('');
  const [dataAquisicao, setDataAquisicao] = useState('');
  const [foto, setFoto] = useState(null);
  const [erro, setErro] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!apelido.trim()) {
      setErro('Dê um apelido para a sua planta.');
      return;
    }
    if (!especie) {
      setErro('Selecione a espécie da sua planta.');
      return;
    }
    const id = adicionarPlanta({
      apelido: apelido.trim(),
      especieId: especie.especieId,
      especieNome: especie.especieNome,
      cientifico: especie.cientifico,
      frequenciaRegaDias: especie.frequenciaRegaDias,
      dataAquisicao: dataAquisicao
        ? new Date(dataAquisicao).toISOString()
        : null,
      foto: foto || especie.foto || null,
    });
    navigate(`/minhas-plantas/${id}`);
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <Link
        to="/minhas-plantas"
        className="inline-flex items-center gap-1.5 text-sm text-moss font-medium hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold">
          Cadastrar planta
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Dê um apelido e vincule à espécie certa para receber os cuidados
          corretos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Espécie</label>
          <SeletorEspecie
            especieSelecionada={especie}
            onSelecionar={setEspecie}
          />
        </div>

        <div>
          <label htmlFor="apelido" className="text-sm font-medium block mb-1.5">
            Apelido
          </label>
          <input
            id="apelido"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            placeholder="Ex: Jiboinha da sala"
            className="w-full px-3 py-2.5 rounded-xl border border-moss/30 bg-white outline-none focus:border-moss text-sm"
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
            className="w-full px-3 py-2.5 rounded-xl border border-moss/30 bg-white outline-none focus:border-moss text-sm"
          />
        </div>

        <SeletorFoto valor={foto} onChange={setFoto} />

        {erro && <p className="text-sm text-critical">{erro}</p>}

        <button
          type="submit"
          className="mt-2 px-5 py-2.5 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors"
        >
          Cadastrar planta
        </button>
      </form>
    </div>
  );
}
