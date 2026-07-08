const CORES = {
  bem: 'bg-ok dark:bg-moss-light',
  atencao: 'bg-warn',
  critico: 'bg-critical',
};
const CORES_TEXTO = {
  bem: 'text-ok dark:text-sage',
  atencao: 'text-warn',
  critico: 'text-critical',
};

export default function BarraSaude({ saude, compacta = false }) {
  return (
    <div className={compacta ? 'flex items-center gap-2' : ''}>
      <div
        className={`${compacta ? 'flex-1' : 'w-full'} h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden`}
        role="progressbar"
        aria-valuenow={Math.round(saude.percentual)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Saúde da planta: ${saude.label}`}
      >
        <div
          className={`h-full ${CORES[saude.estado]} transition-all duration-500`}
          style={{ width: `${saude.percentual}%` }}
        />
      </div>
      <span
        className={`text-xs font-semibold ${CORES_TEXTO[saude.estado]} ${
          compacta ? 'shrink-0' : 'mt-1 inline-block'
        }`}
      >
        {saude.label}
      </span>
    </div>
  );
}
