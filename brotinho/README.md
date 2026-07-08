# 🌱 Brotinho

> Cuide com carinho, veja brotar.

SPA em React para descobrir os cuidados de qualquer planta (via [Perenual API](https://perenual.com/docs/api)) e acompanhar a saúde e a rotina de rega das suas próprias plantas, tudo direto no navegador, sem backend.

Projeto da disciplina **Desenvolvimento Web Frontend** — UFRN/ECT, Turma T01 (2026.1).

**🔗 Aplicação hospedada:** https://brotinho-dun.vercel.app/
**🎥 Vídeo de apresentação:** [cole aqui o link do vídeo]

---

## Sobre o projeto

Quem cuida de plantas em casa, seja hobby recente ou hábito antigo, normalmente não tem um lugar centralizado pra saber os cuidados de cada espécie e lembrar da rotina de rega. As informações ficam espalhadas em blogs, vídeos e grupos de mensagem, sem organização nenhuma.

O Brotinho resolve isso com:

- **Catálogo de plantas** com busca por nome, alimentado pela Perenual API;
- **Ficha de cuidados completa** de cada espécie (luminosidade, frequência de rega, toxicidade, dificuldade);
- **Cadastro pessoal** das suas plantas, com foto, apelido e frequência de rega;
- **Registro de rega** com feedback visual animado;
- **Barra de saúde** calculada automaticamente a partir do tempo desde a última rega;
- **Alertas visuais** quando uma planta está com rega atrasada;
- **Diário de anotações** por planta, pra acompanhar a evolução dela ao longo do tempo.

## Funcionalidades

### MUST (obrigatórias)

- [x] MUST-01 — Busca de plantas
- [x] MUST-02 — Ficha completa da planta
- [x] MUST-03 — Cadastrar planta pessoal (com upload de foto)
- [x] MUST-04 — Editar planta cadastrada
- [x] MUST-05 — Registrar rega, com animação de gotinha
- [x] MUST-06 — Barra de saúde (Bem / Atenção / Crítico)
- [x] MUST-07 — Alerta visual de rega atrasada
- [x] MUST-08 — Diário da planta

### NICE (desejáveis) e além do escopo original

- [x] NICE-02 — Flip card no catálogo (hover mostra resumo de cuidados)
- [x] NICE-03 — Dark mode completo, com preferência salva
- [x] Internacionalização PT/EN — interface **e** dados da API traduzidos
- [x] Upload de foto com compressão automática (em vez de link de imagem)
- [x] Menu mobile (hambúrguer) e layout responsivo
- [x] Botão "voltar ao topo"
- [ ] NICE-01 — Calendário de cuidados (não implementado — os dados de `historicoRegas` já existem no contexto, falta só a visualização em grade mensal)

## Stack técnica

| Categoria           | Tecnologia                                    |
| ------------------- | --------------------------------------------- |
| Framework           | React 18 + Vite                               |
| Roteamento          | React Router v6                               |
| Estilo              | Tailwind CSS                                  |
| Estado global       | Context API (`PlantsContext`, `ThemeContext`) |
| Internacionalização | react-i18next                                 |
| Ícones              | Lucide React                                  |
| HTTP                | Fetch nativo                                  |
| Persistência        | `localStorage` (sem backend)                  |

## Como rodar localmente

```bash
git clone https://github.com/SEU-USUARIO/brotinho.git
cd brotinho
npm install
npm run dev
```

Abra `http://localhost:5173`.

### Configurando a API da Perenual (opcional)

O app funciona **100% offline** com 10 plantas mockadas em `src/data/plantasMock.json`, não precisa de nada pra testar todas as funcionalidades.

Pra usar dados reais:

1. Crie uma conta gratuita em https://perenual.com/docs/api e gere sua chave.
2. Copie `.env.example` para `.env`.
3. Cole sua chave em `VITE_PERENUAL_API_KEY`.
4. Reinicie `npm run dev`.

O plano gratuito da Perenual libera **100 requisições por dia**. Se a API falhar ou o limite for atingido, o app cai automaticamente para os dados locais, a experiência nunca quebra, só mostra um aviso de que está usando o catálogo local. As respostas da API também ficam em cache por 12h no navegador, pra economizar a cota.

## Estrutura do projeto

```
src/
  components/   # Header, Footer, cards, barra de saúde, seletores...
  context/       # PlantsContext (minhas plantas) e ThemeContext (dark mode)
  data/          # plantasMock.json — fallback offline bilíngue (pt/en)
  i18n/          # Configuração e dicionários de tradução (pt.json, en.json)
  pages/         # Home, Catálogo, Ficha da planta, Minhas Plantas, etc.
  services/      # perenualApi.js (busca/cache) e traduzirTexto.js (tradução automática)
  utils/         # Cálculo de saúde, compressão de imagem, dicionário de cuidados
```

## Deploy

O projeto está hospedado no **[Vercel]** (link no topo deste README):

```bash
npm run build
```

gera a pasta `dist/` com os arquivos estáticos prontos pra publicar. Lembre-se de configurar a variável de ambiente `VITE_PERENUAL_API_KEY` no painel da plataforma escolhida, já que o `.env` local nunca é enviado ao repositório (está no `.gitignore` por segurança).

## Autora

**Viviane Stephane Pinheiro Novo** — 20240001144
Desenvolvimento Web Frontend — UFRN/ECT, Turma T01 (2026.1)
