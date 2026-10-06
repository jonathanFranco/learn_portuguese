import type { Flashcard, Lesson, Question } from '../../domain/types';

const topicId = 'questoes-mistas';

// Textos originais e curtos, no formato dos trechos de prova.
const PONTE =
  'O prefeito anunciou que a ponte será reformada. A obra, que começa em março, deve durar seis meses. Enquanto isso, os moradores usarão uma passagem provisória.';

const INOVACAO =
  'Fala-se muito em inovação no serviço público. Se a ideia é atender melhor, é preciso ouvir quem usa o serviço. Muitos servidores já se dedicam a isso, mas ainda se esperam mudanças maiores. Resta saber se elas virão.';

const ONIBUS =
  'O ônibus atrasou quarenta minutos, o ar-condicionado não funcionava e o motorista errou o caminho duas vezes. Ao descer, Paulo comentou com a colega: “Que viagem agradável!”';

const CRECHE =
  'A prefeitura prometeu entregar a creche em junho. Estamos em outubro, e o terreno continua vazio. Questionado, o secretário afirmou que a obra está “em fase avançada de planejamento”.';

export const lessons: Lesson[] = [
  {
    id: 'qm-l-gramatica-texto',
    topicId,
    skillId: 'qm-gramatica-texto',
    title: 'Gramática dentro do texto',
    summary:
      'Na prova, a gramática vem **dentro do texto**: destaca-se um termo e pergunta-se sua **classe**, sua **função** ou seu **valor naquele trecho**. A resposta depende do contexto — a mesma palavra muda de papel de uma frase para outra.',
    examples: [
      {
        sentence: 'Item: “Em ‘Os moradores esperam **que** a obra, **que** já atrasou, termine logo’, os dois ‘que’ têm o mesmo valor.”',
        breakdown: [
          '1. Leia o comando: ele pede o **valor** de cada “que” — são dois testes',
          '2. 1º “que”: “esperam **isso**” → conjunção integrante',
          '3. 2º “que”: “a obra, **a qual** já atrasou” → pronome relativo',
          '4. Valores diferentes → item **errado**',
        ],
      },
      {
        sentence: 'Item: “Em ‘O gerente julgou o atraso **inaceitável**’, o termo destacado é adjunto adnominal.”',
        breakdown: [
          'Teste do pronome: “O gerente julgou-**o** inaceitável”',
          'O adjetivo ficou **fora** do pronome → é **predicativo do objeto**',
          'Se fosse adjunto, sumiria junto com o objeto (“o atraso inaceitável” → “o”)',
          'Item **errado**',
        ],
      },
    ],
    deepDive:
      'Roteiro em 4 passos:\n1. Leia o **comando** antes do texto: ele diz o que procurar (classe? função? referente? valor?).\n2. Volte ao trecho e leia a **frase inteira**, não só a palavra destacada.\n3. Aplique um **teste de substituição**: “o qual” (relativo), “isso” (integrante), pronome oblíquo (objeto × predicativo), “porque / feito / conforme” (valores do “como”).\n4. Elimine as alternativas que descrevem a palavra **fora do contexto** — são os distratores mais comuns.',
    tips: [
      { kind: 'cobranca', text: 'Formatos típicos: “No trecho X, o termo Y exerce a função de…”, “o vocábulo ‘que’ retoma…”, “a partícula ‘se’ indica…”, “o termo Y classifica-se como…”. Em certo/errado, o item afirma a classificação e você julga; em múltipla escolha, as alternativas costumam trazer os **mesmos rótulos em ordens trocadas** (“respectivamente”).' },
      { kind: 'pegadinha', text: 'Cuidado com a classificação **de dicionário**: “que”, “se”, “como”, “a” e “meio” mudam de classe conforme a frase. Quem responde pela palavra isolada cai no distrator que descreve o uso mais comum, e não o do texto.' },
      { kind: 'pegadinha', text: 'Cuidado com o “**respectivamente**”: a alternativa pode trazer os rótulos certos na **ordem errada**. Classifique cada termo separadamente e só depois compare a sequência.' },
      { kind: 'macete', text: 'Não decore rótulos: **teste**. Cabe “o qual”? Relativo. Cabe “isso”? Integrante. Cabe “porque”? “Como” causal. Cabe “conforme”? “Como” conformativo. Cabe “um pouco”? “Meio” advérbio, invariável.' },
    ],
  },
  {
    id: 'qm-l-reescrita',
    topicId,
    skillId: 'qm-reescrita',
    title: 'Reescrita: correção e sentido',
    summary:
      'Questão de reescrita tem **duas condições**: a nova versão precisa estar **gramaticalmente correta** e **manter o sentido** do original. Basta falhar em uma delas para a reescrita ser rejeitada.',
    examples: [
      {
        sentence: 'Original: “Os fiscais obedeceram às novas regras.”\nReescrita: “Os fiscais seguiram às novas regras.”',
        breakdown: [
          '1. O que mudou? Só o verbo: obedecer → seguir',
          '2. Sentido: mantido (obedecer ≈ seguir)',
          '3. Correção: “seguir” é transitivo direto (seguir **as** regras) — sem preposição, não há crase',
          '4. Reescrita **incorreta**: o certo seria “seguiram **as** novas regras”',
        ],
      },
      {
        sentence: 'Original: “Embora chovesse, o evento aconteceu.”\nReescrita: “Chovia, mas o evento aconteceu.”',
        breakdown: [
          'Concessão (embora) → oposição (mas): o contraste entre os fatos se mantém',
          'O modo verbal foi ajustado: subjuntivo (chovesse) → indicativo (chovia)',
          'Correta e com o sentido preservado → reescrita **aceita**',
        ],
      },
    ],
    deepDive:
      'Roteiro:\n1. **Sublinhe o que mudou** entre original e reescrita — o resto é igual e não precisa ser relido.\n2. Pergunte o que essa mudança **arrasta**: verbo novo → regência e crase; sujeito novo ou deslocado → concordância; termo deslocado → vírgulas; conectivo novo → modo verbal e relação lógica.\n3. Confira o **sentido**: a relação lógica mudou? Uma oração restritiva virou explicativa? Um “alguns” virou “todos”?\n4. Só aprove a reescrita se ela passar nos **dois** testes.',
    tips: [
      { kind: 'cobranca', text: 'Formato clássico de certo/errado: “A reescrita do trecho X como Y **manteria a correção gramatical e os sentidos originais** do texto.” Em múltipla escolha: “assinale a reescrita que preserva o sentido e a correção” — ou o inverso, “a que **prejudica** a correção”.' },
      { kind: 'pegadinha', text: 'Cuidado com a reescrita **gramaticalmente perfeita** que muda o sentido: vírgulas que transformam oração restritiva em explicativa, conectivo de outra família (“embora” → “portanto”), palavra absoluta acrescentada. Correção sozinha não basta.' },
      { kind: 'pegadinha', text: 'Cuidado com a troca de verbo: ela pode mudar a **regência**, e a crase vai junto. “Obedecer **às** regras” → “seguir **as** regras”; “assistir **ao** jogo” → “ver **o** jogo”.' },
      { kind: 'macete', text: 'Circule **só o que mudou** e pergunte: “o que isso puxa?”. Verbo puxa regência e crase; sujeito puxa concordância; deslocamento puxa vírgula; conectivo puxa modo verbal e sentido.' },
    ],
  },
  {
    id: 'qm-l-pontuacao-concordancia',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    title: 'Uma falha por alternativa',
    summary:
      'Na questão “assinale a frase correta”, é comum que **cada alternativa errada falhe num assunto diferente**: uma na vírgula, outra na concordância, outra na crase. Em vez de ler cada frase “de ouvido”, faça uma **varredura fixa** em todas.',
    examples: [
      {
        sentence: 'Item: “Assinale a frase correta.”\n(a) Os servidores do setor, aprovaram a proposta.\n(b) Existe muitas dúvidas sobre o tema.\n(c) Chegamos à uma conclusão.\n(d) Todos devem obedecer ao regulamento.',
        breakdown: [
          '(a) vírgula entre sujeito e verbo → descarta',
          '(b) “muitas dúvidas” é o sujeito: “Existe**m** muitas dúvidas” → descarta',
          '(c) “uma” (artigo indefinido) não aceita crase: “Chegamos **a** uma conclusão” → descarta',
          '(d) “obedecer **a**” + “o regulamento” = “ao regulamento” → **correta**',
        ],
      },
      {
        sentence: 'Ordem de varredura (a mesma para todas as frases)',
        breakdown: [
          '1. **Vírgula** entre sujeito e verbo ou entre verbo e complemento',
          '2. **Concordância verbal**: ache o sujeito (pode vir depois do verbo); confira haver/fazer e o “se”',
          '3. **Regência e crase**: o verbo ou o nome pede preposição? Há artigo?',
          '4. **Colocação pronominal**: pronome oblíquo átono iniciando a frase',
          '5. **Concordância nominal**: anexo, incluso, obrigado, meio, bastante',
        ],
      },
    ],
    deepDive:
      'Por que uma ordem fixa? Porque, lendo “de ouvido”, a frase errada pode **soar** natural (“Me informaram”, “Haviam pendências”). A varredura transforma a leitura em checklist: cada frase passa pelos mesmos filtros, e o primeiro erro encontrado já basta para descartá-la.\n\nQuando o comando pede a **incorreta**, inverta: marque **C** nas frases que passam em todos os filtros; a resposta é a única que falhar.',
    tips: [
      { kind: 'cobranca', text: 'Formato comum: “Assinale a alternativa em que o trecho está **de acordo com a norma-padrão**” (ou “em que há **desvio**”). As frases parecem tratar do mesmo assunto, mas cada erro é de um tópico diferente — a questão testa se você domina **todos**.' },
      { kind: 'pegadinha', text: 'Cuidado com o comando **incorreta / exceto / não**: depois de analisar quatro alternativas, é fácil marcar a primeira frase correta que aparece. Circule o comando antes de começar.' },
      { kind: 'pegadinha', text: 'Cuidado com o erro **longe do início**: o sujeito pode estar distante do verbo (“A lista com os nomes dos aprovados nos três cargos **foram**…”). Ache o núcleo antes de julgar a concordância.' },
      { kind: 'macete', text: 'Ordem de varredura: **vírgula → concordância → regência/crase → colocação → concordância nominal**. Achou um erro? Descarte a frase e passe para a próxima — não perca tempo procurando um segundo.' },
    ],
  },
  {
    id: 'qm-l-sentido',
    topicId,
    skillId: 'qm-sentido',
    title: 'Sentido e efeito das expressões',
    summary:
      'Aqui a pergunta é sobre **o que o trecho quer dizer**: a relação que um conectivo estabelece, o efeito de uma escolha de palavra (ironia, aspas, ênfase) ou o que se pode **concluir** do texto. A resposta tem de estar **ancorada no contexto**.',
    examples: [
      {
        sentence: 'Item: “Em ‘Os gastos aumentaram; **logo**, o orçamento precisa ser revisto’, ‘logo’ pode ser substituído por ‘porém’ sem alteração de sentido.”',
        breakdown: [
          '“logo”, aqui, indica **conclusão** (= portanto)',
          '“porém” indica **oposição**: a revisão deixaria de ser consequência do aumento',
          'Item **errado**. Trocas aceitas: portanto, por isso, por conseguinte',
        ],
      },
      {
        sentence: '“O técnico **ainda** confia no time.”',
        breakdown: [
          '“ainda” **pressupõe** que ele já confiava antes',
          'Negue a frase: “O técnico **não** confia **mais** no time” → continua indicando que confiava antes',
          'O pressuposto resiste à negação; por isso a prova o trata como informação **garantida** pelo texto',
        ],
      },
    ],
    deepDive:
      'Três perguntas resolvem a maioria das questões:\n**Conectivo:** que relação ele estabelece (causa, conclusão, oposição, concessão, condição…)? A troca só é aceita dentro da mesma relação — e com o modo verbal ajustado.\n**Escolha de palavra:** que efeito ela produz? Aspas podem marcar fala alheia, ironia ou distanciamento; adjetivos e diminutivos revelam a avaliação do autor.\n**Inferência:** a conclusão está **autorizada** pelo texto? Desconfie de “sempre”, “nunca”, “todos”, “apenas”.',
    tips: [
      { kind: 'cobranca', text: 'Formatos frequentes: “o termo X pode ser substituído, **sem alteração de sentido**, por…”, “a expressão X introduz ideia de…”, “o emprego das aspas indica…”, “depreende-se do texto que…”. Em certo/errado, a substituição costuma vir com “**manteria os sentidos** do texto”.' },
      { kind: 'pegadinha', text: 'Cuidado com conectivos que **mudam de valor** com o modo verbal: “**desde que** chegou” (tempo) × “**desde que** haja verba” (condição); “**uma vez que** foi aprovado” (causa) × “**uma vez que** seja aprovado” (condição).' },
      { kind: 'pegadinha', text: 'Cuidado com a **ironia**: a frase literal costuma ser elogiosa, e o contexto a desmente. Alternativa que lê a frase ao pé da letra, contra os fatos narrados, está errada.' },
      { kind: 'macete', text: 'Antes de olhar as alternativas, **diga a relação em uma palavra** (causa? conclusão? oposição?). Depois, troque pelo conectivo-coringa da família — porque, portanto, mas, embora, se — e veja se a frase continua natural.' },
    ],
  },
];

export const questions: Question[] = [
  // ── Gramática no texto ──
  {
    id: 'qm-01',
    topicId,
    skillId: 'qm-gramatica-texto',
    difficulty: 1,
    type: 'multiple_choice',
    passage: PONTE,
    statement: 'No texto, os dois “que” classificam-se, respectivamente, como:',
    alternatives: [
      { id: 'A', text: 'conjunção integrante e pronome relativo.' },
      { id: 'B', text: 'pronome relativo e conjunção integrante.', whyWrong: 'Ordem invertida: o 1º “que” não retoma nome nenhum (“anunciou **isso**”); o 2º retoma “a obra” (“a obra, **a qual** começa…”).' },
      { id: 'C', text: 'conjunção integrante nos dois casos.', whyWrong: 'O 2º “que” retoma “a obra” e pode ser trocado por “a qual”: é **pronome relativo**.' },
      { id: 'D', text: 'pronome relativo nos dois casos.', whyWrong: 'O 1º “que” não retoma termo anterior; introduz o que foi anunciado (“anunciou **isso**”): é **conjunção integrante**.' },
      { id: 'E', text: 'conjunção causal e pronome relativo.', whyWrong: 'O 1º “que” não indica causa: a oração que ele inicia é o **objeto** de “anunciou” (o que foi anunciado).' },
    ],
    correct: 'A',
    explanation: '1º “que”: introduz o conteúdo do anúncio → “anunciou **isso**” → **conjunção integrante**.\n2º “que”: retoma “a obra” → “a obra, **a qual** começa em março” → **pronome relativo**.',
  },
  {
    id: 'qm-02',
    topicId,
    skillId: 'qm-gramatica-texto',
    difficulty: 1,
    type: 'true_false',
    statement: 'Em “A janela ficou meio aberta.”, a palavra “meio” é advérbio e, por isso, não concorda com “janela”.',
    correct: true,
    explanation: '“Meio” = **um pouco** → advérbio, invariável. “Meia aberta” estaria errado. “Meio” só varia quando significa **metade**: “meia hora”, “meia porção”.',
  },
  {
    id: 'qm-03',
    topicId,
    skillId: 'qm-gramatica-texto',
    difficulty: 3,
    type: 'multiple_choice',
    passage: INOVACAO,
    statement: 'Em qual trecho o “se” é **pronome apassivador**?',
    alternatives: [
      { id: 'A', text: '“Fala-se muito em inovação”', whyWrong: '“Falar” não tem objeto direto aqui (fala-se **em** algo): o “se” é **índice de indeterminação do sujeito**, com o verbo no singular.' },
      { id: 'B', text: '“Se a ideia é atender melhor”', whyWrong: 'É **conjunção condicional** (= caso a ideia seja atender melhor).' },
      { id: 'C', text: '“já se dedicam a isso”', whyWrong: 'O “se” acompanha o verbo **dedicar-se** e se refere ao próprio sujeito (“os servidores”): não há voz passiva nem sujeito paciente.' },
      { id: 'D', text: '“ainda se esperam mudanças maiores”' },
      { id: 'E', text: '“Resta saber se elas virão”', whyWrong: 'É **conjunção integrante**: introduz o que se quer saber (“saber **isso**”).' },
    ],
    correct: 'D',
    explanation: '“Esperar” é transitivo direto: “mudanças maiores **são esperadas**”. Verbo transitivo direto + se = **pronome apassivador**; “mudanças maiores” é o sujeito paciente — por isso o verbo vai ao plural (“esperam”).',
  },
  {
    id: 'qm-04',
    topicId,
    skillId: 'qm-gramatica-texto',
    difficulty: 2,
    type: 'true_false',
    statement: 'Em “O diretor considerou a proposta inviável.”, o termo “inviável” é adjunto adnominal de “proposta”.',
    correct: false,
    explanation: 'É **predicativo do objeto**: atribui uma qualidade ao objeto por meio do verbo. Teste: “O diretor considerou-**a** inviável” — o adjetivo fica fora do pronome. Se fosse adjunto, sumiria junto com o objeto.',
  },
  {
    id: 'qm-05',
    topicId,
    skillId: 'qm-gramatica-texto',
    difficulty: 2,
    type: 'multiple_choice',
    statement:
      'Considere as frases:\nI. “**Como** choveu a noite toda, o jogo foi adiado.”\nII. “O gramado ficou **como** um lamaçal.”\nIII. “A partida será remarcada **como** determina o regulamento.”\nO vocábulo “como” expressa, respectivamente, ideia de:',
    alternatives: [
      { id: 'A', text: 'comparação, causa e conformidade.', whyWrong: 'Em I, “como” = **porque** (causa anteposta); em II, é que há comparação (o gramado comparado a um lamaçal).' },
      { id: 'B', text: 'causa, comparação e conformidade.' },
      { id: 'C', text: 'causa, conformidade e comparação.', whyWrong: 'Inverte II e III: “ficou **como** um lamaçal” compara; “**como** determina o regulamento” = **conforme** determina.' },
      { id: 'D', text: 'conformidade, comparação e causa.', whyWrong: 'I não é conformidade (“**Porque** choveu…”), e III não é causa (“**conforme** determina o regulamento”).' },
      { id: 'E', text: 'causa, comparação e comparação.', whyWrong: 'Em III, “como” = **conforme**: a remarcação seguirá o regulamento (conformidade); não há comparação.' },
    ],
    correct: 'B',
    explanation: 'I: “**Porque** choveu…” → **causa**.\nII: “ficou **feito** um lamaçal” → **comparação**.\nIII: “**conforme** determina o regulamento” → **conformidade**.',
  },

  // ── Reescrita e correção ──
  {
    id: 'qm-06',
    topicId,
    skillId: 'qm-reescrita',
    difficulty: 1,
    type: 'true_false',
    statement: 'Reescrever “Os servidores obedecem às normas internas.” como “Os servidores respeitam às normas internas.” mantém a correção gramatical.',
    correct: false,
    explanation: '“Obedecer” pede preposição (obedecer **a**): “obedecem **às** normas”. “Respeitar” é transitivo direto: sem preposição, sobra só o artigo → “respeitam **as** normas internas”. O sentido se manteria; a correção, não.',
  },
  {
    id: 'qm-07',
    topicId,
    skillId: 'qm-reescrita',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale a reescrita de “Embora o prazo fosse curto, a equipe entregou o relatório.” que mantém **o sentido e a correção gramatical**.',
    alternatives: [
      { id: 'A', text: 'O prazo era curto; portanto, a equipe entregou o relatório.', whyWrong: 'Muda o sentido: “portanto” indica **conclusão**. A entrega viraria consequência do prazo curto, e não algo que ocorreu apesar dele.' },
      { id: 'B', text: 'Embora o prazo era curto, a equipe entregou o relatório.', whyWrong: '“Embora” exige **subjuntivo**: “fosse”, e não “era”.' },
      { id: 'C', text: 'Apesar do prazo curto a equipe, entregou o relatório.', whyWrong: 'Pontuação: a vírgula separa o sujeito (“a equipe”) do verbo (“entregou”). O correto seria “Apesar do prazo curto, a equipe entregou…”.' },
      { id: 'D', text: 'Conquanto o prazo fosse curto, a equipe entregaram o relatório.', whyWrong: '“Conquanto” mantém a concessão, mas o verbo deve concordar com “a equipe” (singular): “**entregou**”.' },
      { id: 'E', text: 'Apesar de o prazo ser curto, a equipe entregou o relatório.' },
    ],
    correct: 'E',
    explanation: '“Apesar de” + infinitivo mantém a **concessão** de “embora”, e o resto da frase não muda. Repare em “apesar **de o** prazo ser”: antes do sujeito de um infinitivo, a tradição gramatical recomenda não contrair a preposição com o artigo.',
  },
  {
    id: 'qm-08',
    topicId,
    skillId: 'qm-reescrita',
    difficulty: 2,
    type: 'true_false',
    statement: 'Em “Os candidatos que chegaram atrasados não puderam entrar.”, isolar “que chegaram atrasados” entre vírgulas manteria a correção gramatical e o sentido original.',
    correct: false,
    explanation: 'A correção se mantém, mas o sentido muda. Sem vírgulas, a oração é **restritiva**: só os atrasados ficaram de fora. Com vírgulas, vira **explicativa**: todos os candidatos chegaram atrasados, e nenhum entrou.',
  },
  {
    id: 'qm-09',
    topicId,
    skillId: 'qm-reescrita',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Assinale a reescrita de “Os prêmios foram entregues aos vencedores às 10h.” que **prejudica a correção gramatical**.',
    alternatives: [
      { id: 'A', text: 'Entregaram-se os prêmios aos vencedores às 10h.', whyWrong: 'Está correta: voz passiva sintética com o verbo no plural, concordando com o sujeito paciente “os prêmios”.' },
      { id: 'B', text: 'Às 10h, os prêmios foram entregues aos vencedores.', whyWrong: 'Está correta: o adjunto adverbial foi para o início, isolado por vírgula, e a crase de “às 10h” se mantém.' },
      { id: 'C', text: 'Os vencedores receberam os prêmios às 10h.', whyWrong: 'Está correta: voz ativa com “receber”, transitivo direto; o sentido se preserva.' },
      { id: 'D', text: 'Entregou-se os prêmios aos vencedores às 10h.' },
      { id: 'E', text: 'Os prêmios foram entregues às 10h aos vencedores.', whyWrong: 'Está correta: só mudou a ordem dos complementos, sem afetar nenhuma regra.' },
    ],
    correct: 'D',
    explanation: 'Na passiva sintética, “os prêmios” é o **sujeito paciente** (os prêmios foram entregues). O verbo concorda com ele: “Entrega**ram**-se os prêmios”. “Entregou-se os prêmios” é erro de concordância.',
  },
  {
    id: 'qm-10',
    topicId,
    skillId: 'qm-reescrita',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete a reescrita de “Faz dois anos que o concurso não abre vagas.” mantendo a correção e o sentido:',
    template: '___ dois anos que o concurso não abre vagas.',
    options: ['Há', 'A', 'Hão', 'Fazem'],
    correct: 'Há',
    explanation: 'Tempo **decorrido** → verbo **haver** (= faz). Nesse sentido, “haver” e “fazer” são **impessoais** e ficam no singular — “Hão” e “Fazem” estão errados. “A” indica tempo futuro ou distância: “daqui **a** dois anos”.',
  },

  // ── Pontuação, concordância e regência juntas ──
  {
    id: 'qm-11',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale a frase que está de acordo com a norma-padrão.',
    alternatives: [
      { id: 'A', text: 'Os relatórios do setor, foram entregues ontem.', whyWrong: 'Pontuação: a vírgula separa o sujeito (“Os relatórios do setor”) do verbo.' },
      { id: 'B', text: 'Haviam muitas pendências no processo.', whyWrong: 'Concordância: “haver” no sentido de existir é impessoal → “**Havia** muitas pendências”.' },
      { id: 'C', text: 'O gestor preferiu adiar a reunião a cancelá-la.' },
      { id: 'D', text: 'Me informaram o resultado ontem.', whyWrong: 'Colocação pronominal: na norma-padrão, não se inicia frase com pronome oblíquo átono → “Informaram-**me** o resultado ontem”.' },
      { id: 'E', text: 'Refiro-me à pessoas que faltaram.', whyWrong: 'Crase: “a” no singular antes de palavra no plural é só preposição → “Refiro-me **a** pessoas” (ou “**às** pessoas”, com artigo).' },
    ],
    correct: 'C',
    explanation: '“Preferir” pede **a** (preferir uma coisa **a** outra), sem “mais” nem “do que”. Repare que cada alternativa errada falha num assunto diferente: pontuação, concordância, colocação pronominal e crase.',
  },
  {
    id: 'qm-12',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    difficulty: 1,
    type: 'identify_error',
    statement: 'Toque no trecho que fere a norma-padrão.',
    segments: ['Os candidatos', 'aprovados', 'devem comparecer', 'à partir de', 'segunda-feira.'],
    correct: 3,
    explanation: '“Partir” é verbo, e verbo não aceita artigo: “**a partir de**”, sem crase. O resto está correto: “devem” concorda com “os candidatos”.',
  },
  {
    id: 'qm-13',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Assinale a frase que **desrespeita** a norma-padrão.',
    alternatives: [
      { id: 'A', text: 'Fazia anos que não se viam tantos candidatos.', whyWrong: 'Está correta: “fazer” indicando tempo é impessoal (singular), e “se viam” concorda com o sujeito paciente “tantos candidatos”.' },
      { id: 'B', text: 'Mais de um servidor faltou à reunião.', whyWrong: 'Está correta: com “mais de um”, o verbo fica, em regra, no singular; e “faltar **a**” + “a reunião” = “à reunião”.' },
      { id: 'C', text: 'Deve haver soluções para o problema.', whyWrong: 'Está correta: o auxiliar acompanha o “haver” impessoal e fica no singular.' },
      { id: 'D', text: 'Aspiramos a uma vaga no tribunal.', whyWrong: 'Está correta: “aspirar” (desejar) pede “a”, mas “uma” é artigo indefinido e não admite crase.' },
      { id: 'E', text: 'As certidões seguem anexo ao requerimento.' },
    ],
    correct: 'E',
    explanation: '“Anexo” é **adjetivo** e concorda com o termo a que se refere: “As certidões seguem **anexas** ao requerimento”. Invariável é só a locução “**em anexo**” — que, aliás, alguns gramáticos condenam (outros a aceitam).',
  },
  {
    id: 'qm-14',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    difficulty: 2,
    type: 'true_false',
    statement: 'Em “Precisa-se de técnicos qualificados.”, o verbo deveria ir para o plural, concordando com “técnicos”.',
    correct: false,
    explanation: '“Precisar **de**” é transitivo indireto. Com verbo transitivo indireto, o “se” é **índice de indeterminação do sujeito**, e o verbo fica no singular: “de técnicos qualificados” é objeto indireto, não sujeito. Compare: “Contrata**m**-se técnicos” (transitivo direto → passiva → plural).',
  },
  {
    id: 'qm-15',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    difficulty: 2,
    type: 'identify_error',
    statement: 'Toque no trecho que fere a norma-padrão.',
    segments: ['Informamos', 'aos interessados', 'que as inscrições', 'se encerra', 'amanhã.'],
    correct: 3,
    explanation: 'O sujeito de “encerrar-se” é “as inscrições” (plural): “as inscrições se **encerram** amanhã”. “Informar algo **a** alguém” está correto — o trecho de regência, que parece suspeito, é a isca.',
  },

  // ── Sentido e efeito de expressões ──
  {
    id: 'qm-16',
    topicId,
    skillId: 'qm-sentido',
    difficulty: 1,
    type: 'multiple_choice',
    statement: 'Em “Estudou pouco; **ainda assim**, foi aprovado.”, a expressão destacada pode ser substituída, sem alteração de sentido, por:',
    alternatives: [
      { id: 'A', text: 'por isso', whyWrong: 'Indica **conclusão**: a aprovação passaria a ser resultado de ter estudado pouco.' },
      { id: 'B', text: 'além disso', whyWrong: 'Indica **adição** e apaga o contraste entre estudar pouco e ser aprovado.' },
      { id: 'C', text: 'mesmo assim' },
      { id: 'D', text: 'isto é', whyWrong: 'Introduz **explicação ou retificação**; a segunda parte não explica a primeira.' },
      { id: 'E', text: 'por exemplo', whyWrong: 'Introduz **exemplificação**; a aprovação não é exemplo de ter estudado pouco.' },
    ],
    correct: 'C',
    explanation: '“Ainda assim” marca **oposição**: o fato (foi aprovado) contraria a expectativa criada (estudou pouco). “Mesmo assim” tem o mesmo valor, assim como “no entanto” e “contudo”.',
  },
  {
    id: 'qm-17',
    topicId,
    skillId: 'qm-sentido',
    difficulty: 1,
    type: 'multiple_choice',
    passage: ONIBUS,
    statement: 'No contexto, a fala de Paulo expressa:',
    alternatives: [
      { id: 'A', text: 'um elogio sincero ao serviço prestado.', whyWrong: 'Os fatos narrados (atraso, ar-condicionado quebrado, caminho errado) desmentem o elogio literal.' },
      { id: 'B', text: 'ironia, pois afirma o contrário do que a situação mostra.' },
      { id: 'C', text: 'dúvida sobre a qualidade da viagem.', whyWrong: 'Não há dúvida: a frase é exclamativa, e os fatos deixam claro que a viagem foi ruim.' },
      { id: 'D', text: 'a conclusão de que o conforto compensou o atraso.', whyWrong: 'Contradição: o ar-condicionado não funcionava; não houve conforto para compensar nada.' },
      { id: 'E', text: 'um pedido de desculpas à colega.', whyWrong: 'Nada na fala indica desculpa; é um comentário sobre a viagem.' },
    ],
    correct: 'B',
    explanation: '**Ironia** é dizer o contrário do que se pensa, com o contexto revelando a intenção. A frase literal é um elogio, mas tudo o que o texto narra aponta para uma viagem péssima.',
  },
  {
    id: 'qm-18',
    topicId,
    skillId: 'qm-sentido',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Em qual alternativa a substituição do termo destacado **altera** o sentido da frase?',
    alternatives: [
      { id: 'A', text: '“Saiu cedo **a fim de** evitar o trânsito.” → “Saiu cedo **para** evitar o trânsito.”', whyWrong: 'Mantém o sentido: as duas expressões indicam **finalidade**.' },
      { id: 'B', text: '“O prazo será reaberto **desde que** haja recurso.” → “O prazo será reaberto **já que** há recurso.”' },
      { id: 'C', text: '“**Conforme** o edital, a prova durará quatro horas.” → “**Segundo** o edital, a prova durará quatro horas.”', whyWrong: 'Mantém o sentido: as duas indicam **conformidade**.' },
      { id: 'D', text: '“**Como** não havia quórum, a sessão foi suspensa.” → “**Visto que** não havia quórum, a sessão foi suspensa.”', whyWrong: 'Mantém o sentido: “como” anteposto e “visto que” indicam **causa**.' },
      { id: 'E', text: '“Estava cansado; **contudo**, terminou o trabalho.” → “Estava cansado; **todavia**, terminou o trabalho.”', whyWrong: 'Mantém o sentido: os dois conectivos indicam **oposição**.' },
    ],
    correct: 'B',
    explanation: '“Desde que” + subjuntivo (“haja”) indica **condição**: o recurso é hipotético, e a reabertura depende dele. “Já que” + indicativo (“há”) indica **causa**: o recurso passa a ser um fato. A frase continua correta, mas o sentido muda.',
  },
  {
    id: 'qm-19',
    topicId,
    skillId: 'qm-sentido',
    difficulty: 2,
    type: 'true_false',
    statement: 'De “A empresa voltou a contratar estagiários.”, depreende-se que a empresa já havia contratado estagiários antes.',
    correct: true,
    explanation: '“Voltar a” **pressupõe** um fato anterior: só volta a contratar quem já contratou. O pressuposto resiste à negação — “A empresa **não** voltou a contratar estagiários” também indica contratações anteriores.',
  },
  {
    id: 'qm-20',
    topicId,
    skillId: 'qm-sentido',
    difficulty: 2,
    type: 'multiple_choice',
    passage: CRECHE,
    statement: 'No contexto, as aspas em “em fase avançada de planejamento” indicam que o autor:',
    alternatives: [
      { id: 'A', text: 'reproduz a fala do secretário e, pelo contraste com os fatos, sugere descrédito em relação a ela.' },
      { id: 'B', text: 'endossa a avaliação do secretário de que a obra está adiantada.', whyWrong: 'Contradição: o texto mostra o terreno vazio quatro meses depois do prazo; o autor não assume a fala como sua.' },
      { id: 'C', text: 'destaca uma expressão estrangeira.', whyWrong: 'Não há estrangeirismo: a expressão é toda em português. As aspas marcam a fala de outra pessoa.' },
      { id: 'D', text: 'corrige um erro gramatical cometido pelo secretário.', whyWrong: 'Não há erro na fala, e as aspas não indicam correção.' },
      { id: 'E', text: 'informa que a creche será entregue até o fim do ano.', whyWrong: 'Extrapolação: o texto não menciona nenhum novo prazo.' },
    ],
    correct: 'A',
    explanation: 'As aspas marcam as **palavras de outra pessoa**. Postas ao lado dos fatos — entrega prometida para junho, terreno vazio em outubro —, elas criam **distanciamento**: o autor reproduz a justificativa sem assumi-la e sugere que ela não convence.',
  },
];

export const flashcards: Flashcard[] = [
  // ── Gramática no texto ──
  {
    id: 'qm-f-01',
    topicId,
    skillId: 'qm-gramatica-texto',
    front: 'Questão de gramática no texto: o que ler primeiro?',
    back: '**O comando.** Depois, localize o trecho indicado e leia a **frase inteira** em volta.\nA classe ou a função depende do contexto, não da palavra isolada.',
  },
  {
    id: 'qm-f-02',
    topicId,
    skillId: 'qm-gramatica-texto',
    front: 'Como costumam cobrar gramática no texto em prova?',
    back: 'Destaca-se um termo do texto e pergunta-se sua **classe**, **função** ou **valor**: “o termo X exerce a função de…”, “o vocábulo ‘que’ retoma…”, “o ‘se’ indica…”.\nResolva testando substituições na própria frase.',
  },
  {
    id: 'qm-f-03',
    topicId,
    skillId: 'qm-gramatica-texto',
    front: 'Teste rápido: “que” pronome relativo ou conjunção integrante?',
    back: 'Cabe **o qual / a qual**? → relativo (retoma um nome).\nA oração vira **isso**? → integrante.\n“O livro **que** comprei” (o qual) × “Disse **que** viria” (disse isso).',
  },
  {
    id: 'qm-f-04',
    topicId,
    skillId: 'qm-gramatica-texto',
    front: 'Certo ou errado? _As vendas ficaram meias paradas no inverno._',
    back: '**Errado.** “Meio” = um pouco → **advérbio**, invariável: “ficaram **meio** paradas”.\nArmadilha que mistura classe e concordância: “meia” só quando é **metade** (“meia hora”).',
  },
  {
    id: 'qm-f-05',
    topicId,
    skillId: 'qm-gramatica-texto',
    front: 'Certo ou errado? Em _O gerente achou o relatório confuso_, “confuso” é adjunto adnominal.',
    back: '**Errado.** É **predicativo do objeto**.\nTeste: troque o objeto por pronome — “O gerente achou-**o** confuso”. O adjetivo sobra fora do pronome → predicativo.',
  },
  {
    id: 'qm-f-06',
    topicId,
    skillId: 'qm-gramatica-texto',
    front: 'Dê três valores diferentes do “se”.',
    back: '“**Se** chover, adio” → conjunção **condicional**.\n“Não sei **se** vou” → conjunção **integrante**.\n“Vendem-**se** casas” → **pronome apassivador** (casas são vendidas).',
  },

  // ── Reescrita e correção ──
  {
    id: 'qm-f-07',
    topicId,
    skillId: 'qm-reescrita',
    front: 'Reescrita: quais são as duas condições?',
    back: '**Correção gramatical** e **manutenção do sentido**.\nReescrita correta que muda o sentido está errada; reescrita que mantém o sentido com erro de crase também.',
  },
  {
    id: 'qm-f-08',
    topicId,
    skillId: 'qm-reescrita',
    front: 'Como costumam cobrar reescrita em prova?',
    back: '“A reescrita **manteria a correção e os sentidos** do texto?” (certo/errado) ou “assinale a reescrita **correta** / a que **prejudica** a correção”.\nCompare original e reescrita **trecho a trecho** e marque o que mudou.',
  },
  {
    id: 'qm-f-09',
    topicId,
    skillId: 'qm-reescrita',
    front: 'Armadilha que mistura assuntos: a reescrita trocou o verbo. O que mais pode quebrar?',
    back: 'A **regência** — e, com ela, a **crase**.\n“Obedecer **às** normas” → “respeitar **as** normas” (respeitar é transitivo direto). “Respeitar às normas” está errado.',
  },
  {
    id: 'qm-f-10',
    topicId,
    skillId: 'qm-reescrita',
    front: 'Certo ou errado? Pôr vírgulas em _Os servidores que aderiram à greve terão o ponto cortado_ mantém o sentido.',
    back: '**Errado.** Sem vírgulas, a oração é **restritiva**: só quem aderiu terá o ponto cortado.\nCom vírgulas, vira **explicativa**: todos aderiram. A frase continua correta, mas o sentido muda.',
  },
  {
    id: 'qm-f-11',
    topicId,
    skillId: 'qm-reescrita',
    front: 'Certo ou errado? _Embora a sala estava cheia, ninguém reclamou._',
    back: '**Errado.** “Embora” pede **subjuntivo**: “Embora a sala **estivesse** cheia”.\nCom “apesar de”, use infinitivo: “Apesar de a sala **estar** cheia”.',
  },
  {
    id: 'qm-f-12',
    topicId,
    skillId: 'qm-reescrita',
    front: 'Certo ou errado? _Divulgou-se os nomes dos aprovados._',
    back: '**Errado.** Passiva sintética: “os nomes” é o sujeito paciente (os nomes foram divulgados).\nCorreto: “Divulga**ram**-se os nomes dos aprovados”.',
  },

  // ── Pontuação, concordância e regência juntas ──
  {
    id: 'qm-f-13',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    front: '“Assinale a frase correta”, cada alternativa com um erro diferente: por onde começar?',
    back: 'Faça a **mesma varredura** em todas:\n1. vírgula entre sujeito e verbo\n2. concordância (sujeito posposto, haver, se)\n3. regência e crase\n4. colocação pronominal\n5. concordância nominal\nAchou um erro? Descarte e passe para a próxima.',
  },
  {
    id: 'qm-f-14',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    front: 'Como costumam cobrar pontuação, concordância e regência juntas em prova?',
    back: '“Assinale a alternativa **correta** / **incorreta** quanto à norma-padrão”, com frases em que cada erro é de um assunto diferente.\nO comando pode vir como “**exceto**” — leia duas vezes antes de marcar.',
  },
  {
    id: 'qm-f-15',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    front: 'Certo ou errado? _Os candidatos aprovados no concurso, tomarão posse em maio._',
    back: '**Errado.** A vírgula separa o **sujeito** do **verbo**.\nCorreto: “Os candidatos aprovados no concurso tomarão posse em maio.”',
  },
  {
    id: 'qm-f-16',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    front: 'Certo ou errado? _Tratam-se de casos graves._',
    back: '**Errado.** “Tratar **de**” é transitivo indireto: o **se** é índice de indeterminação do sujeito, e o verbo fica no **singular**.\nCorreto: “**Trata**-se de casos graves”. Compare: “Vende**m**-se casas” (transitivo direto → plural).',
  },
  {
    id: 'qm-f-17',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    front: 'Certo ou errado? _Seguem anexo as notas fiscais._',
    back: '**Errado.** Sem o “em”, “anexo” é **adjetivo** e concorda com o termo a que se refere: “Seguem **anexas** as notas fiscais”.\nA locução “**em anexo**” fica invariável (“Seguem em anexo as notas fiscais”), mas há gramáticos que a condenam; a forma adjetiva concordada é a mais segura.',
  },
  {
    id: 'qm-f-18',
    topicId,
    skillId: 'qm-pontuacao-concordancia',
    front: 'Armadilha do comando “incorreta”: como não cair?',
    back: 'Antes de começar, circule **incorreta / exceto / não**.\nAnote **C** ao lado das frases corretas; a resposta é a única que ficar sem C. Quem esquece o comando marca a primeira frase correta que encontra.',
  },

  // ── Sentido e efeito de expressões ──
  {
    id: 'qm-f-19',
    topicId,
    skillId: 'qm-sentido',
    front: 'Como costumam cobrar sentido e efeito de expressões em prova?',
    back: '“O termo X pode ser substituído, **sem alteração de sentido**, por…”, “a expressão X introduz ideia de…”, “o emprego das aspas indica…”, “depreende-se que…”.\nResponda pelo contexto, não pelo dicionário.',
  },
  {
    id: 'qm-f-20',
    topicId,
    skillId: 'qm-sentido',
    front: 'Conectivo trocado: qual é a pergunta-chave?',
    back: '**A relação lógica continua a mesma?**\nDentro da família, em geral, sim (contudo → todavia). Entre famílias, não: “**caso** chova” (condição) ≠ “**já que** chove” (causa).',
  },
  {
    id: 'qm-f-21',
    topicId,
    skillId: 'qm-sentido',
    front: 'Certo ou errado? De _O prefeito deixou de cobrar a taxa_, conclui-se que a taxa era cobrada antes.',
    back: '**Certo.** “Deixar de” **pressupõe** que o fato acontecia antes.\nO pressuposto resiste à negação: “O prefeito **não** deixou de cobrar a taxa” também indica que ela era cobrada.',
  },
  {
    id: 'qm-f-22',
    topicId,
    skillId: 'qm-sentido',
    front: 'Aspas numa fala que contrasta com os fatos: que efeito costumam ter?',
    back: 'Marcam a fala como **alheia** e, pelo contraste, sugerem **distanciamento** ou **ironia**.\nO autor reproduz as palavras sem assumi-las.',
  },
  {
    id: 'qm-f-23',
    topicId,
    skillId: 'qm-sentido',
    front: 'O que é ironia, em questão de prova?',
    back: 'Dizer o **contrário** do que se pensa, com o contexto revelando a intenção.\n“Excelente ideia!”, disse ao ver o colega estacionar sobre a calçada.',
  },
  {
    id: 'qm-f-24',
    topicId,
    skillId: 'qm-sentido',
    front: 'Certo ou errado? Em _Choveu; mesmo assim, o jogo aconteceu_, trocar “mesmo assim” por “portanto” mantém o sentido.',
    back: '**Errado.** “Mesmo assim” = **oposição**; “portanto” = **conclusão**.\nO jogo deixaria de acontecer “apesar da chuva” e passaria a acontecer “por causa da chuva”.',
  },
];
