export function diasDesde(dataISO) {
  if (!dataISO) return Infinity;
  const diffMs = new Date() - new Date(dataISO);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatarUltimaRega(ultimaRegaISO) {
  const dias = diasDesde(ultimaRegaISO);
  if (dias === Infinity) return 'Nunca regada';
  if (dias === 0) return 'Regada hoje';
  if (dias === 1) return 'Há 1 dia';
  return `Há ${dias} dias`;
}
