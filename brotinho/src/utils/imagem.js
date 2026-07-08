const LARGURA_MAXIMA = 800; // px — suficiente pra tela, bem mais leve que a foto original
const QUALIDADE_JPEG = 0.75;

// Redimensiona e comprime uma imagem (File de upload ou Blob baixado) antes
// de virar base64, pra não estourar o limite do localStorage.
export function comprimirImagem(origem) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo não é uma imagem válida.'));
      img.onload = () => {
        const escala = Math.min(1, LARGURA_MAXIMA / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', QUALIDADE_JPEG));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(origem);
  });
}

// O servidor de imagens da Perenual (Wasabi S3) não libera acesso direto via
// fetch do navegador (sem header CORS) — por isso passamos pelo images.weserv.nl,
// um proxy de imagens público e gratuito que adiciona esse header pra qualquer
// imagem, sem precisar de chave.
function montarUrlProxy(url) {
  const semProtocolo = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(semProtocolo)}`;
}

// Baixa uma imagem de uma URL externa (ex: link temporário assinado da
// Perenual) e converte pra base64 — assim ela não depende de um link que
// expira em 24h. Se o download falhar (proxy fora do ar, link já expirado
// etc), retorna null e a planta simplesmente fica sem foto.
export async function baixarImagemComoBase64(url) {
  if (!url) return null;
  try {
    const resp = await fetch(montarUrlProxy(url));
    if (!resp.ok) throw new Error('Falha ao baixar imagem via proxy');
    const blob = await resp.blob();
    return await comprimirImagem(blob);
  } catch (erro) {
    console.warn('Não foi possível baixar/converter a foto da espécie:', erro);
    return null;
  }
}
