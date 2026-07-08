import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import FotoPlanta from './FotoPlanta';

const LARGURA_MAXIMA = 800; // px — suficiente pra tela, bem mais leve que a foto original
const QUALIDADE_JPEG = 0.75;

// Redimensiona e comprime a imagem no navegador antes de virar base64,
// pra não estourar o limite do localStorage com fotos em alta resolução.
function comprimirImagem(arquivo) {
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
    leitor.readAsDataURL(arquivo);
  });
}

export default function SeletorFoto({ valor, onChange, label = 'Foto' }) {
  const inputRef = useRef(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      setErro('Escolha um arquivo de imagem (jpg, png, webp...).');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      const base64 = await comprimirImagem(arquivo);
      onChange(base64);
    } catch {
      setErro('Não foi possível processar essa imagem. Tente outra.');
    } finally {
      setCarregando(false);
      e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    }
  }

  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>

      {valor ? (
        <div className="flex items-center gap-3">
          <FotoPlanta
            src={valor}
            alt="Prévia da foto"
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm text-moss font-medium hover:underline text-left"
            >
              Trocar foto
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-sm text-critical hover:underline"
            >
              <X className="w-3.5 h-3.5" /> Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={carregando}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-moss/30 hover:border-moss py-6 text-moss transition-colors disabled:opacity-60"
        >
          <ImagePlus className="w-6 h-6" />
          <span className="text-sm font-medium">
            {carregando ? 'Processando…' : 'Escolher foto'}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleArquivo}
        className="hidden"
      />

      {erro && <p className="text-sm text-critical mt-1.5">{erro}</p>}
    </div>
  );
}
