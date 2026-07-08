import { Leaf } from 'lucide-react';

export default function EstadoVazio({ titulo, descricao, acao }) {
  return (
    <div className="text-center py-16 px-4">
      <Leaf className="w-10 h-10 mx-auto text-moss/50 dark:text-moss-light/50 mb-3" />
      <h3 className="font-display text-lg font-medium text-ink dark:text-cream">
        {titulo}
      </h3>
      {descricao && (
        <p className="text-sm text-ink/60 dark:text-cream/60 mt-1 max-w-sm mx-auto">
          {descricao}
        </p>
      )}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
