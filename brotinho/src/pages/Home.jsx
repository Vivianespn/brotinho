import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import BuscaInput from '../components/BuscaInput';
import CardCatalogo from '../components/CardCatalogo';
import { listarCatalogo } from '../services/perenualApi';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [busca, setBusca] = useState('');
  const [destaques, setDestaques] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listarCatalogo(i18n.language).then(({ resultados }) =>
      setDestaques(resultados.slice(0, 3)),
    );
  }, [i18n.language]);

  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-3xl bg-sage px-6 sm:px-10 py-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest">
          {t('home.titulo')}
        </h1>
        <p className="text-ink/70 mt-2 max-w-lg mx-auto">
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
