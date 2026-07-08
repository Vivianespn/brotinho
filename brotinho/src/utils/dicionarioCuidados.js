// Dicionário para valores de "enum" que a Perenual devolve sempre em inglês.
// Nomes de espécie são texto livre (traduzimos via API em traduzirTexto.js),
// mas luminosidade e nível de cuidado vêm de um conjunto pequeno e fixo de
// termos, então um dicionário é mais confiável do que tradução automática aqui.

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

// A Perenual não tem um campo "difficulty" — o campo real chama-se
// "care_level" e vem como Low/Medium/High. Mapeamos isso pro nosso conceito
// de dificuldade.
const CARE_LEVEL_PT = {
  low: 'Fácil',
  medium: 'Moderada',
  moderate: 'Moderada',
  high: 'Difícil',
};
const CARE_LEVEL_EN = {
  low: 'Easy',
  medium: 'Moderate',
  moderate: 'Moderate',
  high: 'Difficult',
};

export function traduzirSunlight(lista, idioma) {
  if (!Array.isArray(lista)) return [];
  if (idioma === 'en') {
    return lista.map((termo) => SUNLIGHT_PT_EN[termo.toLowerCase()] || termo);
  }
  return lista.map((termo) => SUNLIGHT_EN_PT[termo.toLowerCase()] || termo);
}

// Usado só para os dados MOCKADOS, que já guardam "Fácil/Moderada/Difícil"
// prontos em pt/en (não vêm de care_level).
export function traduzirDificuldade(valor, idioma) {
  if (!valor) return idioma === 'en' ? 'Moderate' : 'Moderada';
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
  if (idioma === 'en') return DIFICULDADE_PT_EN[valor] || valor;
  return DIFICULDADE_EN_PT[valor.toLowerCase()] || valor;
}

// Usado para dados REAIS da API, que vêm como care_level (Low/Medium/High).
export function mapearCareLevel(careLevel, idioma) {
  if (!careLevel) return null;
  const chave = careLevel.toLowerCase();
  if (idioma === 'en') return CARE_LEVEL_EN[chave] || careLevel;
  return CARE_LEVEL_PT[chave] || careLevel;
}
