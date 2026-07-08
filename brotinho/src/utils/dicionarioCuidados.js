// Dicionário para valores de "enum" que a Perenual devolve sempre em inglês.
// Nomes de espécie são texto livre (traduzimos via API em traduzirTexto.js),
// mas luminosidade e dificuldade vêm de um conjunto pequeno e fixo de termos,
// então um dicionário é mais confiável do que tradução automática aqui.

const SUNLIGHT_EN_PT = {
  'full sun': 'sol pleno',
  'part sun': 'sol parcial',
  'part shade': 'sombra parcial',
  'partial shade': 'sombra parcial',
  'filtered shade': 'sombra filtrada',
  'filtered sun': 'sol filtrado',
  'filtered light': 'luz filtrada',
  'indirect light': 'luz indireta',
  'full shade': 'sombra total',
  'deep shade': 'sombra profunda',
};

const SUNLIGHT_PT_EN = Object.fromEntries(
  Object.entries(SUNLIGHT_EN_PT).map(([en, pt]) => [pt, en]),
);

const DIFICULDADE_EN_PT = {
  easy: 'Fácil',
  moderate: 'Moderada',
  difficult: 'Difícil',
};

const DIFICULDADE_PT_EN = {
  Fácil: 'Easy',
  Moderada: 'Moderate',
  Difícil: 'Difficult',
};

export function traduzirSunlight(lista, idioma) {
  if (!Array.isArray(lista)) return [];
  if (idioma === 'en') {
    return lista.map((termo) => SUNLIGHT_PT_EN[termo.toLowerCase()] || termo);
  }
  return lista.map((termo) => SUNLIGHT_EN_PT[termo.toLowerCase()] || termo);
}

export function traduzirDificuldade(valor, idioma) {
  if (!valor) return idioma === 'en' ? 'Moderate' : 'Moderada';
  if (idioma === 'en') {
    return DIFICULDADE_PT_EN[valor] || valor;
  }
  return DIFICULDADE_EN_PT[valor.toLowerCase()] || valor;
}
