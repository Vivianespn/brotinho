import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-forest dark:bg-forest-dark text-cream/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="font-display italic">{t('footer.tagline')}</p>
        <p>{t('footer.credito', { ano: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
