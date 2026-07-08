import plantasMock from '../data/plantasMock.json';

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

function normalizarEspecie(item) {
  const diasRegaPorFrequencia = {
    Frequent: 3,
    Average: 7,
    Minimum: 14,
    None: 30,
  };
  return {
    id: String(item.id),
    common_name: item.common_name || 'Planta sem nome popular',
    scientific_name: item.scientific_name || [],
    image_url: item.default_image?.regular_url || item.image_url || null,
    sunlight: item.sunlight || ['indireta'],
    watering: item.watering || 'Média',
    watering_days:
      item.watering_days || diasRegaPorFrequencia[item.watering] || 7,
    difficulty: item.difficulty || 'Moderada',
    toxicity:
      item.poisonous_to_pets || item.toxicity === 'Tóxica para pets'
        ? 'Tóxica para pets'
        : 'Não tóxica',
    temperature: item.temperature || '15°C - 30°C',
  };
}

function filtrarMock(query) {
  const termo = query.trim().toLowerCase();
  if (!termo) return plantasMock;
  return plantasMock.filter(
    (p) =>
      p.common_name.toLowerCase().includes(termo) ||
      p.scientific_name.some((n) => n.toLowerCase().includes(termo)),
  );
}

export async function buscarPlantas(query) {
  if (!API_KEY) {
    return {
      resultados: filtrarMock(query).map(normalizarEspecie),
      fonte: 'mock',
    };
  }
  const chaveCache = `busca:${query.toLowerCase()}`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return { resultados: cacheado, fonte: 'cache' };

  try {
    const resp = await fetch(
      `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(query)}`,
    );
    if (!resp.ok) throw new Error('Falha na API Perenual');
    const json = await resp.json();
    const resultados = (json.data || []).map(normalizarEspecie);
    salvarCache(chaveCache, resultados);
    return { resultados, fonte: 'api' };
  } catch (erro) {
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return {
      resultados: filtrarMock(query).map(normalizarEspecie),
      fonte: 'mock',
    };
  }
}

export async function buscarDetalhesPlanta(id) {
  const mockEncontrado = plantasMock.find((p) => p.id === id);
  if (!API_KEY) {
    return mockEncontrado ? normalizarEspecie(mockEncontrado) : null;
  }
  const chaveCache = `detalhes:${id}`;
  const cacheado = lerCache(chaveCache);
  if (cacheado) return cacheado;

  try {
    const resp = await fetch(
      `${BASE_URL}/species/details/${id}?key=${API_KEY}`,
    );
    if (!resp.ok) throw new Error('Falha na API Perenual');
    const json = await resp.json();
    const normalizado = normalizarEspecie(json);
    salvarCache(chaveCache, normalizado);
    return normalizado;
  } catch (erro) {
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return mockEncontrado ? normalizarEspecie(mockEncontrado) : null;
  }
}

export async function listarCatalogo() {
  if (!API_KEY) {
    return { resultados: plantasMock.map(normalizarEspecie), fonte: 'mock' };
  }
  const chaveCache = 'catalogo:pagina1';
  const cacheado = lerCache(chaveCache);
  if (cacheado) return { resultados: cacheado, fonte: 'cache' };

  try {
    const resp = await fetch(`${BASE_URL}/species-list?key=${API_KEY}&page=1`);
    if (!resp.ok) throw new Error('Falha na API Perenual');
    const json = await resp.json();
    const resultados = (json.data || []).map(normalizarEspecie);
    salvarCache(chaveCache, resultados);
    return { resultados, fonte: 'api' };
  } catch (erro) {
    console.warn('Perenual API indisponível, usando dados locais:', erro);
    return { resultados: plantasMock.map(normalizarEspecie), fonte: 'mock' };
  }
}
