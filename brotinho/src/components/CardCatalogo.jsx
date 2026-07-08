import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Droplet, AlertTriangle, Info } from 'lucide-react';
import FotoPlanta from './FotoPlanta';

export default function CardCatalogo({ planta }) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/catalogo/planta/${planta.id}`}
      className="flip-card block h-64 [perspective:1000px] group"
    >
      <div className="flip-card-inner relative w-full h-full rounded-2xl shadow-sm">
        {/* Frente */}
        <div className="flip-card-front absolute inset-0 rounded-2xl overflow-hidden bg-white dark:bg-forest-light border border-black/5 dark:border-white/10 flex flex-col">
          <FotoPlanta
            src={planta.image_url}
            alt={planta.common_name}
            className="w-full h-36 object-cover"
          />
          <div className="hidden w-full h-36 items-center justify-center bg-sage dark:bg-forest">
            <span className="text-xs text-moss">sem foto</span>
          </div>
          <div className="p-3 flex-1 flex flex-col justify-center">
            <p className="font-display font-medium text-ink dark:text-cream leading-snug">
              {planta.common_name}
            </p>
            {planta.scientific_name?.[0] && (
              <p className="text-xs italic text-ink/50 dark:text-cream/50">
                {planta.scientific_name[0]}
              </p>
            )}
          </div>
        </div>

        {/* Verso — resumo de cuidados (NICE-02) */}
        <div className="flip-card-back absolute inset-0 rounded-2xl bg-forest text-cream p-4 flex flex-col justify-center gap-3">
          <p className="font-display font-medium mb-1">{planta.common_name}</p>

          {planta.dadosCompletos === false ? (
            <div className="flex items-center gap-2 text-sm text-cream/70">
              <Info className="w-4 h-4" />
              <span>Toque para ver a ficha completa</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Sun className="w-4 h-4 text-warn" />
                <span>{planta.sunlight?.[0] || 'indireta'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Droplet className="w-4 h-4 text-moss-light" />
                <span>
                  {t('ficha.aCadaDias', { dias: planta.watering_days })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-critical" />
                <span>
                  {planta.toxic ? t('ficha.toxica') : t('ficha.naoToxica')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
