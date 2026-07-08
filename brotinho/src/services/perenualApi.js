import plantasMock from '../data/plantasMock.json';
import { traduzirParaPt, traduzirParaEn } from './traduzirTexto';
import { traduzirSunlight, mapearCareLevel } from '../utils/dicionarioCuidados';

const BASE_URL = 'https://perenual.com/api';
const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY;
const CACHE_PREFIX = 'brotinho:cache:';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12h, para não estourar as 100 req/dia

function lerCache(chave) {
  try {
    const bruto = localStorage.getItem(CACHE_PREFIX + chave);
    if (!bruto) return null;
    const { timestamp, dados } = JSON.parse(bruto);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return dados;
  } catch {
    return null;
  }
}

function salvarCache(chave, dados) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + chave,
      JSON.stringify({ timestamp: Date.now(), dados }),
    );
  } catch {
    // localStorage cheio ou indisponível — segue sem cache
  }
}

// Erro especial pra distinguir "limite diário estourado" de qualquer outra
// falha (rede fora do ar, chave inválida etc), já que a mensagem certa pro
// usuário é bem diferente em cada caso.
class LimiteApiExcedidoError extends Error {}

async function chamarApi(url) {
  const resp = await fetch(url);
  if (resp.status === 429) {
    throw new LimiteApiExcedidoError('Limite diário da API Perenual atingido');
  }
  if (!resp.ok) {
    throw new Error('Falha na API Perenual');
  }
  return resp.json();
}

const DIAS_REGA_POR_FREQUENCIA = {
  Frequent: 3,
  Average: 7,
  Minimum: 14,
  None: 30,
};

function calcularDiasRega(item) {
  const benchmark = item.watering_general_benchmark;
  if (benchmark?.value) {
    const numeros = String(benchmark.value).match(/\d+/g);
    if (numeros) {
      const media =
        numeros.reduce((soma, n) => soma + Number(n), 0) / numeros.length;
      const unidade = (benchmark.unit || 'days').toLowerCase();
      return Math.round(unidade.includes('week') ? media * 7 : media);
    }
  }
  return DIAS_REGA_POR_FREQUENCIA[item.watering] || 7;
}

function normalizarEspecieMock(item, idioma) {
  return {
    id: item.id,
    common_name: item.common_name[idioma] || item.common_name.pt,
    scientific_name: item.scientific_name,
    image_url: item.image_url,
    sunlight: item.sunlight[idioma] || item.sunlight.pt,
    watering: item.watering[idioma] || item.watering.pt,
    watering_days: item.watering_days,
    difficulty: item.difficulty[idioma] || item.difficulty.pt,
    toxic: item.toxic,
    temperature: item.temperature,
    dadosCompletos: true,
  };
}

async function normalizarEspecieApi(item, idioma) {
  const nomeOriginal = item.common_name || 'Unnamed plant';
  const common_name =
    idioma === 'pt' ? await traduzirParaPt(nomeOriginal) : nomeOriginal;
  const base = {
    id: String(item.id),
    common_name,
    scientific_name: item.scientific_name || [],
    image_url: item.default_image?.regular_url || item.image_url || null,
  };

  const temDetalhes =
    'sunlight' in item || 'watering_general_benchmark' in item;
  if (!temDetalhes) {
    return {
      ...base,
      sunlight: null,
      watering_days: null,
      difficulty: null,
      toxic: null,
      dadosCompletos: false,
    };
  }

  return {
    ...base,
    sunlight: traduzirSunlight(item.sunlight || ['indirect light'], idioma),
    watering_days: calcularDiasRega(item),
    difficulty: mapearCareLevel(item.care_level, idioma),
    toxic:
      item.poisonous_to_pets === undefined
        ? null
        : Boolean(item.poisonous_to_pets),
    dadosCompletos: true,
  };
}

function filtrarMock(query) {
  const termo = query.trim().toLowerCase();
  if (!termo) return plantasMock;
  return plantasMock.filter(
    (p) =>
      p.common_name.pt.toLowerCase().includes(termo) ||
      p.common_name.en.toLowerCase().includes(termo) ||
      p.scientific_name.some((n) => n.toLowerCase().includes(termo)),
  );
}

// "fonte" agora pode ser: 'api' (dado real), 'cache' (já buscado antes),
// 'mock' (sem chave configurada), ou 'limite' (chave configurada, mas
// bateu no limite diário — cai pro mock só como último recurso).
export async function buscarPlantas(query, idioma = 'pt') {
  if (!API_KEY) {
    return {
      resultados: filtrarMock(query).map((p) =>
        normalizarEspecieMock(p, idioma),
      ),
      fonte: 'mock',
    };
  }

  const queryParaApi = idioma === 'pt' ? await traduzirParaEn(query) : query;
  const chaveCache = `busca:${idioma}:${queryParaApi.toLowerCase()}`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return { resultados: cacheado, fonte: 'cache' };

  try {
    const json = await chamarApi(
      `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(queryParaApi)}`,
    );
    const resultados = await Promise.all(
      (json.data || []).map((item) => normalizarEspecieApi(item, idioma)),
    );
    salvarCache(chaveCache, resultados);
    return { resultados, fonte: 'api' };
  } catch (erro) {
    const fonte = erro instanceof LimiteApiExcedidoError ? 'limite' : 'mock';
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return {
      resultados: filtrarMock(query).map((p) =>
        normalizarEspecieMock(p, idioma),
      ),
      fonte,
    };
  }
}

export async function buscarDetalhesPlanta(id, idioma = 'pt') {
  const mockEncontrado = plantasMock.find((p) => p.id === id);
  if (!API_KEY) {
    return mockEncontrado
      ? { ...normalizarEspecieMock(mockEncontrado, idioma), fonte: 'mock' }
      : null;
  }

  const chaveCache = `detalhes:${idioma}:${id}`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return { ...cacheado, fonte: 'cache' };

  try {
    const json = await chamarApi(
      `${BASE_URL}/species/details/${id}?key=${API_KEY}`,
    );
    const normalizado = await normalizarEspecieApi(json, idioma);
    salvarCache(chaveCache, normalizado);
    return { ...normalizado, fonte: 'api' };
  } catch (erro) {
    const fonte = erro instanceof LimiteApiExcedidoError ? 'limite' : 'mock';
    console.warn('Perenual API indisponível:', erro);
    return mockEncontrado
      ? { ...normalizarEspecieMock(mockEncontrado, idioma), fonte }
      : { limiteExcedido: fonte === 'limite' };
  }
}

export async function listarCatalogo(idioma = 'pt') {
  if (!API_KEY) {
    return {
      resultados: plantasMock.map((p) => normalizarEspecieMock(p, idioma)),
      fonte: 'mock',
    };
  }

  const chaveCache = `catalogo:${idioma}:pagina1`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return { resultados: cacheado, fonte: 'cache' };

  try {
    const json = await chamarApi(
      `${BASE_URL}/species-list?key=${API_KEY}&page=1`,
    );
    const resultados = await Promise.all(
      (json.data || []).map((item) => normalizarEspecieApi(item, idioma)),
    );
    salvarCache(chaveCache, resultados);
    return { resultados, fonte: 'api' };
  } catch (erro) {
    const fonte = erro instanceof LimiteApiExcedidoError ? 'limite' : 'mock';
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return {
      resultados: plantasMock.map((p) => normalizarEspecieMock(p, idioma)),
      fonte,
    };
  }
}
