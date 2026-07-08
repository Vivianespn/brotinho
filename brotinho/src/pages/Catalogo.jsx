import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BuscaInput from '../components/BuscaInput';
import CardCatalogo from '../components/CardCatalogo';
import EstadoVazio from '../components/EstadoVazio';
import { buscarPlantas, listarCatalogo } from '../services/perenualApi';

export default function Catalogo() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryInicial = searchParams.get('q') || '';
  const [busca, setBusca] = useState(queryInicial);
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [buscou, setBuscou] = useState(Boolean(queryInicial));

  useEffect(() => {
    setCarregando(true);
    const carregar = queryInicial
      ? buscarPlantas(queryInicial, i18n.language)
      : listarCatalogo(i18n.language);

    carregar.then(({ resultados }) => {
      setResultados(resultados);
      setCarregando(false);
    });
  }, [queryInicial, i18n.language]);

  function handleSubmit(termo) {
    setBuscou(Boolean(termo.trim()));
    setSearchParams(termo.trim() ? { q: termo.trim() } : {});
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-1">
          {t('catalogo.titulo')}
        </h1>
        <p className="text-sm text-ink/60 mb-4">{t('catalogo.subtitulo')}</p>
        <BuscaInput valor={busca} onChange={setBusca} onSubmit={handleSubmit} />
      </div>

      {carregando ? (
        <p className="text-center text-sm text-ink/50 py-12">
          {t('catalogo.carregando')}
        </p>
      ) : resultados.length === 0 ? (
        <EstadoVazio
          titulo={t('catalogo.vazioTitulo')}
          descricao={
            buscou ? t('catalogo.vazioComBusca') : t('catalogo.vazioSemBusca')
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
