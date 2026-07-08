// Traduz texto livre usando a MyMemory Translation API — gratuita, sem
// chave, mas com limite de uso diário. Por isso cacheamos cada tradução no
// localStorage: cada texto só é traduzido uma vez.

const CACHE_PREFIX = 'brotinho:traducao:';

async function traduzir(texto, langpair, prefixoCache) {
  if (!texto) return texto;

  const chave = `${CACHE_PREFIX}${prefixoCache}:${texto.toLowerCase()}`;
  try {
    const cacheado = localStorage.getItem(chave);
    if (cacheado) return cacheado;
  } catch {
    // segue sem cache se o localStorage não estiver disponível
  }

  try {
    const resp = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        texto,
      )}&langpair=${langpair}`,
    );
    if (!resp.ok) throw new Error('Falha na tradução');
    const json = await resp.json();
    const traduzido = json.responseData?.translatedText || texto;

    try {
      localStorage.setItem(chave, traduzido);
    } catch {
      // segue sem cache
    }
    return traduzido;
  } catch (erro) {
    console.warn('Tradução indisponível, mantendo texto original:', erro);
    return texto;
  }
}

// Usado para traduzir dados vindos da API (nomes de planta) pra exibir em PT.
export async function traduzirParaPt(textoEmIngles) {
  return traduzir(textoEmIngles, 'en|pt-BR', 'en-pt');
}

// Usado para traduzir o termo de busca do usuário antes de mandar pra
// Perenual, que só entende inglês.
export async function traduzirParaEn(textoEmPortugues) {
  return traduzir(textoEmPortugues, 'pt|en', 'pt-en');
}
