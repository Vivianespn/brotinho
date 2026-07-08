import { useTranslation } from 'react-i18next';
import { Sprout } from 'lucide-react';

export default function Sobre() {
  const { t } = useTranslation();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <Sprout className="w-10 h-10 text-moss" />
      <h1 className="font-display text-2xl font-semibold">
        {t('sobre.titulo')}
      </h1>
      <p className="text-ink/70 dark:text-cream/70">{t('sobre.paragrafo1')}</p>
      <p className="text-sm text-ink/50 dark:text-cream/50 mt-2">
        {t('sobre.creditos')}
      </p>
    </div>
  );
}
