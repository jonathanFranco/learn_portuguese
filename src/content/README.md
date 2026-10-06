# Conteúdo

A trilha (fases, ordem, pré-requisitos, skills de todos os assuntos) fica em `topics.ts`. O conteúdo de cada assunto fica em `topics/<id do assunto>.ts`, exportando `lessons`, `questions` e `flashcards`. `index.ts` carrega esses arquivos sozinho: **arquivo presente = assunto disponível**; sem arquivo, o assunto aparece como "em breve".

## Adicionar um assunto

1. Confira as skills dele em `topics.ts` (prefixo dos ids = parte antes do primeiro hífen da skill, ex.: `cr`).
2. Crie `topics/<id>.ts`: uma lição por skill (com dica `cobranca` e `pegadinha`), ≥ 3 questões por skill (4 recomendado, dificuldades 1–3) e ≥ 5 cartões por skill.
3. Valide só ele: `npx vitest run src/content -t "assunto <id>"`.

## Adicionar questões

1. Use o `id` com o prefixo do assunto (`cr-19`, `cv-21`…) — precisa ser único.
2. `skillId` precisa existir nas `skills` do assunto em `topics.ts`. É ele que define a "questão semelhante" depois de um erro.
3. Múltipla escolha: toda alternativa errada precisa de `whyWrong` (é o "Por que você errou?").
4. Questão real de prova: preencha `source` (ex.: `"FCC 2019 — TRT"`) e use o gabarito **definitivo**.
5. Rode `npm test`: `content.test.ts` valida, por assunto, ids, gabaritos, skills, explicações, quantidades e se toda missão continua montável.

Regras de integridade: `validateCatalog()` em `catalog.ts`.
