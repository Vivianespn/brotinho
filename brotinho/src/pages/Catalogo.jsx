import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BuscaInput from '../components/BuscaInput';
import CardCatalogo from '../components/CardCatalogo';
import EstadoVazio from '../components/EstadoVazio';
import { buscarPlantas, listarCatalogo } from '../services/perenualApi';

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryInicial = searchParams.get('q') || '';
  const [busca, setBusca] = useState(queryInicial);
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [buscou, setBuscou] = useState(Boolean(queryInicial));

  useEffect(() => {
    setCarregando(true);
    const carregar = queryInicial
      ? buscarPlantas(queryInicial)
      : listarCatalogo();
    carregar.then(({ resultados }) => {
      setResultados(resultados);
      setCarregando(false);
    });
  }, [queryInicial]);

  function handleSubmit(termo) {
    setBuscou(Boolean(termo.trim()));
    setSearchParams(termo.trim() ? { q: termo.trim() } : {});
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-1">Catálogo</h1>
        <p className="text-sm text-ink/60 mb-4">
          Busque qualquer espécie e veja a ficha completa de cuidados.
        </p>
        <BuscaInput valor={busca} onChange={setBusca} onSubmit={handleSubmit} />
      </div>

      {carregando ? (
        <p className="text-center text-sm text-ink/50 py-12">
          Carregando plantas…
        </p>
      ) : resultados.length === 0 ? (
        <EstadoVazio
          titulo="Nenhuma planta encontrada"
          descricao={
            buscou
              ? 'Tente buscar por outro nome popular ou científico.'
              : 'Não foi possível carregar o catálogo agora.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((planta) => (
            <CardCatalogo key={planta.id} planta={planta} />
          ))}
        </div>
      )}
    </div>
  );
}
