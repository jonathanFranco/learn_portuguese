import type { Flashcard, Lesson, Question } from '../../domain/types';

const topicId = 'generos-textuais';

// Textos originais, curtos. Charges e tirinhas são descritas em texto (o app não tem imagens).
const GUIA =
  'Para quem visita Vila Serena, a Praça das Mangueiras é parada obrigatória. Árvores centenárias fazem sombra sobre bancos de ferro pintados de verde, e um coreto branco ocupa o centro do largo. Chegue cedo, antes do calor das onze horas. Leve água, use protetor solar e não deixe de provar o caldo de cana vendido na esquina.';

const NOTICIA =
  'A Prefeitura de Vila Serena começa nesta segunda-feira (14) a vacinação contra a gripe para pessoas com mais de 60 anos. Segundo a Secretaria de Saúde, 12 postos funcionarão das 8h às 17h, e é preciso apresentar documento com foto. A meta é imunizar 30 mil idosos até o fim do mês.';

const REPORTAGEM =
  'Em cinco anos, o número de feiras orgânicas na região metropolitana passou de 12 para 41, segundo levantamento da associação de produtores. O crescimento acompanha uma mudança de hábito: pesquisa da universidade estadual indica que 3 em cada 10 consumidores já preferem alimentos cultivados sem agrotóxicos. “No começo, eu vendia para os vizinhos; hoje tenho fila”, conta a agricultora Rosa Lima, que cultiva hortaliças há 20 anos.';

const TIRINHA =
  'Tirinha em três quadros.\nQuadro 1: na sala, o pai, irritado, diz ao filho, que está mexendo no celular: “Larga esse telefone e vem jantar com a família!”\nQuadro 2: o menino guarda o aparelho no bolso e vai para a mesa.\nQuadro 3: à mesa, o pai, a mãe e a irmã olham, cada um, a tela do próprio celular. O menino, sozinho, pensa: “Jantar em família…”';

const CHARGE =
  'Charge publicada em jornal: diante de um terreno vazio, um prefeito sorridente descerra, sob aplausos, uma placa nova: “Aqui será construído o hospital municipal”. Logo atrás dele, quase coberta pelo mato, aparece uma placa velha e enferrujada, com a mesma frase e a data de 2010.';

const ANUNCIO = '“Sua pele pede água. Dê a ela o que ela merece. Hidrata+: frescor que dura o dia inteiro. Experimente.”';

const CRONICA =
  'Na fila do banco, um senhor de chapéu me perguntou as horas. Respondi olhando o celular, e ele agradeceu com um sorriso de quem já sabia. Puxou conversa sobre a chuva, o preço do feijão, o neto que mora longe. Quando chegou a vez dele, despediu-se como se fôssemos velhos amigos. Saí pensando que talvez ele nem precisasse das horas: precisava de alguém que lhe desse uns minutos.';

const POEMA =
  'Minha mãe guardava botões\nem uma lata de biscoitos.\nNunca soube para quê.\n\nHoje, sozinho na cozinha,\nabro a lata\ne ouço chover lembranças.';

export const lessons: Lesson[] = [
  {
    id: 'gt-l-tipo-genero',
    topicId,
    skillId: 'gt-tipo-genero',
    title: 'Tipo × gênero',
    summary: '**Tipo textual** é o modo de organizar o texto: narrar, descrever, expor, argumentar, orientar. **Gênero textual** é o texto concreto que circula na sociedade, com finalidade, público e suporte próprios: notícia, receita, e-mail, conto.',
    examples: [
      {
        sentence: 'Receita de bolo',
        breakdown: [
          'Gênero: **receita culinária** (finalidade: ensinar a preparar um prato)',
          'Lista de ingredientes → caráter descritivo (o que é preciso)',
          'Modo de preparo → sequência **injuntiva** (“Misture”, “Asse por 40 minutos”)',
          'Tipo predominante: **injuntivo**',
        ],
      },
      {
        sentence: 'Notícia sobre um incêndio',
        breakdown: [
          'Gênero: **notícia** (informar um fato recente)',
          'Relato do que aconteceu → sequência **narrativa**',
          'Explicação das causas prováveis → trechos **expositivos**',
          'Um gênero, vários tipos: a prova pergunta pelo **predominante**',
        ],
      },
      {
        sentence: 'Artigo de opinião sobre o trânsito',
        breakdown: ['Gênero: **artigo de opinião**', 'Tese + argumentos + conclusão → tipo **argumentativo** (dissertativo-argumentativo)'],
      },
    ],
    deepDive:
      'Os tipos são **poucos** e definidos pela estrutura linguística (tempos verbais, conectivos, relações lógicas). Os gêneros são **muitos** — praticamente ilimitados — e definidos pela função social: quem escreve, para quem, com que objetivo e onde o texto circula (o **suporte**: jornal, site, embalagem, outdoor).\n\nA lista de tipos varia conforme o autor. A mais comum traz **narração**, **descrição**, **exposição**, **argumentação** e **injunção**; há quem acrescente o tipo dialogal (conversacional) e quem agrupe exposição e argumentação sob o nome “dissertação”.',
    tips: [
      { kind: 'cobranca', text: 'Em múltipla escolha, aparece como “o texto pertence ao gênero…”, “a finalidade principal do texto é…” ou “predomina no texto a sequência…”. No certo/errado, é comum afirmar que um texto “é predominantemente narrativo (ou injuntivo)” — confira a sequência que **domina** o texto, e não a de uma frase isolada.' },
      { kind: 'pegadinha', text: 'Cuidado com a troca de nomes: **narração**, **descrição** e **injunção** são **tipos**; **conto**, **notícia** e **receita** são **gêneros**. Alternativa como “o texto pertence ao gênero injunção” mistura as categorias. (Na teoria literária, “gênero narrativo, lírico e dramático” é outra classificação; em questões de tipologia, “narrativo” é tipo.)' },
      { kind: 'pegadinha', text: 'Cuidado: um gênero raramente tem um tipo só. A receita descreve (ingredientes) e orienta (preparo); a notícia narra e expõe. A questão quer o tipo **predominante** ou o do trecho indicado.' },
      { kind: 'macete', text: 'Pergunte **“para que serve este texto?”** → a resposta aponta o gênero (informar um fato = notícia; ensinar a fazer = receita, manual). Depois, **“como ele está organizado?”** → a resposta aponta o tipo (fatos em sequência = narração; orientações ao leitor = injunção).' },
    ],
  },
  {
    id: 'gt-l-jornalisticos',
    topicId,
    skillId: 'gt-jornalisticos',
    title: 'Notícia, reportagem e opinião',
    summary: 'Na esfera jornalística, **notícia** e **reportagem** informam; **editorial**, **artigo de opinião** e **carta do leitor** opinam. Muda a finalidade, quem fala e o grau de aprofundamento.',
    examples: [
      {
        sentence: '“Prefeitura amplia horário dos postos de saúde a partir de segunda.”',
        breakdown: [
          '**Notícia**: fato recente, de interesse público',
          'Título com verbo no presente, linguagem objetiva, 3ª pessoa',
          'Abertura (**lide**): o quê, quem, quando, onde — e, se possível, como e por quê',
        ],
      },
      {
        sentence: '“A ampliação do horário dos postos é bem-vinda, mas chega tarde.”',
        breakdown: [
          'Opinião sobre o fato → texto argumentativo',
          'Sem assinatura, em nome do jornal → **editorial**',
          'Assinado por um colunista ou especialista → **artigo de opinião**',
        ],
      },
      {
        sentence: '“Sobre a reportagem ‘Postos lotados’ (edição de 3/5): moro no bairro e confirmo o problema…” — Ana P., Recife (PE)',
        breakdown: ['O leitor se dirige ao veículo e comenta algo já publicado', 'Texto curto, identificado com nome e cidade → **carta do leitor**'],
      },
    ],
    deepDive:
      '**Notícia:** relata um fato recente; texto mais curto; costuma seguir a **pirâmide invertida** (o mais importante primeiro).\n**Reportagem:** aprofunda um tema; mais extensa; reúne dados, várias fontes, entrevistas e contexto; não depende de um fato do dia.\n**Editorial:** opinião **do veículo**; em regra sem assinatura; linguagem formal e impessoal.\n**Artigo de opinião:** opinião **do autor**, que assina o texto; pode usar a 1ª pessoa; as ideias são atribuídas a ele, não necessariamente ao veículo.\n**Carta do leitor:** texto do leitor enviado ao veículo, em geral reagindo a algo publicado (elogio, crítica, complemento, sugestão) ou a um tema em debate.',
    tips: [
      { kind: 'cobranca', text: 'É comum dar um trecho e pedir “o gênero a que o texto pertence” ou “a característica que o identifica”. No certo/errado, aparecem afirmações que misturam os gêneros de opinião, como “por ser um editorial, o texto expressa a opinião pessoal do autor que o assina”. Confira **quem fala** (o veículo, um autor ou um leitor) e **se há assinatura**.' },
      { kind: 'pegadinha', text: 'Cuidado com “a notícia é neutra”. Ela **busca** objetividade (3ª pessoa, linguagem referencial, citação de fontes), mas a escolha do fato, do título e das fontes já é uma seleção. Desconfie de item que afirme neutralidade **absoluta**; já “a notícia prioriza a informação, e não a opinião” está correto.' },
      { kind: 'pegadinha', text: 'Cuidado: números, dados e depoimentos não bastam para distinguir notícia de reportagem — os dois gêneros os usam. O que pesa é o **aprofundamento**: a reportagem investiga um tema, cruza fontes e contextualiza.' },
      { kind: 'macete', text: 'Duas perguntas resolvem a maioria das questões: **informa ou opina?** Se informa: fato pontual (notícia) ou tema aprofundado (reportagem)? Se opina: quem fala — o jornal (editorial), um autor que assina (artigo de opinião) ou um leitor (carta do leitor)?' },
    ],
  },
  {
    id: 'gt-l-cotidianos',
    topicId,
    skillId: 'gt-cotidianos',
    title: 'Charge, tirinha, anúncio e e-mail',
    summary: 'Gêneros do dia a dia, muitos combinando **linguagem verbal e não verbal**. **Charge** e **tirinha** usam humor, muitas vezes com crítica; **anúncio** persuade; **infográfico** explica com recursos visuais; **receita** e **manual** instruem; o **e-mail** comunica, do informal ao formal.',
    examples: [
      {
        sentence: 'Charge: sob aplausos, um prefeito inaugura a placa “Aqui será construído o hospital”; atrás dele, no mato, há uma placa enferrujada idêntica, datada de 2010.',
        breakdown: [
          'Fato da atualidade (promessa de obra) + exagero/caricatura',
          'Humor pelo **contraste** entre as duas placas',
          'Crítica implícita: promessas repetidas que não se cumprem',
          'Depende do contexto: fora da época, perde parte do sentido',
        ],
      },
      {
        sentence: 'Tirinha: o pai manda o filho largar o celular e vir jantar; no último quadro, a família inteira — inclusive o pai — está à mesa olhando o próprio celular.',
        breakdown: [
          'Narrativa curta em quadros, com desfecho',
          'Humor pela **quebra de expectativa** no último quadro',
          'Ironia: o pai faz o que criticou → crítica ao uso excessivo do celular',
        ],
      },
      {
        sentence: '“Sua pele pede água. Dê a ela o que ela merece.”',
        breakdown: [
          '**Anúncio publicitário**: finalidade de **persuadir**',
          'Imperativo (“Dê”) e possessivo que se refere a “você” (“Sua”) → apelo direto ao leitor',
          'Personificação (“a pele pede”) para chamar a atenção',
        ],
      },
    ],
    deepDive:
      '**Charge:** crítica humorística a um fato **atual** e específico; costuma usar caricatura.\n**Cartum:** humor sobre tema **universal**, sem depender de um fato do noticiário.\n**Tirinha:** narrativa curta em poucos quadros, muitas vezes com personagens fixos e desfecho inesperado.\n**Anúncio/propaganda:** persuade; imperativo, apelo ao leitor, slogan, jogos de palavras. Alguns autores reservam “publicidade” para produtos e serviços e “propaganda” para ideias e campanhas (como as de vacinação); no uso comum, os termos se misturam.\n**Infográfico:** combina texto, números e imagens (gráficos, mapas, ícones) para explicar um assunto de forma rápida.\n**Receita, manual e bula (nas partes de uso e posologia):** gêneros instrucionais; verbos no imperativo ou no infinitivo, passos em ordem.\n**E-mail:** gênero digital com campos fixos (destinatário, assunto); o registro vai do informal ao formal, conforme a situação.',
    tips: [
      { kind: 'cobranca', text: 'Com tirinhas e charges, os comandos mais comuns são “o humor da tirinha decorre…”, “a crítica presente na charge refere-se a…” e “a relação entre a linguagem verbal e a não verbal…”. A resposta costuma exigir que se **junte** fala e imagem: nenhuma das duas, isolada, explica o efeito.' },
      { kind: 'cobranca', text: 'Com anúncios, é comum perguntar a **finalidade** (persuadir, vender, conscientizar) ou o recurso que envolve o leitor (imperativo, “você”, duplo sentido). No certo/errado, aparece algo como “o emprego do imperativo indica que o texto é instrucional” — confira a finalidade antes de aceitar.' },
      { kind: 'pegadinha', text: 'Cuidado: **imperativo não define o gênero**. “Misture os ovos” (receita) orienta um procedimento; “Experimente o novo sabor” (anúncio) persuade. A forma verbal é a mesma; a finalidade é outra.' },
      { kind: 'pegadinha', text: 'Cuidado com charge × cartum: os dois usam humor gráfico, mas a charge está presa a um **fato da atualidade**, e o cartum trata de temas gerais. Também não reduza o humor a “piada”: em charges e tirinhas, ele costuma carregar uma **crítica**.' },
      { kind: 'macete', text: 'Na tirinha, olhe o **último quadro** e pergunte: o que ele contradiz ou revela sobre os anteriores? O humor — e a crítica — costuma estar nesse contraste.' },
    ],
  },
  {
    id: 'gt-l-literarios',
    topicId,
    skillId: 'gt-literarios',
    title: 'Crônica, conto e poema',
    summary: '**Crônica**: texto curto que parte do cotidiano, em geral em tom leve e reflexivo, tradicionalmente publicado em jornais e revistas. **Conto**: narrativa ficcional curta, concentrada em um conflito. **Poema**: em regra, texto em versos, com ritmo e, muitas vezes, linguagem figurada; no poema lírico, quem fala é o **eu lírico**.',
    examples: [
      {
        sentence: 'Na fila do banco, um senhor pede as horas e acaba conversando sobre a chuva e o neto. O cronista conclui: talvez ele não precisasse das horas, mas de alguém que lhe desse uns minutos.',
        breakdown: ['Fato banal do cotidiano', 'Linguagem leve, próxima da conversa, em 1ª pessoa', 'Reflexão a partir do episódio → **crônica**'],
      },
      {
        sentence: 'Presa num elevador durante uma noite, uma mulher precisa decidir se conta ao vizinho o segredo que guarda há anos.',
        breakdown: ['Narrativa ficcional curta', 'Poucas personagens, espaço e tempo reduzidos', 'Um conflito central que conduz ao desfecho → **conto**'],
      },
      {
        sentence: '“Minha mãe guardava botões / em uma lata de biscoitos.”',
        breakdown: ['Versos (a barra marca a quebra de linha)', 'Quem fala é o **eu lírico**, que não se confunde necessariamente com o autor', 'Sem rima e sem métrica regular (verso livre): também é poema'],
      },
    ],
    deepDive:
      '**Crônica:** a classificação divide os estudiosos — há quem a trate como gênero literário e há quem a situe na fronteira entre jornalismo e literatura. Pode ser narrativa, lírica, humorística ou mais argumentativa (crônica-comentário). Marcas típicas: cotidiano, brevidade, tom de conversa com o leitor, reflexão. Na prova, decida pelas marcas do texto, não por um rótulo único.\n\n**Conto:** tem narrador, personagens, enredo, tempo e espaço — como o romance, mas de forma concentrada. Em geral, a narrativa converge para um único conflito e um desfecho.\n\n**Poema × poesia:** **poema** é, em regra, o texto em versos (existe também o “poema em prosa”); **poesia** é a qualidade estética, que pode estar no poema, na prosa (“prosa poética”) e até numa imagem. Rima e métrica são recursos possíveis, não obrigatórios.',
    tips: [
      { kind: 'cobranca', text: 'É comum pedir a característica que identifica o gênero (“o texto pode ser classificado como crônica porque…”) ou o efeito de um recurso (“o tom de conversa aproxima o leitor”). Com poemas, as questões giram em torno do eu lírico, das figuras de linguagem e do sentido de versos; no certo/errado, aparecem afirmações sobre a **forma**, como “por não ter rimas, o texto não é poema” — item errado.' },
      { kind: 'pegadinha', text: 'Cuidado com **eu lírico = autor** e **narrador = autor**. Quem fala no poema é o eu lírico; quem conta a história é o narrador. Mesmo em 1ª pessoa, o texto não é necessariamente autobiográfico.' },
      { kind: 'pegadinha', text: 'Cuidado com rótulos absolutos para a crônica, como “a crônica é sempre narrativa” ou “a crônica é texto jornalístico, e não literário”. Há crônicas narrativas, líricas e argumentativas, e a classificação do gênero divide os estudiosos.' },
      { kind: 'macete', text: 'Pistas rápidas: **versos** → poema; **narrativa ficcional concentrada em um conflito** → conto; **episódio do cotidiano + tom de conversa + reflexão** → crônica.' },
    ],
  },
];

export const questions: Question[] = [
  // ── Tipo × gênero ──
  {
    id: 'gt-01',
    topicId,
    skillId: 'gt-tipo-genero',
    difficulty: 1,
    type: 'multiple_choice',
    statement: 'Assinale a alternativa que apresenta um **tipo** textual, e não um gênero.',
    alternatives: [
      { id: 'A', text: 'carta pessoal', whyWrong: 'Carta pessoal é gênero: texto concreto, com finalidade e interlocutores definidos.' },
      { id: 'B', text: 'bula de remédio', whyWrong: 'Bula é gênero (instrucional e expositivo), não tipo.' },
      { id: 'C', text: 'injunção' },
      { id: 'D', text: 'editorial', whyWrong: 'Editorial é gênero jornalístico; o tipo que nele predomina é o argumentativo.' },
      { id: 'E', text: 'crônica', whyWrong: 'Crônica é gênero; pode ser predominantemente narrativa, lírica ou argumentativa.' },
    ],
    correct: 'C',
    explanation: '**Injunção** é tipo textual: um modo de organizar o texto para orientar o leitor a agir (imperativo, passos). Carta, bula, editorial e crônica são gêneros.',
  },
  {
    id: 'gt-02',
    topicId,
    skillId: 'gt-tipo-genero',
    difficulty: 2,
    type: 'true_false',
    statement: 'Por apresentar uma lista de ingredientes, a receita culinária é um texto predominantemente descritivo.',
    correct: false,
    explanation: 'A lista de ingredientes tem caráter descritivo, mas o essencial da receita é o modo de preparo, que orienta o leitor a agir (“misture”, “asse”). O tipo **predominante** é o **injuntivo**.',
  },
  {
    id: 'gt-03',
    topicId,
    skillId: 'gt-tipo-genero',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete corretamente:',
    template: 'Notícia, bula e e-mail são exemplos de ___ textuais.',
    options: ['gêneros', 'tipos'],
    correct: 'gêneros',
    explanation: 'São textos concretos, com finalidade, público e suporte próprios: **gêneros**. Tipos são as sequências (narração, descrição, exposição, argumentação, injunção).',
  },
  {
    id: 'gt-04',
    topicId,
    skillId: 'gt-tipo-genero',
    difficulty: 3,
    type: 'multiple_choice',
    passage: GUIA,
    statement: 'Sobre esse trecho de guia turístico, é correto afirmar que:',
    alternatives: [
      { id: 'A', text: 'predomina a narração, pois o texto relata fatos passados em sequência.', whyWrong: 'Não há relato de fatos em sequência temporal; o texto descreve a praça e orienta o visitante.' },
      { id: 'B', text: 'combina descrição (da praça) e injunção (orientações ao visitante), o que mostra que um mesmo gênero pode reunir mais de um tipo textual.' },
      { id: 'C', text: 'pertence ao gênero injunção, pois emprega verbos no imperativo, como “Chegue” e “Leve”.', whyWrong: 'Injunção é **tipo**, não gênero. O gênero é o guia turístico; o imperativo marca a sequência injuntiva.' },
      { id: 'D', text: 'é dissertativo-argumentativo, pois defende uma tese com argumentos.', whyWrong: 'Não há tese sustentada por argumentos; há descrição do lugar e recomendações.' },
      { id: 'E', text: 'é exclusivamente descritivo, já que retrata as árvores, os bancos e o coreto.', whyWrong: 'Redução: a descrição existe, mas a segunda metade do texto é injuntiva (“Chegue”, “Leve”, “use”).' },
    ],
    correct: 'B',
    explanation: 'Depois de apresentar a praça como “parada obrigatória”, o texto a **descreve** (árvores centenárias, bancos verdes, coreto branco) e, nas últimas frases, **orienta** o leitor (“Chegue cedo”, “Leve água”). Gêneros costumam combinar tipos.',
  },
  {
    id: 'gt-05',
    topicId,
    skillId: 'gt-tipo-genero',
    difficulty: 1,
    type: 'multiple_choice',
    statement: 'Verbos no imperativo, passos em sequência e orientação ao leitor para que execute uma ação são marcas do tipo textual:',
    alternatives: [
      { id: 'A', text: 'narrativo', whyWrong: 'A narração conta fatos que se sucedem no tempo, em geral com verbos no pretérito.' },
      { id: 'B', text: 'descritivo', whyWrong: 'A descrição retrata seres, objetos e lugares (adjetivos, verbos de estado).' },
      { id: 'C', text: 'injuntivo' },
      { id: 'D', text: 'argumentativo', whyWrong: 'A argumentação defende uma tese com argumentos, não orienta passos.' },
      { id: 'E', text: 'expositivo', whyWrong: 'A exposição explica e informa sobre um assunto, sem dar ordens ao leitor.' },
    ],
    correct: 'C',
    explanation: 'O tipo **injuntivo** (ou instrucional) orienta o leitor a agir: é o que predomina em receitas, manuais e nas instruções de uso de bulas.',
  },

  // ── Gêneros jornalísticos ──
  {
    id: 'gt-06',
    topicId,
    skillId: 'gt-jornalisticos',
    difficulty: 1,
    type: 'multiple_choice',
    statement: 'O gênero jornalístico que expressa a opinião do próprio veículo, em regra sem assinatura de um autor, é o:',
    alternatives: [
      { id: 'A', text: 'editorial' },
      { id: 'B', text: 'artigo de opinião', whyWrong: 'O artigo de opinião é assinado e expressa a opinião do seu autor.' },
      { id: 'C', text: 'notícia', whyWrong: 'A notícia informa um fato; não tem como finalidade opinar.' },
      { id: 'D', text: 'carta do leitor', whyWrong: 'A carta do leitor expressa a opinião de um leitor, identificado pelo nome.' },
      { id: 'E', text: 'reportagem', whyWrong: 'A reportagem aprofunda um tema com dados e fontes; sua finalidade principal é informar.' },
    ],
    correct: 'A',
    explanation: 'O **editorial** fala em nome do jornal ou da revista. Por isso, em regra, não traz assinatura individual.',
  },
  {
    id: 'gt-07',
    topicId,
    skillId: 'gt-jornalisticos',
    difficulty: 2,
    type: 'multiple_choice',
    passage: NOTICIA,
    statement: 'O texto apresenta características de notícia, pois:',
    alternatives: [
      { id: 'A', text: 'defende a posição do jornal sobre a política de vacinação.', whyWrong: 'Não há opinião no texto; defender a posição do jornal seria próprio do editorial.' },
      { id: 'B', text: 'relata, com linguagem objetiva, um fato atual, informando logo no início o quê, quem, quando e onde.' },
      { id: 'C', text: 'narra uma história ficcional com personagens e conflito.', whyWrong: 'O fato é apresentado como real, sem personagens ficcionais nem conflito narrativo.' },
      { id: 'D', text: 'traz a opinião pessoal de um especialista que assina o texto.', whyWrong: 'Não há opinião nem assinatura; isso seria próprio do artigo de opinião.' },
      { id: 'E', text: 'comenta uma matéria publicada anteriormente pelo veículo.', whyWrong: 'Comentar matéria já publicada é próprio da carta do leitor.' },
    ],
    correct: 'B',
    explanation: 'O primeiro período funciona como **lide**: o quê (vacinação contra a gripe), quem (Prefeitura; maiores de 60 anos), quando (segunda-feira, 14), onde (Vila Serena). Linguagem objetiva, 3ª pessoa, fonte citada.',
  },
  {
    id: 'gt-08',
    topicId,
    skillId: 'gt-jornalisticos',
    difficulty: 2,
    type: 'true_false',
    statement: 'Diferentemente do editorial, o artigo de opinião é assinado, e as ideias nele defendidas são atribuídas ao seu autor, não necessariamente ao veículo que o publica.',
    correct: true,
    explanation: 'O **editorial** expressa a posição do veículo; o **artigo de opinião** expressa a posição de quem o assina. É comum o jornal publicar artigos com opiniões das quais discorda.',
  },
  {
    id: 'gt-09',
    topicId,
    skillId: 'gt-jornalisticos',
    difficulty: 3,
    type: 'multiple_choice',
    passage: REPORTAGEM,
    statement: 'O trecho apresenta características de **reportagem**, e não de simples notícia, principalmente porque:',
    alternatives: [
      { id: 'A', text: 'é escrito em 3ª pessoa.', whyWrong: 'A notícia também é escrita em 3ª pessoa; esse traço não distingue os dois gêneros.' },
      { id: 'B', text: 'apresenta números e porcentagens.', whyWrong: 'Notícias também trazem números. Isolado, o dado não distingue os gêneros.' },
      { id: 'C', text: 'aprofunda um fenômeno observado ao longo de anos, cruzando dados de fontes diferentes com o depoimento de uma pessoa envolvida.' },
      { id: 'D', text: 'relata um acontecimento pontual do dia, de forma breve.', whyWrong: 'Não há um acontecimento pontual: o texto trata de uma tendência de cinco anos.' },
      { id: 'E', text: 'expressa a opinião do jornal sobre o consumo de orgânicos.', whyWrong: 'O texto não opina; apresenta dados e um depoimento.' },
    ],
    correct: 'C',
    explanation: 'A reportagem se distingue pelo **aprofundamento**: o texto trata de um tema (o crescimento das feiras orgânicas), e não de um fato isolado, e reúne um levantamento, uma pesquisa e um depoimento. Terceira pessoa e números aparecem nos dois gêneros.',
  },
  {
    id: 'gt-10',
    topicId,
    skillId: 'gt-jornalisticos',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete corretamente:',
    template: 'Na notícia, a abertura que responde logo de início a o quê, quem, quando e onde se chama ___.',
    options: ['lide', 'manchete', 'editorial', 'legenda'],
    correct: 'lide',
    explanation: 'O **lide** (do inglês _lead_) é a abertura da notícia, em geral o primeiro parágrafo. A manchete é o título principal; a legenda acompanha a foto.',
  },

  // ── Charge, tirinha, anúncio e e-mail ──
  {
    id: 'gt-11',
    topicId,
    skillId: 'gt-cotidianos',
    difficulty: 1,
    type: 'multiple_choice',
    statement: 'O gênero que faz crítica humorística a um fato da atualidade, geralmente com desenho caricatural, é a/o:',
    alternatives: [
      { id: 'A', text: 'cartum', whyWrong: 'O cartum também usa humor gráfico, mas trata de temas universais, sem depender de um fato específico do noticiário.' },
      { id: 'B', text: 'charge' },
      { id: 'C', text: 'infográfico', whyWrong: 'O infográfico explica informações com recursos visuais; não tem finalidade humorística.' },
      { id: 'D', text: 'anúncio', whyWrong: 'O anúncio busca persuadir o leitor, em geral a consumir algo.' },
      { id: 'E', text: 'e-mail', whyWrong: 'O e-mail é um gênero de correspondência digital, não de crítica humorística.' },
    ],
    correct: 'B',
    explanation: 'A **charge** está presa a um fato do momento (político, social) e o critica pelo humor. Por isso, fora do contexto, ela perde parte do sentido.',
  },
  {
    id: 'gt-12',
    topicId,
    skillId: 'gt-cotidianos',
    difficulty: 2,
    type: 'multiple_choice',
    passage: TIRINHA,
    statement: 'O humor da tirinha decorre principalmente:',
    alternatives: [
      { id: 'A', text: 'do emprego de linguagem formal em uma situação familiar.', whyWrong: 'A fala do pai é informal (“Larga”, “vem”); não há contraste de registro.' },
      { id: 'B', text: 'da desobediência do menino à ordem do pai.', whyWrong: 'O menino obedece: guarda o celular e vai para a mesa.' },
      { id: 'C', text: 'da contradição entre a cobrança do pai e a atitude da família, incluindo a dele, no último quadro.' },
      { id: 'D', text: 'de uma crítica à comida servida no jantar.', whyWrong: 'Nada na tirinha se refere à comida.' },
      { id: 'E', text: 'da ausência de linguagem verbal, que obriga o leitor a imaginar as falas.', whyWrong: 'Há linguagem verbal: a fala do pai e o pensamento do menino.' },
    ],
    correct: 'C',
    explanation: 'Quebra de expectativa: o pai cobra a presença do filho “com a família”, mas, no último quadro, ele próprio está no celular. O pensamento irônico do menino (“Jantar em família…”) critica o uso excessivo do aparelho.',
  },
  {
    id: 'gt-13',
    topicId,
    skillId: 'gt-cotidianos',
    difficulty: 2,
    type: 'true_false',
    passage: CHARGE,
    statement: 'A charge sugere uma crítica a promessas de obras públicas que são anunciadas repetidamente sem sair do papel.',
    correct: true,
    explanation: 'O contraste entre a placa nova, celebrada com aplausos, e a placa idêntica de 2010, abandonada no mato, revela que a mesma promessa já havia sido feita e não foi cumprida. O humor vem da ironia da cena.',
  },
  {
    id: 'gt-14',
    topicId,
    skillId: 'gt-cotidianos',
    difficulty: 3,
    type: 'multiple_choice',
    passage: ANUNCIO,
    statement: 'Sobre o texto, é correto afirmar:',
    alternatives: [
      { id: 'A', text: 'É um texto instrucional, pois o imperativo indica os passos de um procedimento.', whyWrong: 'O imperativo aqui não orienta um procedimento; serve para persuadir o leitor a consumir o produto.' },
      { id: 'B', text: 'É uma notícia, pois informa o lançamento de um produto.', whyWrong: 'Não há relato objetivo de fato; o texto busca convencer o leitor.' },
      { id: 'C', text: 'Predomina a linguagem objetiva e denotativa, sem apelo ao leitor.', whyWrong: 'Há apelo direto (“Sua”, “Dê”, “Experimente”) e linguagem figurada (“Sua pele pede”).' },
      { id: 'D', text: 'O imperativo e o possessivo “Sua” dirigem-se ao leitor, recurso típico do anúncio, cuja finalidade é persuadir.' },
      { id: 'E', text: 'É um texto argumentativo do gênero editorial, pois defende uma tese.', whyWrong: 'Editorial é opinião do veículo sobre um tema público; aqui há promoção de um produto.' },
    ],
    correct: 'D',
    explanation: 'O texto fala diretamente com o leitor (“Sua pele”, “Dê”, “Experimente”) para levá-lo a comprar: é um **anúncio publicitário**. O imperativo, sozinho, não define o gênero — a finalidade, sim.',
  },
  {
    id: 'gt-15',
    topicId,
    skillId: 'gt-cotidianos',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete corretamente:',
    template: 'O ___ combina texto verbal e recursos visuais, como gráficos, mapas e ícones, para apresentar informações de forma sintética.',
    options: ['infográfico', 'editorial', 'conto', 'cartum'],
    correct: 'infográfico',
    explanation: 'O **infográfico** tem finalidade expositiva: explicar um assunto de modo rápido, unindo palavras, números e imagens.',
  },
  {
    id: 'gt-16',
    topicId,
    skillId: 'gt-cotidianos',
    difficulty: 2,
    type: 'true_false',
    statement: 'Por ser um gênero digital, o e-mail dispensa, em qualquer situação, as convenções da escrita formal.',
    correct: false,
    explanation: 'O registro do e-mail depende da situação. Um e-mail a um órgão público ou a um cliente pede vocativo adequado, linguagem formal e norma-padrão; entre amigos, cabe a informalidade.',
  },

  // ── Crônica, conto e poema ──
  {
    id: 'gt-17',
    topicId,
    skillId: 'gt-literarios',
    difficulty: 1,
    type: 'multiple_choice',
    statement: 'Narrativa ficcional curta, com poucas personagens, tempo e espaço reduzidos e um conflito central que conduz ao desfecho. Essa descrição corresponde ao:',
    alternatives: [
      { id: 'A', text: 'romance', whyWrong: 'O romance é narrativa longa, em geral com vários conflitos, núcleos e personagens.' },
      { id: 'B', text: 'conto' },
      { id: 'C', text: 'poema', whyWrong: 'O poema é organizado em versos; não se define pela estrutura narrativa.' },
      { id: 'D', text: 'editorial', whyWrong: 'O editorial é texto opinativo do jornal, não narrativa ficcional.' },
      { id: 'E', text: 'lide', whyWrong: 'O lide é a abertura da notícia, que relata fatos reais.' },
    ],
    correct: 'B',
    explanation: 'Concentração é a marca do **conto**: poucas personagens, tempo e espaço reduzidos e a narrativa convergindo para um conflito e seu desfecho.',
  },
  {
    id: 'gt-18',
    topicId,
    skillId: 'gt-literarios',
    difficulty: 1,
    type: 'true_false',
    statement: 'Um texto escrito em versos livres, sem rima e sem métrica regular, não pode ser classificado como poema.',
    correct: false,
    explanation: 'Rima e métrica são recursos possíveis, não obrigatórios. O **verso livre** é comum na poesia moderna, e o texto continua sendo poema.',
  },
  {
    id: 'gt-19',
    topicId,
    skillId: 'gt-literarios',
    difficulty: 2,
    type: 'multiple_choice',
    passage: CRONICA,
    statement: 'O texto apresenta características de crônica, entre as quais:',
    alternatives: [
      { id: 'A', text: 'o relato objetivo de um fato de interesse público, organizado a partir do lide.', whyWrong: 'Isso caracteriza a notícia. O episódio é banal e narrado em 1ª pessoa, com subjetividade.' },
      { id: 'B', text: 'a organização em versos e estrofes.', whyWrong: 'O texto está em prosa, em parágrafo corrido.' },
      { id: 'C', text: 'a partida de um episódio banal do cotidiano para uma reflexão, em linguagem leve e próxima da conversa.' },
      { id: 'D', text: 'a defesa da opinião do jornal sobre o atendimento bancário.', whyWrong: 'Não há crítica ao banco nem fala em nome do veículo.' },
      { id: 'E', text: 'a orientação ao leitor para que execute uma sequência de passos.', whyWrong: 'Não há instruções; o texto narra e reflete.' },
    ],
    correct: 'C',
    explanation: 'Um encontro rápido na fila do banco vira reflexão sobre solidão e atenção ao outro, fechada com o jogo entre “horas” e “minutos”. Cotidiano, tom de conversa e reflexão são marcas da **crônica**.',
  },
  {
    id: 'gt-20',
    topicId,
    skillId: 'gt-literarios',
    difficulty: 2,
    type: 'fill_blank',
    statement: 'Complete corretamente:',
    template: 'No poema, a voz que se expressa é chamada de ___ e não se confunde necessariamente com o autor.',
    options: ['eu lírico', 'narrador', 'interlocutor', 'lide'],
    correct: 'eu lírico',
    explanation: 'No poema, quem fala é o **eu lírico** (ou eu poético). **Narrador** é quem conta a história em textos narrativos, como o conto e o romance.',
  },
  {
    id: 'gt-21',
    topicId,
    skillId: 'gt-literarios',
    difficulty: 3,
    type: 'multiple_choice',
    passage: POEMA,
    statement: 'Sobre o texto, é correto afirmar:',
    alternatives: [
      { id: 'A', text: 'Não pode ser considerado poema, pois não apresenta rimas nem métrica regular.', whyWrong: 'Rima e métrica não são obrigatórias: o texto é escrito em versos livres.' },
      { id: 'B', text: 'É um conto, pois apresenta personagens e uma sequência de ações.', whyWrong: 'Há traços narrativos, mas não há enredo com conflito e desfecho; a organização em versos e a linguagem figurada o caracterizam como poema.' },
      { id: 'C', text: 'O “eu” que fala no texto deve ser identificado com o autor, pois todo poema em 1ª pessoa é autobiográfico.', whyWrong: 'Quem fala é o eu lírico, que não se confunde necessariamente com o autor.' },
      { id: 'D', text: 'Predomina a injunção, pois o texto orienta o leitor a guardar suas lembranças.', whyWrong: 'Não há orientação ao leitor nem verbos no imperativo.' },
      { id: 'E', text: 'Organiza-se em versos e estrofes e emprega linguagem figurada, como em “ouço chover lembranças”.' },
    ],
    correct: 'E',
    explanation: 'Seis versos em duas estrofes, sem rima e sem métrica regular (versos livres), com imagem figurada no fim: as lembranças “chovem” e são “ouvidas”. Traços de **poema**.',
  },
];

export const flashcards: Flashcard[] = [
  // ── Tipo × gênero ──
  {
    id: 'gt-f-01',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Diferença entre tipo e gênero textual?',
    back: '**Tipo:** modo de organizar o texto; são poucos (narração, descrição, exposição, argumentação, injunção).\n**Gênero:** texto concreto, definido pela função social; são inúmeros (notícia, receita, e-mail, conto).',
  },
  {
    id: 'gt-f-02',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Certo ou errado? _Injunção é um gênero textual._',
    back: '**Errado.** Injunção é **tipo**. Receita, manual e bula são gêneros em que a injunção aparece ou predomina.',
  },
  {
    id: 'gt-f-03',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Quais critérios definem um gênero textual?',
    back: '**Finalidade**, **interlocutores** (quem escreve e para quem), **suporte** (onde circula) e estrutura e estilo típicos.',
  },
  {
    id: 'gt-f-04',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Certo ou errado? _Cada gênero emprega um único tipo textual._',
    back: '**Errado.** Gêneros combinam sequências: a receita descreve (ingredientes) e orienta (preparo).\nA prova pergunta pelo tipo **predominante**.',
  },
  {
    id: 'gt-f-05',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Marcas linguísticas típicas de cada tipo?',
    back: '**Narração:** ações em sequência, pretérito, marcadores de tempo.\n**Descrição:** adjetivos, verbos de estado.\n**Exposição:** definições, presente atemporal.\n**Argumentação:** tese, argumentos, conectivos.\n**Injunção:** imperativo ou infinitivo, passos.',
  },
  {
    id: 'gt-f-06',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Que tipo textual predomina na receita culinária?',
    back: '**Injuntivo.** O modo de preparo orienta o leitor a agir (“misture”, “asse”).\nA lista de ingredientes é descritiva, mas não domina o texto.',
  },
  {
    id: 'gt-f-07',
    topicId,
    skillId: 'gt-tipo-genero',
    front: 'Como costumam cobrar tipo × gênero em prova?',
    back: '“O texto pertence ao gênero…”, “predomina a sequência…”, “a finalidade do texto é…”.\nAche primeiro a **finalidade** (gênero); depois, a **organização** que domina (tipo).',
  },

  // ── Gêneros jornalísticos ──
  {
    id: 'gt-f-08',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'Notícia × reportagem?',
    back: '**Notícia:** fato recente e pontual, texto mais curto, lide.\n**Reportagem:** aprofunda um tema, cruza fontes, dados e entrevistas.\nAs duas informam; muda o grau de aprofundamento.',
  },
  {
    id: 'gt-f-09',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'Editorial × artigo de opinião?',
    back: '**Editorial:** opinião do **veículo**, em regra sem assinatura.\n**Artigo de opinião:** opinião do **autor**, que assina o texto.',
  },
  {
    id: 'gt-f-10',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'O que é o lide?',
    back: '**Abertura da notícia** (em geral, o 1º parágrafo) que responde logo de início a o quê, quem, quando, onde — e, se possível, como e por quê.',
  },
  {
    id: 'gt-f-11',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'Certo ou errado? _A notícia é um texto absolutamente neutro._',
    back: '**Errado.** A notícia **busca** objetividade (3ª pessoa, fontes, linguagem referencial), mas a escolha do fato, do título e das fontes já é uma seleção.',
  },
  {
    id: 'gt-f-12',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'Qual a finalidade da carta do leitor?',
    back: '**Em geral, reagir a algo publicado:** elogiar, criticar, corrigir ou complementar (pode também opinar sobre um tema em debate).\nMarcas: referência à matéria, texto curto, identificação (nome e cidade).',
  },
  {
    id: 'gt-f-13',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'Certo ou errado? _O editorial expressa a opinião pessoal de quem o assina._',
    back: '**Errado.** O editorial expressa a posição **do veículo** e, em regra, não tem assinatura. Opinião assinada é artigo de opinião.',
  },
  {
    id: 'gt-f-14',
    topicId,
    skillId: 'gt-jornalisticos',
    front: 'Como costumam cobrar gêneros jornalísticos em prova?',
    back: 'Dão um trecho e pedem o gênero ou a marca que o identifica.\nPergunte: **informa ou opina?** Se opina, **quem fala** — o jornal, um autor ou um leitor?',
  },

  // ── Charge, tirinha, anúncio e e-mail ──
  {
    id: 'gt-f-15',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'Charge × cartum?',
    back: '**Charge:** critica com humor um **fato atual** e específico; perde sentido fora do contexto.\n**Cartum:** humor sobre tema **universal**, atemporal.',
  },
  {
    id: 'gt-f-16',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'De onde costuma vir o humor da tirinha?',
    back: 'Da **quebra de expectativa**, em geral no último quadro: contraste entre fala e imagem, ou entre o que se diz e o que se faz.\nMuitas vezes, o humor carrega uma crítica.',
  },
  {
    id: 'gt-f-17',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'Certo ou errado? _Todo texto com verbos no imperativo é instrucional._',
    back: '**Errado.** O anúncio usa imperativo para **persuadir** (“Experimente”). Instrucional é o texto que orienta um **procedimento** (“Misture os ovos”).',
  },
  {
    id: 'gt-f-18',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'Finalidade e marcas do anúncio publicitário?',
    back: '**Persuadir** (comprar, aderir).\nMarcas: imperativo, apelo ao leitor (você, seu), slogan, duplo sentido, linguagem figurada, imagem.',
  },
  {
    id: 'gt-f-19',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'O que é infográfico?',
    back: 'Gênero de finalidade **expositiva** que combina texto, números e imagens (gráficos, mapas, ícones) para explicar um assunto de forma rápida.',
  },
  {
    id: 'gt-f-20',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'Certo ou errado? _Por ser digital, o e-mail é sempre informal._',
    back: '**Errado.** O registro depende da situação: e-mail a um órgão público ou a um cliente pede linguagem formal e norma-padrão.',
  },
  {
    id: 'gt-f-21',
    topicId,
    skillId: 'gt-cotidianos',
    front: 'Como costumam cobrar charge e tirinha em prova?',
    back: '“O humor decorre…”, “a crítica refere-se a…”, “a relação entre linguagem verbal e não verbal…”.\nJunte fala e imagem e procure o **contraste** que gera o efeito.',
  },

  // ── Crônica, conto e poema ──
  {
    id: 'gt-f-22',
    topicId,
    skillId: 'gt-literarios',
    front: 'Marcas típicas da crônica?',
    back: '**Cotidiano**, **brevidade**, tom de conversa com o leitor e **reflexão**.\nTradicionalmente publicada em jornais e revistas; pode ser narrativa, lírica, humorística ou argumentativa.',
  },
  {
    id: 'gt-f-23',
    topicId,
    skillId: 'gt-literarios',
    front: 'A crônica é gênero literário ou jornalístico?',
    back: '**A classificação divide os estudiosos.** Há quem a trate como literária e há quem a situe na fronteira entre jornalismo e literatura.\nNa prova, decida pelas marcas do texto.',
  },
  {
    id: 'gt-f-24',
    topicId,
    skillId: 'gt-literarios',
    front: 'O que caracteriza o conto?',
    back: '**Narrativa ficcional curta e concentrada:** poucas personagens, tempo e espaço reduzidos, um conflito central e desfecho.',
  },
  {
    id: 'gt-f-25',
    topicId,
    skillId: 'gt-literarios',
    front: 'Poema × poesia?',
    back: '**Poema:** em regra, o texto em versos (há também o poema em prosa).\n**Poesia:** a qualidade estética, que pode estar no poema, na prosa (prosa poética) e até numa imagem.',
  },
  {
    id: 'gt-f-26',
    topicId,
    skillId: 'gt-literarios',
    front: 'Certo ou errado? _Todo poema tem rima._',
    back: '**Errado.** Rima e métrica são recursos possíveis, não obrigatórios. Poemas em versos sem rima (brancos) ou sem métrica regular (livres) continuam sendo poemas.',
  },
  {
    id: 'gt-f-27',
    topicId,
    skillId: 'gt-literarios',
    front: 'Eu lírico × narrador × autor?',
    back: '**Eu lírico:** a voz que fala no poema.\n**Narrador:** quem conta a história no conto ou no romance.\n**Autor:** a pessoa real que escreveu. Nenhum dos dois primeiros se confunde necessariamente com ele.',
  },
  {
    id: 'gt-f-28',
    topicId,
    skillId: 'gt-literarios',
    front: 'Como costumam cobrar crônica, conto e poema em prova?',
    back: '“O texto pode ser classificado como… porque…”, efeito de um recurso, sentido de um verso, quem é o eu lírico.\nNo certo/errado, desconfie de “sem rima não é poema” e de “o eu lírico é o autor”.',
  },
];
