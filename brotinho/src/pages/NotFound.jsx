import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
      <Sprout className="w-12 h-12 text-moss/50" />
      <h1 className="font-display text-3xl font-semibold">404</h1>
      <p className="text-ink/60">{t('notFound.subtitulo')}</p>
      <Link
        to="/"
        className="mt-3 px-5 py-2.5 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors"
      >
        {t('notFound.voltarHome')}
      </Link>
    </div>
  );
}
