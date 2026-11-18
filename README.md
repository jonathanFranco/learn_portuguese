<div align="center">

# 👣 Passo — Português para Concursos

> *"Você não precisa estudar muito agora. Só precisa completar o próximo pequeno passo."*

Um app de estudo de **Língua Portuguesa para concursos** feito de micro-missões de 5 a 10 minutos,
com revisão espaçada, XP, sequência de dias e um caminho claro do básico ao simulado.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/estado-Zustand-433E38)
![Firebase](https://img.shields.io/badge/sync-Firebase-FFCA28?logo=firebase&logoColor=black)
![Vitest](https://img.shields.io/badge/testes-Vitest-6E9F18?logo=vitest&logoColor=white)

</div>

---

## ✨ Por que o Passo é diferente

Estudar para concurso cansa porque parece infinito. O Passo quebra a matéria em **passos pequenos** e decide por você qual é o próximo.

- 🎯 **Micro-missões** — sessões curtas (5–10 min) que alternam lição, exemplo, questões e revisão de erros.
- 🧠 **Revisão espaçada** — o que você errou volta na hora certa, até ficar firme.
- 🧭 **Recomendação inteligente** — a tela *Hoje* sugere a próxima missão com base no seu domínio de cada assunto.
- 📈 **Domínio por assunto** — score de 0 a 100 que considera acertos recentes, dificuldade e tempo.
- 🏆 **Gamificação leve** — XP (erro nunca tira pontos), níveis, sequência de dias, conquistas e confete 🎉.
- 🗺️ **Trilha completa** — todos os assuntos liberados, do básico ao avançado, sem bloqueio de conteúdo.
- 📝 **Simulado** — questões misturadas para testar como está na prova.
- 🃏 **Cartões e dicas de prova** — flashcards para memorizar regras e pegadinhas.
- ✍️ **Seu próprio conteúdo** — crie cartões e questões personalizados.
- ☁️ **Sincronização opcional** — login com Firebase para continuar em outro dispositivo; sem ele, tudo fica salvo localmente.
- ⌨️ **Atalhos de teclado** — responda sem tirar a mão do teclado.

## 📚 Conteúdo

Mais de 20 assuntos cobrados em concursos, cada um com lições, exemplos e questões comentadas:

| Gramática | Sintaxe | Texto |
| --- | --- | --- |
| Classes gramaticais | Sujeito e predicado | Interpretação de texto |
| Concordância verbal e nominal | Complementos verbais | Tipologia textual |
| Regência verbal e nominal | Adjunto adverbial | Gêneros textuais |
| Crase | Aposto e vocativo | Coesão e coerência |
| Colocação pronominal | Funções sintáticas | Reescrita |
| Pontuação | Período composto | Semântica |
| Variação linguística | Orações coordenadas e subordinadas | Figuras de linguagem |

Quer contribuir com conteúdo? Veja [`src/content/README.md`](src/content/README.md) e [`CONTENT_REVIEW.md`](CONTENT_REVIEW.md).

## 🧱 Stack

| Camada | Tecnologia |
| --- | --- |
| UI | React 19 + React Router, CSS Modules, fonte Nunito |
| Estado | Zustand |
| Build | Vite + TypeScript |
| Persistência | `localStorage` + Firebase (Auth e Firestore) opcional |
| Testes | Vitest |

## 🚀 Rodando localmente

**Pré-requisito:** Node.js 22 (veja `.nvmrc`).

```bash
# 1. Clone o repositório
git clone https://github.com/jonathanFranco/learn_portuguese.git
cd learn_portuguese

# 2. Instale as dependências
npm install        # ou: bun install

# 3. (Opcional) Configure o Firebase para login e sincronização
cp .env.example .env.local

# 4. Suba o servidor de desenvolvimento
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente [http://localhost:5173](http://localhost:5173)) e dê o primeiro passo. 👣

### 🔑 Variáveis de ambiente (opcionais)

Sem elas o app funciona normalmente, salvando o progresso só no navegador e sem login.

| Variável | Descrição |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Chave da API do app Web no Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto |
| `VITE_FIREBASE_APP_ID` | ID do app |

Encontre esses valores no console do Firebase em *Configurações do projeto → Seus apps*. As regras de segurança do Firestore estão em [`firestore.rules`](firestore.rules).

## 📜 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção |
| `npm run preview` | Serve o build localmente |
| `npm run typecheck` | Só a checagem de tipos |
| `npm test` | Roda os testes uma vez |
| `npm run test:watch` | Testes em modo watch |

## 🏗️ Arquitetura

SPA sem backend próprio, organizada em quatro camadas com dependência em um só sentido:

```
ui  ──►  app (store + casos de uso)  ──►  domain (regras puras)
                     │                          ▲
                     ▼                          │
               persistence  ────────────────────┘
```

```
src/
├── domain/        # Regras puras e testadas: XP, domínio, missões, revisão, simulado…
├── app/           # Store (Zustand), seletores e sincronização
├── persistence/   # localStorage, Firebase e migrações de dados
├── content/       # Assuntos, lições e questões
└── ui/            # Telas, componentes, exercícios e design system
```

Todas as decisões de produto e de código (XP, missões, revisão espaçada, recomendação, design system…) estão documentadas em detalhes no [`ARCHITECTURE.md`](ARCHITECTURE.md).

## 🤝 Contribuindo

1. Faça um fork e crie uma branch: `git checkout -b minha-melhoria`
2. Garanta que está tudo verde: `npm run typecheck && npm test`
3. Abra um pull request contando o que mudou

---

<div align="center">
Um passo de cada vez. Feito com 💚 por <a href="https://github.com/jonathanFranco">@jonathanFranco</a>
</div>
