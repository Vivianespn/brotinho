import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Plus } from 'lucide-react';
import BuscaInput from '../components/BuscaInput';
import CardCatalogo from '../components/CardCatalogo';
import CardMinhaPlanta from '../components/CardMinhaPlanta';
import { usePlants } from '../context/PlantsContext';
import { listarCatalogo } from '../services/perenualApi';
import { estaAtrasada, calcularSaude } from '../utils/saude';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [busca, setBusca] = useState('');
  const [destaques, setDestaques] = useState([]);
  const navigate = useNavigate();
  const { plantas } = usePlants();

  useEffect(() => {
    listarCatalogo(i18n.language).then(({ resultados }) =>
      setDestaques(resultados.slice(0, 3)),
    );
  }, [i18n.language]);

  const precisamAtencao = plantas.filter((p) => {
    if (estaAtrasada(p.ultimaRega, p.frequenciaRegaDias)) return true;
    const saude = calcularSaude(p.ultimaRega, p.frequenciaRegaDias);
    return saude.estado !== 'bem';
  });

  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-3xl bg-sage dark:bg-forest-light px-6 sm:px-10 py-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest dark:text-cream">
          {t('home.titulo')}
        </h1>
        <p className="text-ink/70 dark:text-cream/70 mt-2 max-w-lg mx-auto">
          {t('home.subtitulo')}
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <BuscaInput
            valor={busca}
            onChange={setBusca}
            onSubmit={(q) =>
              q.trim() && navigate(`/catalogo?q=${encodeURIComponent(q)}`)
            }
          />
        </div>
      </section>

      {precisamAtencao.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-medium mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-critical inline-block" />
            Precisam de atenção
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {precisamAtencao.map((p) => (
              <CardMinhaPlanta key={p.id} planta={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-medium">Minhas plantas</h2>
          <Link
            to="/minhas-plantas"
            className="text-sm text-moss font-medium flex items-center gap-1 hover:underline"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {plantas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-moss/30 p-8 text-center">
            <p className="text-sm text-ink/60 dark:text-cream/60 mb-3">
              Você ainda não cadastrou nenhuma planta.
            </p>
            <Link
              to="/minhas-plantas/nova"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark"
            >
              <Plus className="w-4 h-4" /> Cadastrar planta
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plantas.slice(0, 3).map((p) => (
              <CardMinhaPlanta key={p.id} planta={p} />
            ))}
            <Link
              to="/minhas-plantas/nova"
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-moss/30 hover:border-moss text-moss transition-colors min-h-[10rem]"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Adicionar</span>
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-medium">
            {t('home.explorarCatalogo')}
          </h2>
          <Link
            to="/catalogo"
            className="text-sm text-moss font-medium flex items-center gap-1 hover:underline"
          >
            {t('home.verCatalogo')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((planta) => (
            <CardCatalogo key={planta.id} planta={planta} />
          ))}
        </div>
      </section>
    </div>
  );
}
