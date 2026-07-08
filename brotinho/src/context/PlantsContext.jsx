import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { baixarImagemComoBase64 } from '../utils/imagem';

const PlantsContext = createContext(null);
const STORAGE_KEY = 'brotinho:minhas-plantas';

function carregarDoStorage() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    return bruto ? JSON.parse(bruto) : [];
  } catch {
    return [];
  }
}

function salvarNoStorage(plantas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantas));
  } catch {
    // Se o localStorage estiver indisponível, os dados simplesmente
    // não persistem entre sessões — o app continua funcionando.
  }
}

export function PlantsProvider({ children }) {
  const [plantas, setPlantas] = useState(carregarDoStorage);

  useEffect(() => {
    salvarNoStorage(plantas);
  }, [plantas]);

  // Auto-reparo: plantas cadastradas antes dessa correção podem ter salvo o
  // link temporário da foto da espécie (que expira em ~24h). Ao carregar o
  // app, baixamos essas fotos e convertemos pra base64 permanente, uma vez.
  useEffect(() => {
    const comFotoExterna = carregarDoStorage().filter((p) =>
      p.foto?.startsWith('http'),
    );

    comFotoExterna.forEach((planta) => {
      baixarImagemComoBase64(planta.foto).then((base64) => {
        if (!base64) return; // link já expirado ou falha de rede — deixa como está
        setPlantas((atual) =>
          atual.map((p) => (p.id === planta.id ? { ...p, foto: base64 } : p)),
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // roda só uma vez, ao carregar o app

  const adicionarPlanta = useCallback((dados) => {
    const novaPlanta = {
      id: crypto.randomUUID(),
      apelido: dados.apelido,
      especieId: dados.especieId,
      especieNome: dados.especieNome,
      cientifico: dados.cientifico || '',
      dataAquisicao: dados.dataAquisicao || new Date().toISOString(),
      foto: dados.foto || null,
      frequenciaRegaDias: dados.frequenciaRegaDias || 7,
      ultimaRega: null,
      historicoRegas: [],
      diario: [],
      criadaEm: new Date().toISOString(),
    };
    setPlantas((atual) => [...atual, novaPlanta]);
    return novaPlanta.id;
  }, []);

  const editarPlanta = useCallback((id, dadosAtualizados) => {
    setPlantas((atual) =>
      atual.map((p) => (p.id === id ? { ...p, ...dadosAtualizados } : p)),
    );
  }, []);

  const removerPlanta = useCallback((id) => {
    setPlantas((atual) => atual.filter((p) => p.id !== id));
  }, []);

  const registrarRega = useCallback((id) => {
    const agora = new Date().toISOString();
    setPlantas((atual) =>
      atual.map((p) =>
        p.id === id
          ? {
              ...p,
              ultimaRega: agora,
              historicoRegas: [...p.historicoRegas, agora],
            }
          : p,
      ),
    );
  }, []);

  const adicionarAnotacao = useCallback((id, texto) => {
    const anotacao = {
      id: crypto.randomUUID(),
      texto,
      data: new Date().toISOString(),
    };
    setPlantas((atual) =>
      atual.map((p) =>
        p.id === id ? { ...p, diario: [anotacao, ...p.diario] } : p,
      ),
    );
  }, []);

  const removerAnotacao = useCallback((idPlanta, idAnotacao) => {
    setPlantas((atual) =>
      atual.map((p) =>
        p.id === idPlanta
          ? { ...p, diario: p.diario.filter((a) => a.id !== idAnotacao) }
          : p,
      ),
    );
  }, []);

  const obterPlanta = useCallback(
    (id) => plantas.find((p) => p.id === id),
    [plantas],
  );

  const valor = {
    plantas,
    adicionarPlanta,
    editarPlanta,
    removerPlanta,
    registrarRega,
    adicionarAnotacao,
    removerAnotacao,
    obterPlanta,
  };

  return (
    <PlantsContext.Provider value={valor}>{children}</PlantsContext.Provider>
  );
}

export function usePlants() {
  const contexto = useContext(PlantsContext);
  if (!contexto) {
    throw new Error('usePlants precisa ser usado dentro de um PlantsProvider');
  }
  return contexto;
}
