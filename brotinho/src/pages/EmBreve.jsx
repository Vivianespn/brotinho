import { useTranslation } from 'react-i18next';

export default function EmBreve({ titulo }) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20">
      <p className="text-sm text-ink/50">{t('emBreve.mensagem', { titulo })}</p>
    </div>
  );
}
