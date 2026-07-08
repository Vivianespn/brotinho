import plantasMock from '../data/plantasMock.json';
import { traduzirParaPt, traduzirParaEn } from './traduzirTexto';
import {
  traduzirSunlight,
  traduzirDificuldade,
} from '../utils/dicionarioCuidados';

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

const DIAS_REGA_POR_FREQUENCIA = {
  Frequent: 3,
  Average: 7,
  Minimum: 14,
  None: 30,
};

// Dados mockados já vêm em pt/en prontos — não precisa de tradução automática.
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
  };
}

// Dados reais da Perenual vêm sempre em inglês. Se o idioma pedido for
// português, traduzimos o nome (texto livre) e usamos o dicionário para
// luminosidade/dificuldade (valores fixos, mais confiável que tradução automática).
async function normalizarEspecieApi(item, idioma) {
  const nomeOriginal = item.common_name || 'Unnamed plant';
  const sunlightOriginal = item.sunlight || ['indirect light'];
  const dificuldadeOriginal = item.difficulty || 'Moderate';

  const common_name =
    idioma === 'pt' ? await traduzirParaPt(nomeOriginal) : nomeOriginal;

  return {
    id: String(item.id),
    common_name,
    scientific_name: item.scientific_name || [],
    image_url: item.default_image?.regular_url || item.image_url || null,
    sunlight: traduzirSunlight(sunlightOriginal, idioma),
    watering: item.watering || 'Average',
    watering_days:
      item.watering_days || DIAS_REGA_POR_FREQUENCIA[item.watering] || 7,
    difficulty: traduzirDificuldade(dificuldadeOriginal, idioma),
    toxic: Boolean(item.poisonous_to_pets ?? item.toxic ?? false),
    temperature: item.temperature || '15°C - 30°C',
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

export async function buscarPlantas(query, idioma = 'pt') {
  if (!API_KEY) {
    // O mock já tem pt/en, então busca funciona nos dois idiomas sem tradução.
    return {
      resultados: filtrarMock(query).map((p) =>
        normalizarEspecieMock(p, idioma),
      ),
      fonte: 'mock',
    };
  }

  // A Perenual só entende inglês — se a interface está em PT, traduz o termo
  // de busca antes de consultar, senão "cacto rosa" nunca encontraria nada.
  const queryParaApi = idioma === 'pt' ? await traduzirParaEn(query) : query;

  const chaveCache = `busca:${idioma}:${queryParaApi.toLowerCase()}`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return { resultados: cacheado, fonte: 'cache' };

  try {
    const resp = await fetch(
      `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(queryParaApi)}`,
    );
    if (!resp.ok) throw new Error('Falha na API Perenual');
    const json = await resp.json();
    const resultados = await Promise.all(
      (json.data || []).map((item) => normalizarEspecieApi(item, idioma)),
    );
    salvarCache(chaveCache, resultados);
    return { resultados, fonte: 'api' };
  } catch (erro) {
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return {
      resultados: filtrarMock(query).map((p) =>
        normalizarEspecieMock(p, idioma),
      ),
      fonte: 'mock',
    };
  }
}

export async function buscarDetalhesPlanta(id, idioma = 'pt') {
  const mockEncontrado = plantasMock.find((p) => p.id === id);
  if (!API_KEY) {
    return mockEncontrado
      ? normalizarEspecieMock(mockEncontrado, idioma)
      : null;
  }

  const chaveCache = `detalhes:${idioma}:${id}`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return cacheado;

  try {
    const resp = await fetch(
      `${BASE_URL}/species/details/${id}?key=${API_KEY}`,
    );
    if (!resp.ok) throw new Error('Falha na API Perenual');
    const json = await resp.json();
    const normalizado = await normalizarEspecieApi(json, idioma);
    salvarCache(chaveCache, normalizado);
    return normalizado;
  } catch (erro) {
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return mockEncontrado
      ? normalizarEspecieMock(mockEncontrado, idioma)
      : null;
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
    const resp = await fetch(`${BASE_URL}/species-list?key=${API_KEY}&page=1`);
    if (!resp.ok) throw new Error('Falha na API Perenual');
    const json = await resp.json();
    const resultados = await Promise.all(
      (json.data || []).map((item) => normalizarEspecieApi(item, idioma)),
    );
    salvarCache(chaveCache, resultados);
    return { resultados, fonte: 'api' };
  } catch (erro) {
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return {
      resultados: plantasMock.map((p) => normalizarEspecieMock(p, idioma)),
      fonte: 'mock',
    };
  }
}
