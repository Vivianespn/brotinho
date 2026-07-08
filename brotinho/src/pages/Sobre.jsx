import { Sprout } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <Sprout className="w-10 h-10 text-moss" />
      <h1 className="font-display text-2xl font-semibold">Sobre o Brotinho</h1>
      <p className="text-ink/70">
        O Brotinho nasceu de um problema simples: quem cuida de plantas em casa
        não tem um lugar centralizado para consultar os cuidados de cada espécie
        e lembrar da rotina de rega.
      </p>
      <p className="text-sm text-ink/50 mt-2">
        Projeto desenvolvido para a disciplina de Desenvolvimento Web Frontend —
        UFRN/ECT, por Viviane Stephane Pinheiro Novo.
      </p>
    </div>
  );
}
