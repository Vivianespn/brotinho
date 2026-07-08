import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePlants } from '../context/PlantsContext';
import CardMinhaPlanta from '../components/CardMinhaPlanta';
import EstadoVazio from '../components/EstadoVazio';

export default function MinhasPlantas() {
  const { plantas } = usePlants();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold">
          Minhas plantas ({plantas.length})
        </h1>
        <Link
          to="/minhas-plantas/nova"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova planta
        </Link>
      </div>

      {plantas.length === 0 ? (
        <EstadoVazio
          titulo="Você ainda não tem plantas cadastradas"
          descricao="Cadastre a primeira para começar a acompanhar a rega dela."
          acao={
            <Link
              to="/minhas-plantas/nova"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-moss text-white text-sm font-medium hover:bg-moss-dark"
            >
              <Plus className="w-4 h-4" /> Cadastrar planta
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plantas.map((p) => (
            <CardMinhaPlanta key={p.id} planta={p} />
          ))}
        </div>
      )}
    </div>
  );
}
