import type { Flashcard, Lesson, Question } from '../../domain/types';

const topicId = 'concordancia-nominal';

export const lessons: Lesson[] = [
  {
    id: 'cn-l-regra-geral',
    topicId,
    skillId: 'cn-regra-geral',
    title: 'Adjetivo com um ou vários substantivos',
    summary:
      'Artigo, adjetivo, pronome e numeral concordam em **gênero e número** com o substantivo.\nCom **vários substantivos**, a posição decide: adjetivo **antes** → em regra, concorda com o mais próximo; adjetivo **depois** → com o mais próximo ou no plural (o masculino prevalece).',
    examples: [
      {
        sentence: 'Escolheu péssima hora e lugar.',
        breakdown: ['Adjetivo **antes** dos substantivos', 'Concorda com o mais próximo: péssima → hora', '“Péssimo lugar e hora” também estaria certo: aí o mais próximo é “lugar”'],
      },
      {
        sentence: 'Comprou um terno e uma gravata pretos. / … preta.',
        breakdown: ['Adjetivo **depois**: plural ou mais próximo', 'Plural com gêneros diferentes → masculino: pretos', '“preta” concorda só com “gravata” — e pode sugerir que só a gravata é preta'],
      },
      {
        sentence: 'O diretor e a secretária estavam cansados.',
        breakdown: ['Predicativo de sujeito composto (antes do verbo) → plural', 'Masculino + feminino → masculino plural: cansados'],
      },
    ],
    deepDive:
      'Divergência: com o adjetivo **posposto**, as gramáticas aceitam as duas concordâncias, mas vários autores recomendam o **plural** quando o adjetivo se refere a todos os substantivos, para evitar ambiguidade: “Estudou a língua e a literatura **portuguesas**” deixa claro que as duas são portuguesas.\n\nAntes de **nomes próprios** ou de **parentesco**, o adjetivo anteposto costuma ir ao plural: “os **simpáticos** Pedro e Paulo”, “os **queridos** tio e tia”.\n\nPredicativo **anteposto** ao sujeito composto: plural ou concordância com o mais próximo — “**Estavam abertas** a porta e a janela” / “**Estava aberta** a porta e a janela”.\n\nUm substantivo com vários adjetivos: “as línguas **inglesa e francesa**” ou “a língua **inglesa** e a **francesa**”.',
    tips: [
      {
        kind: 'cobranca',
        text: 'Em múltipla escolha, o formato mais comum é “assinale a frase correta (ou incorreta)” com um adjetivo **depois** de dois substantivos de gêneros diferentes. Lembre que **as duas** concordâncias (plural masculino ou mais próximo) são aceitas — a forma errada costuma ser o **plural feminino** (“terno e gravata **pretas**”).',
      },
      {
        kind: 'cobranca',
        text: 'Em certo/errado, é comum uma reescrita que muda o adjetivo de posição ou troca a ordem dos substantivos, perguntando se a correção é mantida. Refaça a análise na nova ordem: antes → mais próximo; depois → mais próximo ou plural.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado: concordar com o mais próximo pode mudar o **sentido**. Em “Comprou um terno e uma gravata **preta**”, pode-se entender que só a gravata é preta. Se a questão perguntar sobre sentido, é o plural que garante que o adjetivo se refere aos dois.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado com o **predicativo** (adjetivo ligado ao sujeito por verbo de ligação): com sujeito composto **antes** do verbo, ele vai ao plural — “A sala e o corredor **estavam limpos**” —, e não concorda só com o mais próximo.',
      },
      {
        kind: 'macete',
        text: 'Gêneros misturados + plural = **masculino**. Basta um masculino no meio de vários femininos: “mãe, tia e avô **preocupados**”.',
      },
    ],
  },
  {
    id: 'cn-l-variaveis',
    topicId,
    skillId: 'cn-variaveis',
    title: 'Anexo, obrigado, mesmo, quite: concordam',
    summary:
      '**Anexo**, **incluso**, **obrigado**, **mesmo**, **próprio**, **quite** e **leso** funcionam como adjetivos (ou pronomes adjetivos) e concordam com o termo a que se referem: “**anexas** as cópias”, “elas **mesmas**”, “estamos **quites**”.',
    examples: [
      {
        sentence: 'Seguem anexas as planilhas.',
        breakdown: ['O que segue anexo? → as planilhas (feminino plural)', 'anexo → **anexas**', 'Com a locução invariável: “Seguem **em anexo** as planilhas”'],
      },
      {
        sentence: '“Muito obrigada”, disse a candidata.',
        breakdown: ['“Obrigado” concorda com **quem agradece**', 'mulher → obrigada; homens → obrigados; mulheres → obrigadas'],
      },
      {
        sentence: 'Elas mesmas assinaram. / Elas assinaram mesmo.',
        breakdown: ['mesmas = próprias → reforço do pronome → concorda', 'mesmo = realmente, de fato → advérbio → invariável'],
      },
    ],
    deepDive:
      '**Quite** (= livre de dívida): “Estou **quite**”, “Estamos **quites**”.\n**Incluso**: “As taxas estão **inclusas**”.\n**Próprio** (= mesmo): “A **própria** diretora assinou”.\n**Leso** (= lesado, ofendido) concorda com o substantivo do composto: crime de **lesa**-pátria, de **lesa**-majestade.\n\nMesma lógica: **só** (= sozinho) varia — “Elas ficaram **sós**”; **só** (= somente) não varia — “**Só** elas ficaram”. **Junto** (= unido) varia — “Saíram **juntas**”; na locução **junto a/junto de**, não varia.\n\n“**Em anexo**” é locução invariável. Alguns manuais a condenam, mas ela é amplamente aceita.',
    tips: [
      {
        kind: 'cobranca',
        text: 'Em múltipla escolha e em lacunas, “anexo” aparece em frases de ofício e de e-mail: “Seguem **anexos** os documentos”, “Segue **anexa** a declaração”. Costuma vir com o verbo antes e o substantivo depois — localize o substantivo e faça a concordância.',
      },
      {
        kind: 'cobranca',
        text: 'Em certo/errado, é comum uma reescrita que troca “em anexo” por “anexo” (ou o contrário) e pergunta se a correção é mantida. “Em anexo” não varia; “anexo” sozinho tem de concordar: “Seguem **em anexo** as fotos” → “Seguem **anexas** as fotos”.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado com **mesmo** advérbio: em “As provas estavam **mesmo** difíceis” (= realmente), a palavra não varia. Só concorda o “mesmo” que equivale a **próprio**: “Elas **mesmas** corrigiram”.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado: “obrigado” concorda com quem **agradece**, não com quem ouve. Uma mulher que agradece a um homem diz “**obrigada**”.',
      },
      {
        kind: 'macete',
        text: 'Troque por **próprio**: se couber (“elas mesmas” → “elas próprias”), a palavra varia. Se couber **realmente** ou **de fato**, é advérbio e fica “mesmo”.',
      },
    ],
  },
  {
    id: 'cn-l-invariaveis',
    topicId,
    skillId: 'cn-invariaveis',
    title: 'Meio, bastante, menos: quando não variam',
    summary:
      'Se a palavra modifica **adjetivo, verbo ou advérbio**, é advérbio e **não varia**: “meio cansada”, “bastante atentos”. Se acompanha **substantivo**, varia: “meia pizza”, “bastantes motivos”.\n**Menos** nunca varia — “menas” não existe.',
    examples: [
      {
        sentence: 'Ela está meio cansada. / Comeu meia pizza.',
        breakdown: ['meio + adjetivo (= um pouco) → advérbio → **meio**', 'meia + substantivo (= metade) → numeral → concorda: **meia**'],
      },
      {
        sentence: 'Os candidatos estavam bastante preparados. / Havia bastantes candidatos.',
        breakdown: ['bastante + adjetivo → advérbio → invariável', 'bastantes + substantivo (= muitos) → varia', 'Teste: troque por “muito” → muito preparados / muitos candidatos'],
      },
      {
        sentence: 'Há menos vagas este ano.',
        breakdown: ['“Menos” não tem feminino nem plural', '“Menas” é erro em qualquer contexto'],
      },
    ],
    deepDive:
      '**Meio-dia e meia**: subentende-se “meia **hora**”, por isso “meia”.\n\n**Pseudo** é prefixo: não varia e se escreve junto — “os **pseudo**especialistas”, “as **pseudo**ciências”. (Hífen só antes de **h** ou **o**: “pseudo-herói”.)\n\n**Alerta**: a tradição gramatical o classifica como advérbio, invariável — “Os soldados estão **alerta**”. Atenção: o VOLP (ABL), dicionários atuais e autores como Cegalla também o registram como adjetivo, variável (“soldados **alertas**”), por isso há divergência — prefira “alerta” invariável em texto formal, mas não trate “alertas” como erro indiscutível. Como substantivo, varia normalmente: “Os **alertas** foram emitidos”.\n\nA mesma lógica vale para **caro/barato** (“As frutas **custam caro**” × “As frutas estão **caras**”) e **muito** (“**muito** cansadas” × “**muitas** pessoas”).',
    tips: [
      {
        kind: 'cobranca',
        text: 'Em lacunas e múltipla escolha, “meio” e “bastante” aparecem antes de **adjetivo feminino ou plural** para induzir a flexão: “estava ___ nervosa”, “ficaram ___ satisfeitos”. A resposta é a forma invariável: **meio**, **bastante**.',
      },
      {
        kind: 'cobranca',
        text: 'Em certo/errado, pode aparecer a afirmação de que “bastante” ou “meio” deveria ir ao plural (ou ao feminino) para concordar com um termo da frase. Veja a que palavra ele se liga: adjetivo, verbo ou advérbio → invariável; substantivo → varia.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado: “bastante” **varia** quando acompanha substantivo. “Havia **bastantes** motivos” está correto, mesmo soando estranho — marcar essa frase como errada é exatamente o tropeço esperado.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado com **meio-dia e meia**: “meio-dia e meio” está errado, porque a palavra subentendida é **hora** (feminina).',
      },
      {
        kind: 'macete',
        text: 'Troque por **muito**: se ficar “muito” (“muito cansadas”), use a forma invariável — **bastante** cansadas. Se ficar “muitos/muitas” (“muitos motivos”), **bastante** vai ao plural. Para “meio”: coube “um pouco” → advérbio (meio); coube “metade de” → numeral (meio/meia).',
      },
    ],
  },
  {
    id: 'cn-l-e-proibido',
    topicId,
    skillId: 'cn-e-proibido',
    title: '“É proibido” ou “é proibida”?',
    summary:
      'Com **é proibido, é necessário, é bom, é permitido**, olhe o substantivo: **sem determinante** (artigo, pronome), a expressão fica no **masculino singular** — “É proibido entrada”. **Com determinante**, concorda — “É proibid**a a** entrada”.',
    examples: [
      {
        sentence: 'É proibido entrada. / É proibida a entrada.',
        breakdown: ['Sem artigo → sentido genérico → invariável: proibido', 'Com o artigo “a” → concorda: proibida'],
      },
      {
        sentence: 'É necessário paciência. / É necessária muita paciência.',
        breakdown: ['Sem determinante → necessário', '“Muita” (pronome indefinido) determina o substantivo → necessária'],
      },
      {
        sentence: 'É proibido fumar.',
        breakdown: ['O sujeito é um verbo no infinitivo (uma oração)', 'Sujeito oracional → masculino singular'],
      },
    ],
    deepDive:
      'Determinantes que “ligam” a concordância: **artigo** (a, as, uma), **demonstrativo** (esta, essa), **possessivo** (sua, nossa) e **indefinido** (muita, pouca, alguma).\n“É necessária **sua** presença”, “**Esta** cerveja é **boa**”, “É **proibida a** venda”.\n\nCom determinante no plural, o verbo também vai ao plural: “**São proibidas as** visitas”.\n\nA regra vale com o adjetivo antes ou depois: “Cerveja é **bom**” × “**A** cerveja é **boa**”.',
    tips: [
      {
        kind: 'cobranca',
        text: 'Em múltipla escolha, a regra aparece em avisos e placas: “É proibido a entrada”, “É permitido a saída”. Procure **artigo ou pronome** antes do substantivo: se houver, a expressão tem de concordar.',
      },
      {
        kind: 'cobranca',
        text: 'Em certo/errado, é comum uma reescrita que **acrescenta ou retira o artigo** e pergunta se a correção é mantida. A concordância tem de acompanhar: com artigo → “É necessári**a a** atenção”; sem determinante → “É necessário atenção”.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado: determinante não é só artigo. **Muita, pouca, esta, sua** também ligam a concordância: “É necessária **muita** atenção”, “É necessária **sua** presença”.',
      },
      {
        kind: 'pegadinha',
        text: 'Cuidado com o **infinitivo**: em “É necessário **ter** paciência”, o sujeito é a oração “ter paciência”, então fica masculino singular — “paciência” é complemento de “ter”, não manda na concordância.',
      },
      {
        kind: 'macete',
        text: 'Olhe o que vem **antes** do substantivo: tem “a”, “esta”, “sua”, “muita”? → concorda (proibid**a**). Não tem nada? → masculino singular (proibid**o**).',
      },
    ],
  },
];

export const questions: Question[] = [
  // ── Regra geral ──
  {
    id: 'cn-01',
    topicId,
    skillId: 'cn-regra-geral',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete de acordo com a norma-padrão:',
    template: 'Comprei uma blusa e um casaco ___.',
    options: ['novos', 'novas'],
    correct: 'novos',
    explanation:
      'Adjetivo **depois** de substantivos de gêneros diferentes: no plural, prevalece o masculino → **novos**. (Também seria aceito “novo”, concordando com o mais próximo, “casaco”.) “Novas” está errado: o plural feminino não serve quando há um masculino.',
  },
  {
    id: 'cn-02',
    topicId,
    skillId: 'cn-regra-geral',
    difficulty: 1,
    type: 'true_false',
    statement: 'A frase “A sala e o corredor estavam limpos.” está correta quanto à concordância nominal.',
    correct: true,
    explanation: 'Predicativo de sujeito composto anteposto ao verbo → plural. Feminino + masculino → masculino plural: **limpos**.',
  },
  {
    id: 'cn-03',
    topicId,
    skillId: 'cn-regra-geral',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa em que a concordância nominal está **correta**.',
    alternatives: [
      { id: 'A', text: 'As provas do último concurso estavam difícil.', whyWrong: '“Difícil” se refere a “provas” (plural) → “estavam **difíceis**”.' },
      { id: 'B', text: 'A mãe e o filho ficaram preocupadas.', whyWrong: 'Sujeito com masculino e feminino → masculino plural: “**preocupados**”.' },
      { id: 'C', text: 'Escolheram péssima hora e local para a reunião.' },
      { id: 'D', text: 'Conheceu belas lugares e praias na viagem.', whyWrong: '“Belas” não concorda com o mais próximo, “lugares” (masculino), nem serviria como plural de todos (gêneros diferentes → masculino) → “**belos** lugares e praias”.' },
      { id: 'E', text: 'Comprou camisa e calça novo.', whyWrong: '“Novo” não concorda com nenhum dos substantivos (ambos femininos). Correto: “**nova**” (mais próximo) ou “**novas**” (plural).' },
    ],
    correct: 'C',
    explanation: 'Adjetivo **anteposto** a vários substantivos concorda com o mais próximo: “**péssima** hora e local”.',
  },
  {
    id: 'cn-04',
    topicId,
    skillId: 'cn-regra-geral',
    difficulty: 2,
    type: 'identify_error',
    statement: 'Toque no trecho com **erro de concordância nominal**.',
    segments: ['O diretor e a secretária', 'chegaram', 'ao evento', 'muito', 'animadas.'],
    correct: 4,
    explanation: 'Predicativo de sujeito composto com masculino e feminino → masculino plural: “chegaram muito **animados**”. (“Muito” é advérbio e não varia.)',
  },
  {
    id: 'cn-05',
    topicId,
    skillId: 'cn-regra-geral',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa em que a concordância nominal está **incorreta**.',
    alternatives: [
      { id: 'A', text: 'Comprou um terno e uma gravata pretos.', whyWrong: 'Está correta: adjetivo posposto no plural, com o masculino prevalecendo.' },
      { id: 'B', text: 'Comprou um terno e uma gravata preta.', whyWrong: 'Está correta: adjetivo posposto pode concordar com o mais próximo (“gravata”). Só o sentido muda — pode-se entender que só a gravata é preta.' },
      { id: 'C', text: 'Comprou uma gravata e um terno pretas.' },
      { id: 'D', text: 'Estavam fechadas a porta e a janela.', whyWrong: 'Está correta: predicativo anteposto ao sujeito composto pode ir ao plural (ou concordar com o mais próximo).' },
      { id: 'E', text: 'Ganhou belos presentes e flores.', whyWrong: 'Está correta: adjetivo anteposto concorda com o mais próximo, “presentes”.' },
    ],
    correct: 'C',
    explanation:
      'Adjetivo **depois** dos substantivos: concorda com o mais próximo (“terno **preto**”) ou vai ao plural com o masculino prevalecendo (“**pretos**”). O plural **feminino** “pretas” não concorda com nenhuma das opções.',
  },

  // ── Anexo, obrigado, mesmo, quite ──
  {
    id: 'cn-06',
    topicId,
    skillId: 'cn-variaveis',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete de acordo com a norma-padrão:',
    template: 'Seguem ___ as cópias dos documentos.',
    options: ['anexas', 'anexo'],
    correct: 'anexas',
    explanation: '“Anexo” é adjetivo e concorda com “cópias” (feminino plural): **anexas**. Para não flexionar, use a locução: “Seguem **em anexo** as cópias”.',
  },
  {
    id: 'cn-07',
    topicId,
    skillId: 'cn-variaveis',
    difficulty: 1,
    type: 'true_false',
    statement: 'Ao agradecer ao professor, a aluna disse: “Muito obrigado, professor.” Quanto à concordância, a fala dela segue a norma-padrão.',
    correct: false,
    explanation: '“Obrigado” concorda com **quem agradece**. Sendo uma mulher, o correto é “Muito **obrigada**”.',
  },
  {
    id: 'cn-08',
    topicId,
    skillId: 'cn-variaveis',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa em que a concordância nominal está **correta**.',
    alternatives: [
      { id: 'A', text: 'Segue anexo a planilha de custos.', whyWrong: '“Anexo” concorda com “planilha” → “Segue **anexa** a planilha” (ou “Segue **em anexo**”).' },
      { id: 'B', text: 'Agora estamos quite com a tesouraria.', whyWrong: '“Quite” é adjetivo e concorda com o sujeito (nós) → “estamos **quites**”.' },
      { id: 'C', text: 'As taxas estão incluso no preço.', whyWrong: '“Incluso” concorda com “taxas” → “estão **inclusas**”.' },
      { id: 'D', text: 'A própria diretora assinou os ofícios.' },
      { id: 'E', text: 'Foi acusado de crime de leso-pátria.', whyWrong: '“Leso” concorda com “pátria” (feminino) → “**lesa**-pátria”.' },
    ],
    correct: 'D',
    explanation: '“Próprio” (= mesmo) concorda com o substantivo a que se refere: “a **própria** diretora”.',
  },
  {
    id: 'cn-09',
    topicId,
    skillId: 'cn-variaveis',
    difficulty: 2,
    type: 'identify_error',
    statement: 'Toque no trecho com **erro de concordância nominal**.',
    segments: ['Os relatórios', 'seguem anexo', 'ao processo,', 'conforme', 'solicitado.'],
    correct: 1,
    explanation: '“Anexo” concorda com “relatórios” (masculino plural): “Os relatórios seguem **anexos** ao processo”.',
  },
  {
    id: 'cn-10',
    topicId,
    skillId: 'cn-variaveis',
    difficulty: 3,
    type: 'true_false',
    statement: 'Em “As provas estavam mesmo difíceis.”, a palavra “mesmo” deveria estar no feminino plural (“mesmas”), pois se refere a “provas”.',
    correct: false,
    explanation:
      'Aqui “mesmo” significa **realmente, de fato** e modifica o adjetivo “difíceis”: é advérbio, portanto invariável. Só varia o “mesmo” que equivale a “próprio”: “As provas **mesmas**” (= as próprias provas).',
  },

  // ── Meio, bastante, menos ──
  {
    id: 'cn-11',
    topicId,
    skillId: 'cn-invariaveis',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete de acordo com a norma-padrão:',
    template: 'A porta da sala estava ___ aberta.',
    options: ['meio', 'meia'],
    correct: 'meio',
    explanation: 'Antes do adjetivo “aberta”, “meio” significa **um pouco**: é advérbio e não varia — “**meio** aberta”.',
  },
  {
    id: 'cn-12',
    topicId,
    skillId: 'cn-invariaveis',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete de acordo com a norma-padrão:',
    template: 'Hoje há ___ pessoas na fila do que ontem.',
    options: ['menos', 'menas'],
    correct: 'menos',
    explanation: '“Menos” é invariável: “**menos** pessoas”. A forma “menas” não existe na norma-padrão.',
  },
  {
    id: 'cn-13',
    topicId,
    skillId: 'cn-invariaveis',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa em que a concordância nominal está **correta**.',
    alternatives: [
      { id: 'A', text: 'As candidatas ficaram bastantes nervosas.', whyWrong: 'Antes do adjetivo “nervosas”, “bastante” é advérbio → invariável: “**bastante** nervosas”.' },
      { id: 'B', text: 'A reunião começou ao meio-dia e meio.', whyWrong: 'Subentende-se “meia **hora**” → “meio-dia e **meia**”.' },
      { id: 'C', text: 'Havia bastantes motivos para a mudança.' },
      { id: 'D', text: 'Ela ficou meia preocupada com o resultado.', whyWrong: 'Antes do adjetivo, “meio” = um pouco → advérbio → “**meio** preocupada”.' },
      { id: 'E', text: 'Os pseudos especialistas deram entrevista.', whyWrong: '“Pseudo” é prefixo: não varia e se escreve junto → “os **pseudoespecialistas**”.' },
    ],
    correct: 'C',
    explanation: 'Antes de substantivo, “bastante” equivale a “muitos” e concorda: “**bastantes** motivos”.',
  },
  {
    id: 'cn-14',
    topicId,
    skillId: 'cn-invariaveis',
    difficulty: 2,
    type: 'identify_error',
    statement: 'Toque no trecho com **erro de concordância nominal**.',
    segments: ['As alunas', 'chegaram', 'meias', 'atrasadas', 'à aula.'],
    correct: 2,
    explanation: 'Antes do adjetivo “atrasadas”, “meio” significa “um pouco” e é advérbio, invariável: “chegaram **meio** atrasadas”.',
  },
  {
    id: 'cn-15',
    topicId,
    skillId: 'cn-invariaveis',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa em que **as duas** palavras destacadas estão empregadas de acordo com a norma-padrão.',
    alternatives: [
      { id: 'A', text: 'Leu **bastantes** livros e ficou **bastante** cansada.' },
      { id: 'B', text: 'Comeu **meia** pizza e ficou **meia** enjoada.', whyWrong: '“Meia pizza” está certo (numeral), mas antes do adjetivo “enjoada” o correto é “**meio** enjoada”.' },
      { id: 'C', text: 'Estavam **bastantes** atentos e **meio** calados.', whyWrong: '“Meio calados” está certo, mas antes do adjetivo “atentos” o correto é “**bastante** atentos”.' },
      { id: 'D', text: 'Havia **menas** vagas e **bastante** candidatos.', whyWrong: '“Menas” não existe (“**menos** vagas”), e antes de substantivo “bastante” varia (“**bastantes** candidatos”).' },
      { id: 'E', text: 'As crianças estavam **meio** sonolentas e **bastantes** agitadas.', whyWrong: '“Meio sonolentas” está certo, mas antes do adjetivo “agitadas” o correto é “**bastante** agitadas”.' },
    ],
    correct: 'A',
    explanation:
      'Antes de substantivo, “bastante” = muitos → varia (“**bastantes** livros”). Antes de adjetivo, é advérbio → invariável (“**bastante** cansada”). Teste: “muitos livros” / “muito cansada”.',
  },

  // ── É proibido, é necessário ──
  {
    id: 'cn-16',
    topicId,
    skillId: 'cn-e-proibido',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete de acordo com a norma-padrão:',
    template: 'É ___ a entrada de pessoas estranhas.',
    options: ['proibida', 'proibido'],
    correct: 'proibida',
    explanation: 'O substantivo “entrada” vem com o artigo “a” (determinante), então a expressão concorda: “É **proibida a** entrada”.',
  },
  {
    id: 'cn-17',
    topicId,
    skillId: 'cn-e-proibido',
    difficulty: 1,
    type: 'true_false',
    statement: 'A frase “É necessário paciência para estudar.” está correta quanto à concordância nominal.',
    correct: true,
    explanation: '“Paciência” vem sem determinante (sem artigo ou pronome), então a expressão fica no masculino singular: “É **necessário** paciência”.',
  },
  {
    id: 'cn-18',
    topicId,
    skillId: 'cn-e-proibido',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa em que a concordância nominal está **correta**.',
    alternatives: [
      { id: 'A', text: 'É proibido a entrada de animais.', whyWrong: 'Com o artigo “a”, a expressão concorda: “É **proibida a** entrada”.' },
      { id: 'B', text: 'É necessária muita atenção na prova.' },
      { id: 'C', text: 'É permitido a saída antecipada.', whyWrong: 'Com o artigo “a”, a expressão concorda: “É **permitida a** saída”.' },
      { id: 'D', text: 'Esta cerveja é bom.', whyWrong: 'O demonstrativo “esta” determina o substantivo → “Esta cerveja é **boa**”.' },
      { id: 'E', text: 'É necessária ter paciência.', whyWrong: 'O sujeito é a oração “ter paciência” → masculino singular: “É **necessário** ter paciência”.' },
    ],
    correct: 'B',
    explanation: '“Muita” (pronome indefinido) é determinante de “atenção”, então a expressão concorda: “É **necessária muita** atenção”.',
  },
  {
    id: 'cn-19',
    topicId,
    skillId: 'cn-e-proibido',
    difficulty: 2,
    type: 'identify_error',
    statement: 'Toque no trecho com **erro de concordância nominal**.',
    segments: ['Durante a prova,', 'é proibido', 'a consulta', 'a livros', 'e anotações.'],
    correct: 1,
    explanation: '“Consulta” vem com o artigo “a”, então a expressão concorda: “é **proibida a** consulta a livros e anotações”. O artigo “a” está bem flexionado; quem deixou de concordar foi “proibido”. (Sem o artigo, ficaria “é proibido consulta”.)',
  },
  {
    id: 'cn-20',
    topicId,
    skillId: 'cn-e-proibido',
    difficulty: 3,
    type: 'true_false',
    statement: 'Na frase “É necessária sua presença na reunião.”, a substituição de “necessária” por “necessário” manteria a correção gramatical.',
    correct: false,
    explanation:
      'O possessivo “sua” é determinante de “presença”, então a expressão tem de concordar: “É **necessária sua** presença”. Só ficaria “necessário” sem determinante: “É necessário presença”.',
  },
  {
    id: 'cn-21',
    topicId,
    skillId: 'cn-e-proibido',
    difficulty: 3,
    type: 'true_false',
    statement: 'Na frase “É proibido entrada de pessoas estranhas.”, o adjetivo deveria estar no feminino (“proibida”), já que “entrada” é substantivo feminino.',
    correct: false,
    explanation:
      'Sem determinante, “entrada” tem sentido genérico e a expressão fica no masculino singular: “É **proibido** entrada”. O feminino só seria exigido com determinante: “É **proibida a** entrada”.',
  },
];

export const flashcards: Flashcard[] = [
  // ── Regra geral ──
  {
    id: 'cn-f-01',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Qual é a regra geral da concordância nominal?',
    back: 'Artigo, adjetivo, pronome e numeral concordam em **gênero e número** com o substantivo a que se referem.\n“**As** provas **difíceis**”.',
  },
  {
    id: 'cn-f-02',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Adjetivo **antes** de vários substantivos: como concorda?',
    back: 'Com o **mais próximo**: “Escolheu **péssima** hora e lugar”.\nAntes de nomes próprios ou de parentesco, costuma ir ao plural: “os simpáticos Pedro e Paulo”.',
  },
  {
    id: 'cn-f-03',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Adjetivo **depois** de vários substantivos: como concorda?',
    back: 'Com o **mais próximo** ou no **plural** (o masculino prevalece).\n“terno e gravata **pretos**” / “terno e gravata **preta**”.\nVários gramáticos preferem o plural, que evita ambiguidade.',
  },
  {
    id: 'cn-f-04',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Certo ou errado? _Comprou um terno e uma gravata pretas._',
    back: '**Errado.** No plural, com gêneros diferentes, prevalece o masculino: “**pretos**”.\nTambém seria aceito “preta” (concordância com o mais próximo).',
  },
  {
    id: 'cn-f-05',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Certo ou errado? _A mãe e o filho estavam preocupados._',
    back: '**Certo.** Predicativo de sujeito composto → plural.\nMasculino + feminino → masculino: **preocupados**.',
  },
  {
    id: 'cn-f-06',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Complete: Estudou a língua e a literatura ___. (português)',
    back: '**Portuguesa** (mais próximo) ou **portuguesas** (plural) — as duas são aceitas.\nO plural deixa claro que as duas são portuguesas.',
  },
  {
    id: 'cn-f-07',
    topicId,
    skillId: 'cn-regra-geral',
    front: 'Como costumam cobrar a concordância com vários substantivos em prova?',
    back: 'Com adjetivo **depois** de substantivos de gêneros diferentes, em “assinale a correta/incorreta”.\nMais próximo ou plural masculino: as duas formas são aceitas. O erro típico é o plural **feminino**.',
  },

  // ── Anexo, obrigado, mesmo, quite ──
  {
    id: 'cn-f-08',
    topicId,
    skillId: 'cn-variaveis',
    front: 'Certo ou errado? _Segue anexo as cópias do contrato._',
    back: '**Errado.** “Anexo” é adjetivo e concorda com “cópias”; o verbo também vai ao plural: “Seguem **anexas** as cópias”.\nOu, com a locução invariável: “Seguem **em anexo** as cópias”.',
  },
  {
    id: 'cn-f-09',
    topicId,
    skillId: 'cn-variaveis',
    front: 'Uma mulher agradece: “Muito ___”.',
    back: '**Obrigada.** “Obrigado” concorda com **quem agradece**.\nHomens: obrigados; mulheres: obrigadas.',
  },
  {
    id: 'cn-f-10',
    topicId,
    skillId: 'cn-variaveis',
    front: '“Elas mesmas” ou “elas mesmo”?',
    back: '**Elas mesmas** (= elas próprias): reforço do pronome, concorda.\n“Mesmo” só fica invariável como advérbio (= realmente): “Elas assinaram **mesmo**”.',
  },
  {
    id: 'cn-f-11',
    topicId,
    skillId: 'cn-variaveis',
    front: 'Complete: Agora estamos ___ com a tesouraria. (quite)',
    back: '**Quites.** “Quite” é adjetivo e concorda: “Estou quite” / “Estamos quites”.',
  },
  {
    id: 'cn-f-12',
    topicId,
    skillId: 'cn-variaveis',
    front: 'Certo ou errado? _As despesas de viagem estão inclusas no pacote._',
    back: '**Certo.** “Incluso” é adjetivo e concorda com “despesas”: **inclusas**.',
  },
  {
    id: 'cn-f-13',
    topicId,
    skillId: 'cn-variaveis',
    front: 'Crime de “lesa-pátria” ou de “leso-pátria”?',
    back: '**Lesa-pátria.** “Leso” (= lesado, ofendido) concorda com o substantivo: lesa-pátria, lesa-majestade.',
  },
  {
    id: 'cn-f-14',
    topicId,
    skillId: 'cn-variaveis',
    front: '“Em anexo” varia?',
    back: 'Não. **Em anexo** é locução invariável: “Seguem **em anexo** as fotos”.\nSem o “em”, concorda: “Seguem **anexas** as fotos”.',
  },
  {
    id: 'cn-f-15',
    topicId,
    skillId: 'cn-variaveis',
    front: 'Como costumam cobrar “anexo” e “mesmo” em prova?',
    back: 'Anexo: frases de ofício com o verbo antes (“Segue ___ a planilha”) — localize o substantivo e concorde.\nMesmo: distinguir “elas **mesmas**” (= próprias) de “estava **mesmo** difícil” (= realmente).',
  },

  // ── Meio, bastante, menos ──
  {
    id: 'cn-f-16',
    topicId,
    skillId: 'cn-invariaveis',
    front: '“Meio cansada” ou “meia cansada”?',
    back: '**Meio cansada.** Antes de adjetivo, “meio” = um pouco → advérbio → invariável.\nAntes de substantivo, varia: “**meia** pizza”.',
  },
  {
    id: 'cn-f-17',
    topicId,
    skillId: 'cn-invariaveis',
    front: 'Certo ou errado? _A reunião começa ao meio-dia e meio._',
    back: '**Errado.** Subentende-se “meia **hora**”: “meio-dia e **meia**”.',
  },
  {
    id: 'cn-f-18',
    topicId,
    skillId: 'cn-invariaveis',
    front: 'Certo ou errado? _Havia bastantes motivos para recorrer._',
    back: '**Certo.** Antes de substantivo, “bastante” = muitos → varia: **bastantes** motivos.',
  },
  {
    id: 'cn-f-19',
    topicId,
    skillId: 'cn-invariaveis',
    front: 'Certo ou errado? _Elas estavam bastantes cansadas._',
    back: '**Errado.** Antes de adjetivo, “bastante” é advérbio → invariável: “**bastante** cansadas”.',
  },
  {
    id: 'cn-f-20',
    topicId,
    skillId: 'cn-invariaveis',
    front: '“Menos” ou “menas”?',
    back: '**Menos**, sempre. “Menas” não existe: “**menos** pessoas”, “**menos** vagas”.',
  },
  {
    id: 'cn-f-21',
    topicId,
    skillId: 'cn-invariaveis',
    front: 'Qual o teste rápido para “bastante”?',
    back: 'Troque por **muito**.\n“muito cansadas” (não varia) → **bastante** cansadas.\n“muitos motivos” (varia) → **bastantes** motivos.',
  },
  {
    id: 'cn-f-22',
    topicId,
    skillId: 'cn-invariaveis',
    front: 'Como fica “pseudo” + “especialistas”?',
    back: '**Pseudoespecialistas.** “Pseudo” é prefixo: não varia e se escreve junto.\nHífen só antes de **h** ou **o**: “pseudo-herói”.',
  },
  {
    id: 'cn-f-23',
    topicId,
    skillId: 'cn-invariaveis',
    front: 'Como costumam cobrar “meio” e “bastante” em prova?',
    back: 'Antes de adjetivo **feminino ou plural**, para induzir a flexão (“meia nervosa”, “bastantes atentos”).\nAntes de adjetivo: invariável. Antes de substantivo: varia.',
  },

  // ── É proibido, é necessário ──
  {
    id: 'cn-f-24',
    topicId,
    skillId: 'cn-e-proibido',
    front: '“É proibido a entrada” ou “É proibida a entrada”?',
    back: '**É proibida a entrada.** Com artigo, a expressão concorda com o substantivo.\nSem artigo: “É proibido entrada”.',
  },
  {
    id: 'cn-f-25',
    topicId,
    skillId: 'cn-e-proibido',
    front: 'Certo ou errado? _É necessário paciência._',
    back: '**Certo.** Sem determinante, a expressão fica no masculino singular.\nCom determinante: “É necessári**a a** paciência”.',
  },
  {
    id: 'cn-f-26',
    topicId,
    skillId: 'cn-e-proibido',
    front: 'Certo ou errado? _É necessário sua presença na reunião._',
    back: '**Errado.** O possessivo “sua” determina “presença”: “É **necessária** sua presença”.',
  },
  {
    id: 'cn-f-27',
    topicId,
    skillId: 'cn-e-proibido',
    front: '“É proibido fumar”: por que o masculino?',
    back: 'O sujeito é um **infinitivo** (uma oração), e sujeito oracional deixa a expressão no masculino singular.\n“É necessário **ter** paciência”.',
  },
  {
    id: 'cn-f-28',
    topicId,
    skillId: 'cn-e-proibido',
    front: 'Que palavras funcionam como determinante na regra do “é proibido”?',
    back: 'Artigo (a, uma), demonstrativo (esta, essa), possessivo (sua, nossa) e indefinido (muita, pouca).\nCom qualquer um deles, a expressão concorda.',
  },
  {
    id: 'cn-f-29',
    topicId,
    skillId: 'cn-e-proibido',
    front: 'Complete: São ___ as visitas após as 18h. (proibido)',
    back: '**Proibidas.** Com artigo no plural, tudo concorda: “**São proibidas as** visitas”.',
  },
  {
    id: 'cn-f-30',
    topicId,
    skillId: 'cn-e-proibido',
    front: 'Como costumam cobrar “é proibido / é necessário” em prova?',
    back: 'Avisos com artigo (“É proibido a entrada”) para ver se você exige a concordância.\nEm reescritas, acrescentam ou retiram o artigo: a concordância tem de acompanhar.',
  },
];
