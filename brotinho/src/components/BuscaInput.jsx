import { Search } from 'lucide-react';

export default function BuscaInput({ valor, onChange, onSubmit, placeholder }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(valor);
      }}
      className="flex gap-2 w-full"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
        <input
          type="search"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            placeholder || 'Buscar planta pelo nome (ex: jiboia, cacto...)'
          }
          className="w-full pl-9 pr-3 py-2.5 rounded-full border border-moss/30 bg-white dark:bg-forest-light dark:border-moss/50 dark:text-cream focus:border-moss outline-none text-sm"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors shrink-0"
      >
        Buscar
      </button>
    </form>
  );
}
