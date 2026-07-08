import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sun, Droplet, AlertTriangle, Clock } from 'lucide-react';
import FotoPlanta from '../components/FotoPlanta';
import EstadoVazio from '../components/EstadoVazio';
import { buscarDetalhesPlanta, listarCatalogo } from '../services/perenualApi';

const NIVEIS_DIFICULDADE = {
  Fácil: 2,
  Moderada: 3,
  Difícil: 5,
  Easy: 2,
  Moderate: 3,
  Difficult: 5,
};

export default function FichaPlanta() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    buscarDetalhesPlanta(id, i18n.language).then((dados) => {
      setPlanta(dados);
      setCarregando(false);
    });
    listarCatalogo(i18n.language).then(({ resultados }) =>
      setRelacionadas(resultados.filter((p) => p.id !== id).slice(0, 3)),
    );
  }, [id, i18n.language]);

  if (carregando) {
    return (
      <p className="text-center text-sm text-ink/50 dark:text-cream/50 py-12">
        {t('ficha.carregando')}
      </p>
    );
  }

  if (!planta || planta.limiteExcedido) {
    return (
      <EstadoVazio
        titulo={
          planta?.limiteExcedido
            ? 'Limite diário da API atingido'
            : t('ficha.naoEncontradaTitulo')
        }
        descricao={
          planta?.limiteExcedido
            ? 'A Perenual libera 100 consultas por dia no plano gratuito, e o limite de hoje já foi usado. Tente de novo amanhã, ou use uma das 10 plantas do catálogo local enquanto isso.'
            : t('ficha.naoEncontradaDesc')
        }
        acao={
          <Link
            to="/catalogo"
            className="text-moss font-medium hover:underline text-sm"
          >
            {t('ficha.voltarCatalogo')}
          </Link>
        }
      />
    );
  }

  const naoInformado =
    i18n.language === 'en' ? 'Not available' : 'Não informado';
  const nivelDificuldade = NIVEIS_DIFICULDADE[planta.difficulty] || 0;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-moss font-medium hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> {t('ficha.voltar')}
      </Link>

      {planta.fonte === 'limite' && (
        <div className="flex items-start gap-2 rounded-xl bg-warn-bg text-ink text-sm p-3">
          <Clock className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Limite diário da Perenual atingido — mostrando um dado equivalente
            do catálogo local em vez do real.
          </span>
        </div>
      )}

      <FotoPlanta
        src={planta.image_url}
        alt={planta.common_name}
        className="w-full h-64 object-cover rounded-2xl"
      />
      <div className="hidden w-full h-64 rounded-2xl bg-sage dark:bg-forest-light" />

      <div>
        <h1 className="font-display text-2xl font-semibold">
          {planta.common_name}
        </h1>
        {planta.scientific_name?.[0] && (
          <p className="text-sm italic text-ink/50 dark:text-cream/50">
            {planta.scientific_name[0]}
          </p>
        )}
      </div>

      <h2 className="font-display text-lg font-medium border-b border-black/10 dark:border-white/10 pb-2">
        {t('ficha.cuidados')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-cream/50 mb-1">
            <Sun className="w-3.5 h-3.5" /> {t('ficha.luminosidade')}
          </div>
          <p className="font-medium capitalize">
            {planta.sunlight?.join(', ') || naoInformado}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-cream/50 mb-1">
            <Droplet className="w-3.5 h-3.5" /> {t('ficha.frequenciaRega')}
          </div>
          <p className="font-medium">
            {planta.watering_days
              ? t('ficha.aCadaDias', { dias: planta.watering_days })
              : naoInformado}
          </p>
        </div>
        <div
          className={`rounded-xl border p-3 ${
            planta.toxic
              ? 'border-critical/40 bg-critical-bg'
              : 'border-black/10 dark:border-white/10'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-cream/50 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {t('ficha.toxicidade')}
          </div>
          <p className={`font-medium ${planta.toxic ? 'text-critical' : ''}`}>
            {planta.toxic === null || planta.toxic === undefined
              ? naoInformado
              : planta.toxic
                ? t('ficha.toxica')
                : t('ficha.naoToxica')}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-3">
          <div className="text-xs text-ink/50 dark:text-cream/50 mb-1">
            {t('ficha.dificuldade')}
          </div>
          <p className="font-medium">{planta.difficulty || naoInformado}</p>
        </div>
      </div>

      {nivelDificuldade > 0 && (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`w-6 h-2.5 rounded-full ${
                i < nivelDificuldade
                  ? 'bg-moss'
                  : 'bg-black/10 dark:bg-white/10'
              }`}
            />
          ))}
        </div>
      )}

      {relacionadas.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-medium border-b border-black/10 dark:border-white/10 pb-2 mb-3">
            {t('ficha.plantasRelacionadas')}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {relacionadas.map((r) => (
              <Link
                key={r.id}
                to={`/catalogo/planta/${r.id}`}
                className="shrink-0 w-32 rounded-xl border border-black/10 dark:border-white/10 p-2 text-center hover:border-moss transition-colors"
              >
                <FotoPlanta
                  src={r.image_url}
                  alt={r.common_name}
                  className="w-full h-16 object-cover rounded-lg mb-1"
                />
                <div className="hidden w-full h-16 rounded-lg bg-sage dark:bg-forest-light mb-1" />
                <p className="text-xs font-medium truncate">{r.common_name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
