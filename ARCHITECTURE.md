# Passo — Português para Concursos

> "Você não precisa estudar muito agora. Só precisa completar o próximo pequeno passo."

Documento da **Fase 0** (definição). **Fase 1 concluída em 2026-10-01** (domínio, persistência, store, design system). **Fase 2 concluída em 2026-10-01** (5 assuntos, 23 lições, 89 questões). **Fase 3 concluída em 2026-10-05** (modo foco, 4 renderers, fluxo de erro, conclusão, retomada — ver §13). **Fase 4 concluída em 2026-10-05** (navegação, Trilha, Progresso, configurações — ver §14). **Fase 5 concluída em 2026-10-05** (polimento — ver §15). **MVP completo.** Cada seção abaixo responde a um item do §24 do briefing. Nome provisório: **Passo** (pasta `passo-portugues`).

---

## 1. Arquitetura

SPA front-end, sem backend próprio (sincronização opcional via Firebase — §18). Quatro camadas com dependência em um só sentido:

```
ui  ──►  app (store + casos de uso)  ──►  domain (regras puras)
                     │                          ▲
                     ▼                          │
               persistence  ──────────────  content (dados estáticos)
```

| Camada | Responsabilidade | Sabe de React? |
|---|---|---|
| `domain/` | Tipos, cálculo de domínio, XP, revisão espaçada, geração de missão, recomendação, conquistas. Funções puras `(estado, evento, agora) → novo estado`. | Não |
| `content/` | Assuntos, lições, exemplos e questões como dados tipados. Validados no carregamento. | Não |
| `persistence/` | `Repository` com `load()` / `save()` do `UserState` versionado. Implementação atual: `localStorage`. | Não |
| `app/` | Store (Zustand) que segura o `UserState`, expõe ações (`startMission`, `answer`, `pause`, `finish`) e grava via repository após cada ação. | Mínimo (hooks) |
| `ui/` | Telas e componentes. Só lê seletores e dispara ações; zero regra de negócio. | Sim |

**Por que assim:** toda regra que importa (domínio, recomendação, revisão) fica testável com Vitest sem DOM, e trocar `localStorage` por API é escrever outro `Repository` — a store e o domínio não mudam.

**Stack:** React 19 + TypeScript (strict) + Vite 8 + React Router 8 + Zustand 5 + Vitest. CSS Modules + CSS custom properties (sem Tailwind/UI kit — identidade própria, poucos componentes). Fontes self-hosted via `@fontsource` (funciona offline). Node 22 (`.nvmrc`) — Vitest 5 exige.

**Tempo injetável:** toda função de domínio recebe `now: number`. Facilita testar "voltou depois de 3 dias", revisão vencida etc.

**Persistência segura:**
- `UserState` tem `schemaVersion`; `migrations.ts` sobe versões antigas. Dado que não passa na validação **não é apagado** — é copiado para `passo:backup:<timestamp>` e o app inicia limpo com aviso discreto.
- Gravação após cada resposta (estado pequeno, < 100 KB mesmo com centenas de tentativas; histórico de tentativas é podado para as últimas N por assunto).
- Export/import JSON nas configurações (backup manual / trocar de aparelho).

---

## 2. Estrutura de pastas

```
passo-portugues/
├─ src/
│  ├─ domain/
│  │  ├─ types.ts              # todos os modelos (§3)
│  │  ├─ mastery.ts            # score + nível por assunto
│  │  ├─ xp.ts                 # tabela de XP e nível do usuário
│  │  ├─ review.ts             # revisão espaçada
│  │  ├─ mission.ts            # monta a sequência de passos
│  │  ├─ recommendation.ts     # recommendNextActivity()
│  │  ├─ achievements.ts       # regras de conquistas
│  │  ├─ answer.ts             # corrige qualquer tipo de questão
│  │  ├─ streak.ts             # sequência de dias (sem punição)
│  │  └─ *.test.ts
│  ├─ content/
│  │  ├─ topics.ts             # trilha: fases e assuntos (todos os 6, 5 desbloqueados)
│  │  ├─ topics/
│  │  │  ├─ classes-gramaticais.ts
│  │  │  ├─ interpretacao.ts
│  │  │  ├─ sujeito-predicado.ts
│  │  │  ├─ concordancia-verbal.ts
│  │  │  └─ crase.ts           # cada um: lessons + examples + questions
│  │  ├─ index.ts              # registry + validação (ids únicos, gabarito existe…)
│  │  └─ content.test.ts
│  ├─ persistence/
│  │  ├─ repository.ts         # interface Repository + LocalStorageRepository
│  │  └─ migrations.ts
│  ├─ app/
│  │  ├─ store.ts              # Zustand: UserState + ações
│  │  └─ selectors.ts
│  ├─ ui/
│  │  ├─ design/               # tokens.css, reset.css, fontes
│  │  ├─ components/           # Button, ProgressBar, MasteryBar, Card, XpBurst, Sheet…
│  │  ├─ exercises/            # um renderer por tipo de questão
│  │  ├─ screens/              # Today, Path, Progress, Session, MissionDone, Settings
│  │  └─ App.tsx               # rotas + layout
│  └─ main.tsx
├─ ARCHITECTURE.md
└─ package.json
```

---

## 3. Modelos TypeScript

Divisão clara: **conteúdo** (estático, vem de `content/`) × **estado do usuário** (muda, vai para o repository).

```ts
// ── Conteúdo ─────────────────────────────────────────
type PhaseId = 1 | 2 | 3 | 4 | 5 | 6;

interface Topic {
  id: string;                 // 'crase'
  name: string;
  description: string;
  phase: PhaseId;
  prerequisites: string[];    // topic ids
  skills: Skill[];            // sub-regras: 'crase-a-mais-a', 'crase-proibida-masculino'…
  available: boolean;         // false = aparece na trilha como "em breve"
}

interface Skill { id: string; name: string }

/** Unidade de teoria curta. Progressive disclosure: summary → examples → deepDive opcional. */
interface Lesson {
  id: string;
  topicId: string;
  skillId: string;
  title: string;              // "Crase = a + a"
  summary: RichText;          // 1–3 linhas
  examples: Example[];        // ≥ 2 (o 2º é o "mostrar outro exemplo")
  deepDive?: RichText;
}

interface Example {
  sentence: string;           // "Vou à escola."
  breakdown?: string[];       // ["Vou a + a escola", "↓", "Vou à escola"]
  note?: string;
}

type Difficulty = 1 | 2 | 3;  // fácil / médio / difícil (difícil = +20 XP)

interface QuestionBase {
  id: string;
  topicId: string;
  skillId: string;            // base do "questão semelhante" após erro
  difficulty: Difficulty;
  statement: RichText;
  passage?: RichText;         // questões baseadas em texto
  explanation: RichText;      // curta: "por que é assim"
  source?: string;            // "Adaptada — FCC 2019"
}

// União discriminada: cada tipo tem seu renderer e sua correção
type Question =
  | QuestionBase & { type: 'multiple_choice'; alternatives: Alternative[]; correct: string }
  | QuestionBase & { type: 'true_false'; correct: boolean }
  | QuestionBase & { type: 'fill_blank'; template: string; options: string[]; correct: string }
  | QuestionBase & { type: 'identify_error'; segments: string[]; correct: number }  // toca no trecho errado
  | QuestionBase & { type: 'order'; items: string[]; correct: string[] }
  | QuestionBase & { type: 'match'; pairs: [string, string][] };

interface Alternative { id: 'A'|'B'|'C'|'D'|'E'; text: string; whyWrong?: string }
// whyWrong = explicação específica do distrator — é o que permite o "Por que você errou?"

type RichText = string;       // markdown mínimo: **negrito**, _itálico_, `destaque`

// ── Estado do usuário ────────────────────────────────
interface UserState {
  schemaVersion: number;
  user: User;
  progress: Record<string, Progress>;     // por topicId
  attempts: Attempt[];                    // podado
  mistakes: Record<string, Mistake>;      // por questionId
  activeSession: StudySession | null;     // retomada
  achievements: Record<string, number>;   // achievementId → unlockedAt
  dailyLog: Record<string, DayLog>;       // 'YYYY-MM-DD' → { minutes, xp, missions }
}

interface User { name: string; createdAt: number; totalXp: number; lastStudiedAt?: number }

interface Attempt {
  questionId: string; topicId: string; skillId: string;
  answer: Answer; correct: boolean;
  difficulty: Difficulty;
  context: 'mission' | 'review' | 'retry';  // retry = questão semelhante após erro
  at: number; durationMs: number;
}

type Answer = string | boolean | number | string[];

interface Progress {
  topicId: string;
  attempts: number; correctAnswers: number; wrongAnswers: number;
  mastery: Mastery;
  review: ReviewState;
  lastStudiedAt?: number;
  lessonsSeen: string[];
}

interface Mastery { score: number; level: MasteryLevel } // score 0–100
type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;  // 0 não iniciado, 1 Reconhecer … 5 Domínio

interface ReviewState { stage: number; nextReviewAt?: number } // stage → índice em [1,3,7,14,30] dias

interface Mistake {
  questionId: string; topicId: string; skillId: string;
  count: number; lastWrongAt: number;
  resolved: boolean;          // vira true ao acertar a questão (ou uma semelhante) depois
}

interface StudySession {
  id: string;
  mission: Mission;
  stepIndex: number;
  results: StepResult[];      // respostas já dadas, XP ganho por passo
  startedAt: number; updatedAt: number;
  pausedMs: number;
}

interface Mission {
  id: string;
  kind: 'learn' | 'practice' | 'review' | 'weak_spot';
  topicId: string;
  title: string;              // "Dominar os casos básicos de crase"
  steps: MissionStep[];
  estimatedMinutes: number;
}

type MissionStep =
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'example'; lessonId: string; exampleIndex: number }
  | { kind: 'question'; questionId: string; role: 'practice' | 'interleave' | 'challenge' }
  | { kind: 'mistake_review'; questionId: string };

interface Recommendation {
  topicId: string;
  missionKind: Mission['kind'];
  reason: string;             // "Você errou 6 das últimas 15 questões."
  estimatedMinutes: number;
}

interface Achievement { id: string; title: string; description: string; icon: string }
```

`Lesson`, `Topic`, `Question`, `Achievement` são conteúdo; o resto é estado. Os 12 tipos de exercício do briefing mapeiam para 6 `type`s: "questão de concurso", "baseada em texto", "comparação", "melhor reescrita" e "função sintática" são `multiple_choice` com `passage`/`source`/enunciado próprios — não precisam de renderer novo. "Revisão de erro" é um `MissionStep`, não um tipo de questão.

**MVP renderiza 4 tipos:** `multiple_choice`, `true_false`, `fill_blank`, `identify_error`. `order` e `match` ficam tipados, implementados na fase seguinte.

---

## 4. Sistema de progressão (XP, níveis, sequência)

| Evento | XP |
|---|---|
| Acerto, dificuldade 1–2 | +10 |
| Acerto, dificuldade 3 | +20 |
| Acerto na tentativa de recuperação (após erro) | +5 — recompensa recuperar |
| Erro | 0 (nunca negativo) |
| Missão concluída | +50 |
| Assunto atinge nível 5 | +100 |

- **Nível do usuário:** curva suave `xpParaNível(n) = 100·n·(n+1)/2` (100, 300, 600…). Mostrado discretamente.
- **Sequência de dias:** conta dias com ≥ 1 missão. Ao quebrar, a UI **nunca** fala em perda: mostra "Seu último estudo foi há 2 dias" e o recorde histórico fica preservado ("Melhor sequência: 12 dias"). Sem "congelamentos", sem cobrança.
- **Conquistas (MVP):** Primeiro passo · 3 dias de estudo · 7 dias de estudo · 10 acertos seguidos · Recuperação (acertou 5 questões que já tinha errado) · Primeiro assunto dominado · Mestre da Crase. Avaliadas por regra pura após cada evento.

---

## 5. Micro-missões

`buildMission(kind, topicId, state, content, now) → Mission`. Alvo: **5–10 min**, 4–7 passos. Duração estimada por passo: lição 1,5 min · exemplo 0,5 · questão 0,75 (×1,5 se tiver `passage`) · revisão de erro 1.

Receitas (alternância do §8 embutida):

| kind | Quando | Sequência |
|---|---|---|
| `learn` | assunto novo ou skill com lição não vista | lição → 2 questões (skill) → exemplo extra → 1 questão de **outro** assunto já visto → desafio (dif. 2–3) |
| `practice` | assunto em andamento | 3 questões (mistas por skill) → interleave → desafio → 1 revisão de erro (se houver) |
| `review` | revisão espaçada vencida | 4 questões espalhadas pelas skills, priorizando as erradas antes |
| `weak_spot` | precisão baixa recente | lição curta da skill mais fraca → 2 questões dessa skill → revisão de 2 erros → desafio |

Escolha de questões: evita repetir as vistas nas últimas 2 sessões; prefere dificuldade ≈ nível atual (+0/+1). Embaralhamento com seed = id da missão, então retomar a sessão reproduz a mesma ordem.

**Fluxo do erro (§6) — dentro do passo, sem mudar de passo:**
1. "Você marcou B · Correta: D"
2. **Por que?** → `whyWrong` da alternativa marcada (ou `explanation`)
3. **Veja outro exemplo** → um `Example` da lição da mesma skill
4. **Agora tente de novo** → questão semelhante (mesma `skillId`, não vista na sessão). Sem semelhante disponível, pula para o próximo passo.

O erro vira `Mistake`; acertar depois o marca `resolved`.

**Retomada:** `activeSession` é gravada a cada resposta. Ao abrir o app com sessão ativa, a tela Hoje mostra só "Você estava estudando Crase · Faltam 2 atividades · [Continuar]". Sessão com > 7 dias é oferecida como "continuar ou começar outra" (sem descartar silenciosamente).

---

## 6. Domínio por assunto

Score 0–100, recalculado a cada tentativa, de `attempts` daquele assunto:

```
cada tentativa tem peso  w = decaimento(idade) × pesoDificuldade × pesoContexto
  decaimento: as 20 mais recentes valem mais (meia-vida ≈ 10 tentativas)
  pesoDificuldade: 1 / 1.3 / 1.7
  pesoContexto: review 1.3 (lembrar após dias vale mais), mission 1, retry 0.6

precisãoPonderada = Σ w·acerto / Σ w
cobertura         = skills com ≥ 2 acertos / total de skills        (0–1)
confiança         = min(1, tentativas / 15)                         (evita 100% com 2 questões)
penalidadeErros   = 0.05 × mistakes não resolvidos repetidos (count ≥ 2), máx 0.2

score = 100 × precisãoPonderada × (0.6 + 0.4·cobertura) × confiança − penalidade
```

Nível = score **e** portões (não basta volume):

| Nível | Nome | Score | Portão adicional |
|---|---|---|---|
| 1 | Reconhecer | ≥ 1 tentativa | — |
| 2 | Aplicar | ≥ 40 | — |
| 3 | Diferenciar | ≥ 60 | todas as skills tentadas |
| 4 | Questões difíceis | ≥ 75 | ≥ 3 acertos dificuldade 3 |
| 5 | Domínio | ≥ 88 | ≥ 1 revisão espaçada concluída com ≥ 75% e acertos em 2 dias diferentes |

A UI mostra a barra do score + "84% de precisão · 37 questões · 31 acertos · 6 erros". Constantes ficam num único objeto `MASTERY_CONFIG` para calibrar com uso real.

---

## 7. Revisão espaçada

`review.ts`, isolado para trocar por FSRS/SM-2 depois sem tocar no resto.

- Assunto entra no ciclo quando atinge nível 2 → `stage 0`, `nextReviewAt = agora + 1 dia`.
- Intervalos: `[1, 3, 7, 14, 30]` dias.
- Ao concluir uma missão `review`: precisão ≥ 80% → `stage + 1`; 50–79% → mantém; < 50% → `stage − 1` (mín. 0). Missões normais com erro no assunto também puxam `stage − 1`.
- Revisão vencida **não acumula como dívida** visual: a UI nunca mostra "12 revisões atrasadas"; o recomendador só escolhe a mais relevante.

---

## 8. Recomendação

`recommendNextActivity(state, content, now) → Recommendation` — ranking por pontuação, a maior vence; o motivo do maior fator vira o texto.

| Fator | Peso | Motivo exibido |
|---|---|---|
| Revisão vencida | 40 × (dias de atraso, saturado em 1) | "Hora de revisar Crase — faz 7 dias." |
| Erros recentes (últimas 15 do assunto) | 50 × taxaDeErro se ≥ 5 tentativas | "Você errou 6 das últimas 15 questões." |
| Domínio baixo em assunto iniciado | 30 × (1 − score/100) | "Concordância está em 51%. Vamos subir isso." |
| Próximo assunto da trilha (pré-requisitos ok) | 25 | "Próximo passo da sua trilha." |
| Esquecimento (dias desde último estudo) | 15 × min(1, dias/10) | "Você não vê Sujeito há 9 dias." |
| Visto na última missão | −35 | (evita repetição — alternância) |
| ~~Pré-requisito com nível < 2~~ | ~~exclui~~ — removido em 2026-10-06 (§17) | — |

`kind` derivado do fator vencedor: revisão → `review`, erros/domínio baixo → `weak_spot`, trilha → `learn`, demais → `practice`. Primeira vez no app: `learn` em Classes Gramaticais. Pesos num único `RECOMMENDATION_CONFIG`.

---

## 9. Fluxo de telas

```
            ┌─────────────── nav: Hoje · Trilha · Progresso ───────────────┐
            │                                                              │
  [Hoje] ───┼─ sessão ativa? ── sim ─► "Você estava estudando Crase" [Continuar]
            │                   não ─► Saudação + MISSÃO DE HOJE (recomendação) [Começar]
            │                          + 1 linha: 🔥 dias · ⭐ XP  (só isso)
            │
            ├─► [Sessão / Modo Foco]  rota /sessao — nav escondida
            │     topo:  ✕ (sair = salva)  ·  3 / 6  ·  ⏸
            │     corpo: só o passo atual (lição | exemplo | questão)
            │     base:  barra de progresso da sessão
            │     erro → fluxo de 4 etapas no mesmo passo
            │        │
            │        ▼
            │   [Missão concluída]  🌱 +80 XP · "Você praticou Crase por 8 min"
            │                       conquista nova (se houver) · barra de domínio animando
            │                       [Mais uma missão]  [Encerrar por hoje]
            │                                             └─► "Até amanhã 🌱" → Hoje (estado "feito")
            │
  [Trilha] ─┼─ mapa vertical: 6 fases, nós por assunto (bloqueado/ disponível/ nível 1–5/ em breve)
            │   toque no nó → bottom sheet: domínio, precisão, [Estudar este assunto]
            │
  [Progresso]─ progresso geral · Pontos de atenção (top 4 piores, barra + recomendação)
               · Seus assuntos · Conquistas · Configurações (nome, export/import, resetar)
```

Hoje depois de concluir a missão do dia: "Missão de hoje concluída ✓" + opção discreta "Quer fazer mais uma?". Nada de "ainda falta".

Primeiro acesso: 1 tela — "Como podemos te chamar?" → Hoje. Sem onboarding longo.

---

## 10. Design system básico

**Direção:** "caderno de campo" — calmo, editorial, quente. Papel claro levemente creme, tinta verde-musgo profunda como cor de marca (🌱 crescimento), acento âmbar para XP/conquistas. Adulto, não infantil: sem mascote, sem cores saturadas primárias, sem sons por padrão.

| Token | Valor (claro) | Uso |
|---|---|---|
| `--bg` | `#F7F4EC` | fundo papel |
| `--surface` | `#FFFDF8` | cartões |
| `--ink` | `#1F2A24` | texto |
| `--ink-soft` | `#5B6660` | texto secundário |
| `--brand` | `#2F6B4F` | ações principais, progresso |
| `--brand-soft` | `#DCEBE1` | fundos de destaque |
| `--accent` | `#D99A2B` | XP, sequência, conquistas |
| `--correct` | `#2F8F5B` | acerto |
| `--wrong` | `#C25B4A` | erro (terracota, não vermelho alarme) |
| `--line` | `#E5DFD1` | bordas |

Modo escuro com os mesmos papéis (`prefers-color-scheme` + toggle). Contraste AA verificado.

- **Tipografia:** *Nunito* (variável, self-hosted) em tudo — sans arredondada, cara de app de estudo. Títulos 800, corpo 500. Corpo 18 px em questões, line-height 1.6. (Trocada em 2026-10-06; antes Fraunces + Atkinson.)
- **Espaço:** escala 4/8/12/16/24/32/48. Conteúdo de estudo em coluna única ≤ 640 px.
- **Raio:** 12 px cartões, 999 px pílulas. Sombras mínimas; profundidade por cor de superfície.
- **Movimento:** 150–250 ms ease-out; barra de progresso cresce animada; "+10 XP" sobe e some; nó da trilha "acende" ao subir de nível. Tudo desliga com `prefers-reduced-motion`.
- **Componentes:** `Button` (primary/secondary/ghost, alvo ≥ 48 px), `ProgressBar`, `MasteryBar` (com marcadores dos 5 níveis), `Card`, `Sheet` (bottom sheet), `Pill`, `XpBurst`, `StepHeader` (modo foco), `ChoiceButton` (estados: neutro/selecionado/correto/errado, com ícone além da cor), `RichText`.
- **Regra de tela:** no máximo **1 ação primária** visível por tela. Teclado: 1–5 / A–E respondem, Enter confirma.

---

## 11. Conteúdo do MVP

5 assuntos com conteúdo real, escrito por mim, em linguagem de banca (estilo FCC/Cebraspe/Vunesp, **adaptado — não copiado** de provas):

| Assunto | Skills | Lições | Questões |
|---|---|---|---|
| Classes gramaticais | substantivo×adjetivo, pronome, verbo, advérbio, preposição/conjunção | 5 | ~18 |
| Interpretação de texto | ideia central, inferência, sentido no contexto, referência (coesão) | 4 | ~14 (com textos curtos) |
| Sujeito e predicado | identificar sujeito, tipos de sujeito, sujeito posposto, predicado | 4 | ~16 |
| Concordância verbal | regra geral, sujeito posposto, "haver/fazer" impessoal, coletivo/porcentagem, "se" apassivador | 5 | ~18 |
| Crase | a+a, proibições (masc./verbo), facultativa, locuções, "àquele" | 5 | ~18 |

≈ 85 questões, todas com explicação e `whyWrong` nos distratores. As demais fases aparecem na trilha como "em breve". **Recomendo uma revisão do conteúdo por alguém da área** antes de ela usar de verdade — vou ser cuidadoso, mas gramática de concurso tem pegadinhas e exceções.

---

## 12. Plano de fases

| Fase | Entrega | Prova |
|---|---|---|
| **1. Fundação** | Scaffold, design tokens, componentes base, `domain/` completo (tipos, mastery, xp, review, mission, recommendation, achievements) com testes, repository + migrations, store | `npm test` verde, typecheck |
| **2. Conteúdo** | 5 assuntos completos + validador de conteúdo | teste de integridade do conteúdo |
| **3. Estudo** | Modo foco, 4 renderers, fluxo de erro, tela de conclusão, retomada | jogar uma missão inteira no browser, sair no meio, voltar |
| **4. Navegação** | Hoje, Trilha (mapa), Progresso/Pontos fracos, conquistas, configurações (export/import) | recomendação muda após errar de propósito; dados sobrevivem a reload |
| **5. Polimento** | Animações, modo escuro, acessibilidade, responsivo, ajuste de pesos | revisão visual mobile + desktop |

Paro ao fim de cada fase para sua aprovação.

---

## Decisões que tomei sem perguntar (fáceis de mudar agora)

1. **React** em vez de Vue — você é front-end; ecossistema de testes/animação mais amplo.
2. **Zustand** em vez de Context+reducer — store fora da árvore React, fácil de persistir e testar.
3. **CSS Modules + tokens**, sem Tailwind/shadcn — identidade própria e menos peso.
4. **Sem sons**, sem mascote.
5. **Usuário único** por navegador (sem login) — é para uma pessoa.
6. **PWA instalável** fica para depois do MVP (barato de adicionar; ajudaria o "abrir todo dia" no celular).

---

## 13. Notas da Fase 3 (Estudo)

- **UI ↔ store:** `ui/store.ts` cria a store única e expõe `useApp(selector)` + `actions()`. O estado de cada passo (respondido? retry pendente?) vem da sessão persistida, não de estado local — recarregar no meio do fluxo de erro volta ao mesmo ponto. A resposta dada é reconstruída de `attempts` (`sessionAnswer`).
- **Rotas:** `/` Hoje (versão mínima: continuar / missão recomendada / "concluída ✓"), `/sessao` modo foco, `/concluida`, `/design` (vitrine, sai na Fase 5). Sem usuário → tela de nome.
- **Modo foco:** ✕ pausa e volta para Hoje (sessão continua ativa); ⏸ abre overlay de pausa. Barra de progresso ficou **no topo** (junto do contador), não na base: a base é da ação principal (sticky, alcance do polegar).
- **Teclado:** 1–5 / A–E / V–F escolhem, Enter responde ou aciona a ação principal (`useHotkeys`).
- **Reserva para o retry:** missões `learn` e `weak_spot` deixam ≥ 1 questão da skill em foco sem usar (`reserve` no `MissionBuilder`) e o interleave de fallback evita essa skill. Sem isso a primeira missão consumia a skill inteira e o "tente uma parecida" nunca aparecia. Teste em `content.test.ts`. Com ~4 questões por skill, um 2º erro na mesma skill ainda pode ficar sem semelhante (pula, como previsto no §5) — **mais questões por skill** é a melhoria de conteúdo de maior impacto.
- **Guarda:** teste garante que o conteúdo só usa os 4 tipos renderizados.

---

## 14. Notas da Fase 4 (Navegação)

- **Rotas:** `Shell` (nav inferior Hoje · Trilha · Progresso) envolve `/`, `/trilha`, `/progresso`. Modo foco e conclusão ficam fora dele, sem nav.
- **Trilha:** nós em zigue-zague por fase. O anel mostra o score; o miolo mostra o nível, 🔒 ou "em breve". O nó abre um `Sheet` (`<dialog>` nativo: foco preso, Esc fecha). Assunto bloqueado diz o que falta ("Libera quando X chegar ao nível Aplicar"). Se há missão em andamento, o sheet oferece continuá-la antes de começar outra (nunca descarta em silêncio).
- **Progresso:** % geral + nível/XP/missões/melhor sequência, pontos de atenção (até 4, sem os já dominados) com "Reforçar", assuntos, conquistas (bloqueadas aparecem tracejadas), configurações.
- **Configurações:** renomear; exportar (`passo-backup-AAAA-MM-DD.json`) / importar (com confirmação, substitui tudo); apagar progresso (com confirmação → tela de nome). Erro de gravação aparece aqui.
- **Hoje:** com sequência quebrada mostra "Seu último estudo foi há N dias" — sem falar em perda.
- **Conclusão:** o resumo é fixado ao montar; antes, "Mais uma missão" limpava o resumo e a tela redirecionava para Hoje no meio da navegação.
- **Layout:** `.page`/`.stack` usam `grid-template-columns: minmax(0, 1fr)`; sem isso grids `auto-fit` filhos alargavam a página no celular.
- **Prova:** e2e headless (390 px): errar de propósito → próxima missão vira `weak_spot` "Reforçar: …"; depois de 2 missões seguidas no assunto, a alternância passa para o próximo da trilha. Dados sobrevivem a reload; export → apagar → import restaura.

---

## 15. Notas da Fase 5 (Polimento)

- **Contraste (AA medido):** no claro, `--ink-faint` (2,9:1), `--accent` como texto (2,2:1), `--wrong`/`--correct` (~4:1) falhavam. Novos: `--ink-faint #6a726c`, `--correct #237347`, `--wrong #a64837`, e `--accent-ink` (`#946010` claro / `#e3ae4f` escuro) para texto âmbar ("+XP"); `--accent` segue nos preenchimentos. A tabela do §10 mostra os valores originais.
- **Tema:** Automático / Claro / Escuro em Configurações (`ui/theme.ts`). É preferência do aparelho (`localStorage`, fora do export), aplicada antes do primeiro render, e atualiza a `meta theme-color`. O automático acompanha a troca do sistema.
- **Acessibilidade:** pausa e sheet usam `<dialog>` nativo (foco preso; Esc fecha e, na pausa, retoma); atalhos ficam desligados com diálogo aberto. Trocar passo → foco no passo; trocar aba → foco no `h1` (leitor de tela anuncia). Missão completa jogável só pelo teclado (verificado).
- **Responsivo:** ≥ 900 px a navegação vai para o topo. Trilha: discos centrados sobre a linha, rótulos alternando de lado.
- **Pesos (simulação, sem dados reais):** alunos simulados (50/70/85/95 % de acerto, 60 dias, 2 missões/dia). Achado: aluno de 95 % recebia ~27 % de missões "Reforçar" porque 1 erro em 15 já ativava o fator. Novo `recentErrorMinRate: 0.25` — erro esporádico não é ponto fraco. Teste de regressão no conteúdo real (< 10 %). Demais curvas pareceram sensatas (aluno de 85 % domina os assuntos iniciais em ~40–60 missões); recalibrar com uso real.
- **Removido:** vitrine `/design` (`DesignPreview`).
- **Fica para depois do MVP:** PWA instalável; animação de "nó acende" ao subir de nível na trilha; tipos `order`/`match`; mais questões por skill (maior ganho de conteúdo); revisão do conteúdo por alguém da área.

---

## 16. Cartões e dicas de prova (2026-10-06)

Foco do app passa a ser **aprender conceitos e como a banca cobra** — as questões em si a pessoa faz em outras plataformas.

- **Dicas (`Lesson.tips`)**: `cobranca` (🎯 como costuma cair — genérico, sem citar banca: a pessoa não escolheu banca; descreve formato: certo/errado, lacuna, reescrita), `pegadinha` (⚠️), `macete` (⚡). Toda lição precisa de ≥ 1 cobrança e ≥ 1 pegadinha (`validateCatalog`). Aparecem no passo de lição (`TipList`) e no resumo do assunto.
- **Resumo do assunto** (`/assunto/:id`): todas as regras com exemplo, dicas e "Saber mais". Leitura livre, sem bloqueio de pré-requisito. Acesso pela Trilha e pela aba Cartões.
- **Flashcards** (`Flashcard`, `export const flashcards` em cada `topics/*.ts`, ≥ 3 por skill; hoje 155). Revisão espaçada por cartão em `domain/flashcards.ts` (caixas de Leitner `[0,1,3,7,16,35]` dias; Errei → caixa 0, Lembrei +1, Fácil +2). Sessão: vencidos (mais atrasado antes) + até 10 novos, máx. 20. Sem assunto, novos só de assuntos desbloqueados.
- **Estado**: `UserState.cards` (schema **v2**, migração v1→v2 adiciona `{}`). A fila da sessão vive só na tela; cada nota grava na hora. Fechar a sessão conta o dia na sequência e os minutos. +2 XP por cartão lembrado; conquista "Memória afiada" (100 revisões).
- **UI**: aba **Cartões** (`/cartoes`: revisão do dia + baralho por assunto), modo foco `/cartoes/estudo?assunto=` (Espaço/Enter vira; 1/2/3 avaliam; cartão errado volta no fim até 3×). Hoje mostra card secundário quando há cartões vencidos.
- **Conteúdo escrito por IA** — dicas e cartões marcam pontos controversos (ex.: "a maioria de", "a distância", "posto que"), mas a revisão por alguém da área continua recomendada.

---

## 17. Sem bloqueio de conteúdo (2026-10-06)

Todo assunto com conteúdo fica aberto sempre (missões, resumo, cartões) e pode ser revisitado a qualquer momento. Só "em breve" (sem conteúdo) continua desabilitado.

- Removidos `isUnlocked`, `RECOMMENDATION_CONFIG.prerequisiteLevel` e o status `locked` da trilha.
- `Topic.prerequisites` virou **sugestão**: o sheet da trilha mostra "Dica: fica mais fácil se você já tiver visto X" quando a base ainda não foi estudada. A recomendação segue a ordem da trilha para o "próximo passo".
- Cartões novos da revisão do dia vêm de todos os assuntos, na ordem da trilha.
- **XP** continua acumulando (questões, missões, cartões) — reservado para destravar outros recursos no futuro (nada definido ainda).

## 18. Sincronização com Firebase (2026-10-06)

Opcional e local-first: sem `.env.local` o app é o mesmo de antes (só `localStorage`). Com config, login Google (popup) + Firestore guardam o progresso na conta.

- **Porta:** `app/sync.ts` define `Cloud` (watch/signIn/signOut/load/save) e a regra pura `planSync`. Adaptador em `persistence/firebase.ts`; o SDK é importado sob demanda (chunk separado, não atrasa a primeira tela).
- **Dados:** um doc `users/{uid}` = `{ state: <UserState em JSON>, savedAt }`. JSON como texto porque o Firestore não aceita `undefined` nem arrays aninhados. Regras em `firestore.rules` (só o dono lê/grava, < 900 KB).
- **Metadados locais:** `passo:meta` = `{ savedAt, synced: { uid, at } }` — quando o estado local foi gravado e qual versão já está confirmada na nuvem para aquela conta.
- **Quando sincroniza:** ao entrar, ao abrir o app (sessão restaurada) e ao voltar para a aba (`visibilitychange`). Cada `commit` grava local e, se a conta já foi conferida, envia.
- **Regra (`planSync`):** só um lado mudou desde a última sincronização → envia ou baixa. Os dois mudaram (inclusive primeiro login com progresso dos dois lados) → **conflito**: diálogo pede qual manter; o outro vira `passo:backup:<ts>` local. Até escolher, nada vai para a nuvem; fechar o diálogo sai da conta.
- **Segurança de dados:** cópia da nuvem passa por `migrate()`; versão mais nova ou formato inválido → erro visível e a nuvem não é sobrescrita. "Apagar meu progresso" sai da conta antes (perfil novo não sobrescreve a nuvem).
- **Tela de entrada:** sem dados locais e com Firebase, a primeira tela é "Entrar com Google" (primário) ou "Continuar sem conta". Logado sem progresso na nuvem → pergunta o nome (sugere o da conta Google).
- **Sair da conta:** volta para a tela de entrada ("Você saiu da conta"), sem apagar o progresso local. "Continuar sem conta" segue com ele sem sincronizar; entrar de novo reconcilia normalmente.
- **Limite conhecido:** sem escuta em tempo real; dois aparelhos abertos ao mesmo tempo se alinham ao voltar para a aba.

## 19. Animações (2026-10-06)

Todas em CSS (exceto contagem do XP), com tokens `--dur-*`, `--ease-out` e `--ease-spring`; `prefers-reduced-motion` desliga tudo (base.css) e o confete some.
- Entrada de tela: filhos do `<main>` sobem em cascata (base.css).
- Alternativas: aperto, acerto com "pulo" + anel, erro treme; selo entra com mola (ChoiceButton).
- Abas: ícone da aba ativa dá um pulinho (Shell). Trilha: nós entram em cascata; o próximo ("Novo") pulsa.
- Barras de progresso enchem do zero ao aparecer. Cartão vira (flip) ao revelar. Broto da tela de entrada balança.
- Conclusão: confete (`components/Confetti`), XP conta de 0 (`hooks/useCountUp`), conquista entra e o ícone é "carimbado".

## 20. Conteúdo da pessoa: cartões e questões (2026-10-21)

A pessoa cadastra à mão cartões próprios e questões de fora (provas, apostilas, sites). Importar de PDF ficou de fora por decisão do usuário.

- **Estado:** `UserState.custom = { flashcards, questions }` (schema **v3**, migração v2→v3 adiciona listas vazias). Viaja junto no export/import e na sincronização com a nuvem. Ids `meu-cartao-…` / `minha-questao-…` (gerados na store).
- **Catálogo:** a store expõe `catalog()` = conteúdo do app + o da pessoa (`extendCatalog` em `content/catalog.ts`), memoizado pela referência de `data.custom`. Telas usam `useCatalog()`; nenhuma importa `content/` direto. Assim as questões da pessoa entram nas missões do assunto (domínio, erros, revisão, "tente uma parecida") e os cartões na revisão espaçada, sem regra duplicada.
- **Validação:** `flashcardErrors` / `questionErrors` servem ao conteúdo do app e ao da pessoa. Ao salvar, item inválido lança erro (a tela mostra). Ao montar o catálogo, item inválido (skill que saiu do conteúdo, backup corrompido) fica de fora em vez de quebrar a missão. Explicação é obrigatória só no conteúdo do app.
- **Ordem:** cartões novos da pessoa vêm antes dos do app na revisão do dia.
- **Apagar:** cartão leva junto o agendamento (`cards[id]`); questão leva o erro pendente (tentativas ficam: são histórico do domínio). Questão na missão em andamento não pode ser apagada. `mistakeReviews` ignora questões fora do catálogo.
- **UI:** aba **Questões** (`/questoes`: por assunto, "Praticar" monta `buildCustomMission` com até 8 questões só da pessoa; `/questoes/nova`, `/questoes/editar/:id` — múltipla escolha A–E ou verdadeiro/falso, texto de apoio, explicação, dificuldade e fonte opcionais). Em Cartões, seção **Meus cartões** (`/cartoes/novo`, `/cartoes/editar/:id`). "Salvar e criar outro" mantém assunto/regra (e, na questão, tipo, texto de apoio e fonte) para cadastrar em sequência.
- **Limite conhecido:** o documento da nuvem tem teto de ~900 KB (§18); cadastro manual fica longe disso, mas milhares de questões longas chegariam perto.

## 21. Trilha completa e simulado (2026-10-21)

- **Todos os assuntos com conteúdo.** As skills de todos ficam em `content/topics.ts`; o conteúdo, em `content/topics/<id>.ts`. `content/index.ts` carrega os arquivos por glob: **arquivo presente = assunto disponível** (`Topic.available` é derivado, não escrito à mão). Pré-requisitos sugeridos ajustados: gêneros → tipologia; regência verbal → complementos verbais; regência nominal → regência verbal.
- **Validação por assunto** em `content.test.ts` (`-t "assunto <id>"`): integridade isolada, 1 lição por skill, ≥ 3 questões (novos assuntos têm 5) e ≥ 5 cartões por skill, dificuldades 1–3, prefixo de id, `whyWrong`, questão de reserva e missões de 3–10 min.
- **Conteúdo escrito por IA** (fases 2–6), cada agente com uma lista de pontos controversos para revisão; a revisão por alguém da área continua recomendada (ver §16).
- **Questões mistas**: assunto comum, com lições de estratégia de prova e questões que misturam assuntos.
- **Simulado** (`domain/simulado.ts`; não é assunto, fecha a Trilha): 10/20/30 questões, uma por assunto por rodada, preferindo as não respondidas; 3 min por questão; sem correção até entregar; pode pular, trocar e deixar em branco; tempo esgotado (inclusive com o app fechado) entrega o que houver. Ao entregar, cada resposta vira tentativa com contexto `simulado` (peso 1 no domínio), erros entram na revisão e encurtam a revisão espaçada do assunto, conta o dia na sequência. Histórico dos últimos 10 com correção (`/simulado/resultado/:id`). Estado: `UserState.simulado` e `simulados` (schema **v4**).
- **Texto curto com marcação**: alternativas e "Você marcou/Correta" renderizam `**negrito**` etc. (`InlineText`); antes apareciam os asteriscos.
