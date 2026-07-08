import { diasDesde } from './tempo';

// Calcula o estado de saúde de uma planta com base no tempo desde a última
// rega comparado com a frequência ideal da espécie (MUST-06).
export function calcularSaude(ultimaRegaISO, frequenciaDias) {
  const dias = diasDesde(ultimaRegaISO);
  const freq = frequenciaDias || 7;

  if (dias <= freq) {
    return {
      estado: 'bem',
      label: 'Bem',
      percentual: Math.max(15, 100 - (dias / freq) * 60),
    };
  }

  if (dias <= freq * 1.5) {
    return { estado: 'atencao', label: 'Atenção', percentual: 45 };
  }

  return { estado: 'critico', label: 'Crítico', percentual: 15 };
}

// Usado pro alerta visual de rega atrasada (MUST-07).
export function estaAtrasada(ultimaRegaISO, frequenciaDias) {
  const dias = diasDesde(ultimaRegaISO);
  return dias > (frequenciaDias || 7);
}
