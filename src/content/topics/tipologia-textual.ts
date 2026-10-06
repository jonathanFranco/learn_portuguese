import type { Flashcard, Lesson, Question } from '../../domain/types';

const topicId = 'tipologia-textual';

// Textos originais e curtos, cada um com um tipo predominante bem marcado.
const PROVA =
  'Naquela manhã, Joaquim acordou antes do despertador. Vestiu a camisa nova, conferiu três vezes o documento e saiu sem tomar café. No ponto, o ônibus demorou. Quando finalmente chegou à escola onde faria a prova, os portões já estavam se fechando. Ele correu, mostrou a identidade ao fiscal e entrou na sala no último minuto. Só então percebeu que tinha esquecido a caneta.';

const PESCADOR =
  'O velho pescador empurrou o barco para a água antes de o sol nascer. O mar estava calmo, de um azul quase cinzento, e o ar cheirava a sal e a óleo diesel. Remou até a pedra grande, lançou a rede e esperou. Duas horas depois, puxou-a de volta: vinha vazia. Ele riu sozinho, guardou a rede e recomeçou.';

const SALA =
  'A sala de espera era estreita e mal iluminada. Nas paredes, de um verde desbotado, havia cartazes antigos sobre vacinação. Seis cadeiras de plástico, todas diferentes, alinhavam-se diante de um balcão de madeira escura. Sobre ele, um vaso com flores artificiais acumulava poeira. Do fundo vinha o zumbido constante de um ventilador velho.';

const FOTOSSINTESE =
  'A fotossíntese é o processo pelo qual plantas, algas e cianobactérias produzem matéria orgânica a partir de gás carbônico e água, utilizando a energia da luz. Nas plantas, ela ocorre principalmente nas folhas, em estruturas chamadas cloroplastos, que contêm clorofila. Como resultado, além de açúcares, o processo libera oxigênio para a atmosfera.';

const BIBLIOTECAS =
  'Ampliar o horário de funcionamento das bibliotecas públicas não é luxo, mas necessidade. Grande parte de quem estuda para concursos trabalha durante o dia e só tem a noite livre. Se as bibliotecas fecham às 17h, justamente esse público fica sem acesso a um ambiente silencioso e gratuito. Portanto, o custo de manter as portas abertas por mais algumas horas é pequeno diante do benefício que isso traria.';

const SEGUNDA_VIA =
  'Para solicitar a segunda via do documento, acesse o portal e clique em “Serviços”. Em seguida, informe o número do CPF e a data de nascimento. Confira os dados exibidos na tela antes de confirmar. Caso haja divergência, não prossiga: compareça a uma unidade de atendimento com um documento original com foto. Ao final, imprima ou salve o comprovante.';

const POSTO =
  'Na semana passada, uma senhora de 70 anos passou quatro horas na fila de um posto de saúde para marcar uma consulta. Casos assim não são exceção. Eles mostram que o agendamento exclusivamente presencial penaliza justamente quem tem mais dificuldade de locomoção. Por isso, oferecer a marcação também por telefone e pela internet deveria ser prioridade das prefeituras.';

const TRANSITO =
  'A pressa tem custado caro no trânsito das grandes cidades. Muitos acidentes envolvem excesso de velocidade, e os poucos minutos economizados raramente compensam o risco. Reduzir a velocidade é, portanto, uma escolha racional, e não um sinal de fraqueza. Pense nisso na próxima vez que o sinal ficar amarelo.';

export const lessons: Lesson[] = [
  {
    id: 'tt-l-narracao',
    topicId,
    skillId: 'tt-narracao',
    title: 'Narração',
    summary: 'A **narração** conta **fatos** que se sucedem no **tempo**, vividos por **personagens** em um espaço. O traço decisivo é a **progressão temporal**: um acontecimento leva ao seguinte.',
    examples: [
      {
        sentence: '“Pedro entrou na agência, pegou uma senha e esperou. Quarenta minutos depois, foi chamado.”',
        breakdown: [
          'entrou → pegou → esperou → foi chamado: ações em **sequência**',
          '“Quarenta minutos depois” → **marcador temporal**',
          'Personagem (Pedro), espaço (agência) e tempo → elementos da narrativa',
        ],
      },
      {
        sentence: '“Amanhece. Maria abre a janela, olha o céu e decide sair sem guarda-chuva.”',
        breakdown: [
          'Verbos no **presente**, mas os fatos se sucedem',
          'É o **presente histórico** (ou narrativo): aproxima o leitor da cena',
          'Continua sendo narração',
        ],
        note: 'O tempo verbal ajuda, mas quem decide é a sequência de fatos.',
      },
    ],
    deepDive:
      'Marcas linguísticas mais comuns:\n– verbos de **ação**, sobretudo no **pretérito perfeito** (saiu, chegou, disse);\n– **marcadores temporais** (depois, então, no dia seguinte, quando);\n– **narrador** (em geral em 1ª ou 3ª pessoa), personagens, tempo, espaço e, em geral, um conflito.\nNenhuma marca isolada decide: o critério é haver **fatos em sequência**.',
    tips: [
      { kind: 'cobranca', text: 'Em múltipla escolha, é comum o comando “Predomina no texto o tipo…” com as opções narrativo, descritivo, expositivo, argumentativo e injuntivo. Em certo/errado, o item costuma afirmar que o texto “é predominantemente narrativo” e justificar com uma marca — confira se a **justificativa** também está certa.' },
      { kind: 'pegadinha', text: 'Cuidado: narração não exige verbo no passado. O **presente histórico** (“Ele chega, olha e sai”) mantém a sequência de fatos. Item que diga “por estar no presente, o trecho não é narrativo” está errado.' },
      { kind: 'pegadinha', text: 'Cuidado com o **relato** dentro de texto opinativo: um caso contado como exemplo (“Ontem, um motorista…”) é só uma **sequência narrativa** a serviço da tese. O tipo predominante continua sendo o argumentativo.' },
      { kind: 'macete', text: 'Pergunte “**e depois?**”. Se o texto responde com um novo acontecimento, há narração. Se a ordem das frases pode mudar sem alterar os fatos, procure outro tipo.' },
    ],
  },
  {
    id: 'tt-l-descricao',
    topicId,
    skillId: 'tt-descricao',
    title: 'Descrição',
    summary: 'A **descrição** apresenta as **características** de um ser, objeto, lugar ou situação, como um **retrato**. Em regra, não há progressão temporal: os elementos são mostrados como **simultâneos**.',
    examples: [
      {
        sentence: '“A cozinha era pequena e clara. Havia uma mesa de madeira no centro e, na parede, panelas de cobre penduradas.”',
        breakdown: [
          'Adjetivos e locuções adjetivas: pequena, clara, **de madeira**, **de cobre**',
          'Verbos de estado ou existência: **era**, **havia**',
          'Nada acontece: as frases mostram o que existe ao mesmo tempo',
        ],
      },
      {
        sentence: '“A sala tem 20 m² e duas janelas.” / “A sala, abafada e sombria, parecia menor do que era.”',
        breakdown: [
          '1ª → descrição **objetiva**: dados verificáveis, sem opinião',
          '2ª → descrição **subjetiva**: impressões de quem descreve (abafada, sombria, parecia menor)',
        ],
      },
    ],
    deepDive:
      'Marcas comuns: **adjetivos** e **locuções adjetivas**; verbos de **estado** ou existência (ser, estar, ter, haver, parecer); **pretérito imperfeito** nas descrições no passado (era, tinha) ou **presente** (é, tem); enumerações; referências aos **sentidos** (cor, som, cheiro).\nNenhuma dessas marcas, sozinha, define o tipo: adjetivos aparecem em qualquer texto, e o imperfeito também aparece na narração de ações habituais ou em andamento.',
    tips: [
      { kind: 'cobranca', text: 'É comum pedir, em múltipla escolha, o trecho em que **predomina a descrição** dentro de um texto narrativo, ou afirmar, em certo/errado, que certo trecho “caracteriza” um personagem ou ambiente. Procure o ponto em que a ação **para** e o texto passa a mostrar como as coisas **são** ou **estavam**.' },
      { kind: 'pegadinha', text: 'Cuidado: muitos **adjetivos** não bastam para classificar um texto como descritivo. Um artigo de opinião também é cheio deles (“medida **injusta** e **ineficaz**”). O critério é a finalidade: retratar algo, sem sucessão de fatos.' },
      { kind: 'pegadinha', text: 'Cuidado com o **pretérito imperfeito**: ele é típico da descrição no passado (“A casa **era** antiga”), mas também aparece na narração (“Enquanto ela **dormia**, o ladrão entrou”). Olhe o conjunto, não um verbo isolado.' },
      { kind: 'macete', text: 'Teste da **troca de ordem**: se dá para inverter as frases de um trecho sem alterar o que aconteceu, ele tende a ser descritivo (ou expositivo). Na narração, mudar a ordem muda a história.' },
    ],
  },
  {
    id: 'tt-l-dissertacao',
    topicId,
    skillId: 'tt-dissertacao',
    title: 'Dissertação: expor × argumentar',
    summary: 'O texto **dissertativo** trata de ideias, conceitos e problemas, não de fatos em sequência. Pode ser **expositivo** (informa e explica, sem defender tese) ou **argumentativo** (defende um ponto de vista para convencer o leitor).',
    examples: [
      {
        sentence: '“A inflação é o aumento generalizado e contínuo dos preços. Ela reduz o poder de compra da moeda.”',
        breakdown: [
          'Define e explica um conceito',
          'Presente com valor atemporal (**é**, **reduz**)',
          'Não toma partido → **expositivo**',
        ],
      },
      {
        sentence: '“O município deveria priorizar o transporte público, pois ele atende a maior parte da população.”',
        breakdown: [
          '“deveria priorizar” → posição do autor (**tese**)',
          '“pois” → introduz o **argumento**',
          'Finalidade: convencer → **argumentativo**',
        ],
      },
      {
        sentence: '“Segundo a pesquisa, 40% dos leitores abandonaram o hábito. É urgente, portanto, investir em bibliotecas.”',
        breakdown: [
          '1ª frase: um dado (sozinha, seria exposição)',
          '2ª frase: “É urgente, portanto” → avaliação + conclusão',
          'O dado vira **argumento** a serviço da tese → argumentativo',
        ],
      },
    ],
    deepDive:
      'Marcas da **exposição**: definições, classificações, dados e exemplos; presente atemporal; linguagem em geral impessoal; conectivos explicativos e aditivos (ou seja, isto é, além disso).\nMarcas da **argumentação**: **tese** (explícita ou implícita); conectivos de causa, conclusão, oposição e concessão (pois, portanto, mas, embora); **modalizadores** e expressões avaliativas (é preciso, deve-se, infelizmente, inaceitável).\nAs classificações variam: a tradição escolar fala em **dissertação** (expositiva ou argumentativa); muitos autores tratam **exposição** e **argumentação** como tipos distintos. Em prova, os dois nomes aparecem.',
    tips: [
      { kind: 'cobranca', text: 'Em certo/errado, é comum afirmar que um texto é “predominantemente expositivo” ou “dissertativo-argumentativo”. Para julgar, procure uma **tese**: há algo que o autor quer que o leitor aceite? Se sim, é argumentativo; se ele só informa e explica, é expositivo.' },
      { kind: 'cobranca', text: 'Em múltipla escolha, aparecem comandos como “assinale o trecho que expressa a **opinião** do autor” ou “o argumento usado para sustentar a tese”. Expressões avaliativas (**é necessário**, **injusto**, **deveria**) costumam denunciar a posição do autor.' },
      { kind: 'pegadinha', text: 'Cuidado: **impessoalidade** não é sinônimo de exposição. Um texto em 3ª pessoa, sem nenhum “eu”, pode defender uma tese com firmeza (“É inadmissível que…”). E um texto expositivo pode usar a 1ª pessoa do plural (“vejamos”).' },
      { kind: 'pegadinha', text: 'Cuidado com **dados e citações**: estatística não torna o texto expositivo. Se o dado é usado para provar uma posição (“Os números mostram que a lei falhou”), ele é **argumento**.' },
      { kind: 'macete', text: 'Pergunte: “o autor quer que eu **saiba** algo ou que eu **concorde** com algo?”. Saber → expositivo. Concordar → argumentativo.' },
    ],
  },
  {
    id: 'tt-l-injuncao',
    topicId,
    skillId: 'tt-injuncao',
    title: 'Injunção e tipo predominante',
    summary: 'O texto **injuntivo** (ou instrucional) orienta o leitor a **fazer** algo: dá ordens, instruções ou conselhos, em geral em etapas. Como quase todo texto mistura tipos, a prova pede o tipo **predominante**: o que organiza o texto e cumpre sua finalidade principal.',
    examples: [
      {
        sentence: '“Lave as mãos. Em seguida, aplique o produto e espere secar.”',
        breakdown: [
          'Imperativo: **lave**, **aplique**, **espere**',
          '“Em seguida” → ordena as etapas',
          'Finalidade: orientar uma ação → **injuntivo**',
        ],
      },
      {
        sentence: '“Manter o medicamento em local seco. Não utilizar após o prazo de validade.”',
        breakdown: [
          '**Infinitivo** com valor de ordem (comum em bulas, manuais e avisos)',
          'Continua sendo injunção',
        ],
      },
      {
        sentence: '“Ontem, uma criança se perdeu no parque por falta de sinalização. Casos assim mostram que a prefeitura precisa instalar placas.”',
        breakdown: [
          '1ª frase: sequência **narrativa** (um caso)',
          '2ª frase: a **tese**',
          'O relato serve à tese → predomina a **argumentação**',
        ],
      },
    ],
    deepDive:
      'Marcas da injunção: **imperativo** (faça, não deixe); **infinitivo** com valor de ordem (agitar antes de usar); expressões como **deve-se**, **é proibido**; ordem das etapas (primeiro, em seguida, por fim).\nPara achar o tipo **predominante**: (1) qual é a **finalidade** do texto como um todo? (2) qual sequência organiza as outras? Uma descrição dentro de um conto, ou um relato dentro de um artigo de opinião, é sequência secundária.\n**Tipo × gênero** (aprofundado em Gêneros textuais): o tipo é o modo de organizar o texto (são poucos); o gênero é a forma concreta que circula na sociedade (receita, bula, notícia, crônica — são inúmeros). A receita é um gênero em que predomina o tipo injuntivo.',
    tips: [
      { kind: 'cobranca', text: 'Formato clássico: “Predomina no texto o tipo…” ou, em certo/errado, “o texto, predominantemente injuntivo, orienta o leitor a…”. Em manuais, editais e bulas, verifique se o trecho **instrui** o leitor (injunção) ou só **informa** (exposição).' },
      { kind: 'cobranca', text: 'É comum apresentar um texto misto e afirmar, em certo/errado, que ele “apresenta trecho narrativo, mas é predominantemente argumentativo”. Julgue as duas partes: a sequência citada existe? Ela organiza o texto ou está a serviço de outra?' },
      { kind: 'pegadinha', text: 'Cuidado: um **imperativo** isolado não torna o texto injuntivo. Um artigo de opinião que termina com “Pense nisso” continua **argumentativo**; o apelo final reforça a tese.' },
      { kind: 'pegadinha', text: 'Cuidado com **tipo × gênero**: “receita”, “notícia” e “carta” são **gêneros**, não tipos. Se a pergunta é sobre o tipo, a resposta, na classificação mais usada em provas, é narrativo, descritivo, expositivo, argumentativo ou injuntivo.' },
      { kind: 'macete', text: 'Para o tipo predominante, pergunte “**para que** este texto foi escrito?”: contar (narração), retratar (descrição), explicar (exposição), convencer (argumentação), orientar uma ação (injunção).' },
    ],
  },
];

export const questions: Question[] = [
  // ── Narração ──
  {
    id: 'tt-01',
    topicId,
    skillId: 'tt-narracao',
    difficulty: 1,
    type: 'multiple_choice',
    passage: PROVA,
    statement: 'Predomina no texto o tipo:',
    alternatives: [
      { id: 'A', text: 'narrativo' },
      { id: 'B', text: 'descritivo', whyWrong: 'Há poucas características (“camisa nova”); o texto é organizado por ações em sequência, não por um retrato.' },
      { id: 'C', text: 'expositivo', whyWrong: 'O texto não explica um conceito nem informa sobre um tema: conta um episódio vivido por um personagem.' },
      { id: 'D', text: 'argumentativo', whyWrong: 'Não há tese nem tentativa de convencer o leitor.' },
      { id: 'E', text: 'injuntivo', whyWrong: 'Não há instruções ao leitor; os verbos estão no pretérito, não no imperativo.' },
    ],
    correct: 'A',
    explanation: 'Há personagem (Joaquim), tempo (“Naquela manhã”), espaço (ponto, escola, sala) e ações em sequência (acordou → vestiu → saiu → correu → entrou → percebeu). Progressão temporal = **narração**.',
  },
  {
    id: 'tt-02',
    topicId,
    skillId: 'tt-narracao',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete com o traço que define a narração:',
    template: 'Na narração, os fatos se organizam em ___ temporal: um acontecimento leva ao seguinte.',
    options: ['progressão', 'simultaneidade', 'oposição'],
    correct: 'progressão',
    explanation: 'O que define a narração é a **progressão temporal**: fatos em sequência. A **simultaneidade** é própria da descrição, que mostra tudo ao mesmo tempo, como um retrato.',
  },
  {
    id: 'tt-03',
    topicId,
    skillId: 'tt-narracao',
    difficulty: 2,
    type: 'true_false',
    passage: PROVA,
    statement: 'As formas verbais “acordou”, “vestiu”, “saiu” e “correu”, no pretérito perfeito, indicam ações concluídas e sucessivas, o que reforça o caráter narrativo do texto.',
    correct: true,
    explanation: 'Certo. O **pretérito perfeito** marca ações pontuais e concluídas; em sequência, elas fazem a história avançar — marca típica da narração.',
  },
  {
    id: 'tt-04',
    topicId,
    skillId: 'tt-narracao',
    difficulty: 3,
    type: 'true_false',
    statement: 'O trecho “O juiz entra, olha para o réu e anuncia a sentença.” não pode ser considerado narrativo, já que suas formas verbais estão no presente do indicativo.',
    correct: false,
    explanation: 'Errado. É o **presente histórico** (ou narrativo): os verbos estão no presente, mas as ações se sucedem (entra → olha → anuncia). O critério da narração é a sequência de fatos, não o tempo verbal.',
  },
  {
    id: 'tt-05',
    topicId,
    skillId: 'tt-narracao',
    difficulty: 3,
    type: 'multiple_choice',
    passage: PESCADOR,
    statement: 'Sobre a organização do texto, assinale a alternativa correta.',
    alternatives: [
      { id: 'A', text: 'Predomina a narração; o trecho “O mar estava calmo (…) óleo diesel” é uma pausa descritiva na sequência de ações.' },
      { id: 'B', text: 'Predomina a descrição, pois o texto caracteriza o mar, o ar e o pescador.', whyWrong: 'A caracterização ocupa só uma frase. O texto é organizado pelas ações (empurrou, remou, lançou, esperou, puxou) e por um marcador temporal (“Duas horas depois”).' },
      { id: 'C', text: 'Não há progressão temporal, já que todas as ações ocorrem no mesmo instante.', whyWrong: 'Há progressão clara: “antes de o sol nascer”, “Duas horas depois”, “recomeçou”.' },
      { id: 'D', text: 'Predomina a argumentação, pois o texto defende que a pesca artesanal é pouco lucrativa.', whyWrong: 'Não há tese nem argumentos; o texto conta um episódio. Tirar conclusão sobre lucro é extrapolação.' },
      { id: 'E', text: 'O trecho “O mar estava calmo (…) óleo diesel” é narrativo, pois está no pretérito.', whyWrong: 'Estar no pretérito não basta: “estava” e “cheirava”, no imperfeito, apresentam estados simultâneos, sem ação que faça a história avançar — traço de descrição.' },
    ],
    correct: 'A',
    explanation: 'Texto misto: a **narração** predomina (ações em sequência, marcadores de tempo), e a frase sobre o mar e o ar é uma **sequência descritiva** que suspende a ação por um momento.',
  },

  // ── Descrição ──
  {
    id: 'tt-06',
    topicId,
    skillId: 'tt-descricao',
    difficulty: 1,
    type: 'multiple_choice',
    passage: SALA,
    statement: 'Predomina no texto o tipo:',
    alternatives: [
      { id: 'A', text: 'narrativo', whyWrong: 'Nenhum fato acontece: não há ações em sequência nem progressão temporal.' },
      { id: 'B', text: 'descritivo' },
      { id: 'C', text: 'expositivo', whyWrong: 'O texto não explica um conceito nem um fenômeno geral; retrata um lugar específico, com detalhes visuais e sonoros.' },
      { id: 'D', text: 'argumentativo', whyWrong: 'Não há tese nem argumentos para convencer o leitor.' },
      { id: 'E', text: 'injuntivo', whyWrong: 'Não há instruções nem verbos no imperativo.' },
    ],
    correct: 'B',
    explanation: 'O texto é um **retrato** da sala: adjetivos (estreita, desbotado, escura), verbos de estado ou existência (era, havia) e elementos simultâneos. Não há sucessão de fatos → **descrição**.',
  },
  {
    id: 'tt-07',
    topicId,
    skillId: 'tt-descricao',
    difficulty: 2,
    type: 'true_false',
    passage: SALA,
    statement: 'As formas verbais “era”, “havia”, “acumulava” e “vinha” não expressam ações sucessivas; apresentam estados e situações simultâneos, o que é próprio da descrição.',
    correct: true,
    explanation: 'Certo. O **pretérito imperfeito** aqui não faz a história andar: tudo está acontecendo ao mesmo tempo, como numa fotografia. É o uso típico do imperfeito na descrição.',
  },
  {
    id: 'tt-08',
    topicId,
    skillId: 'tt-descricao',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete:',
    template: 'Um trecho que retrata um lugar, mostrando suas características sem que um fato leve ao outro, é predominantemente ___.',
    options: ['descritivo', 'narrativo', 'injuntivo'],
    correct: 'descritivo',
    explanation: 'Retratar características, sem progressão temporal, é **descrever**. Se um fato levasse ao outro, seria narração; se orientasse o leitor a agir, injunção.',
  },
  {
    id: 'tt-09',
    topicId,
    skillId: 'tt-descricao',
    difficulty: 2,
    type: 'multiple_choice',
    statement: 'Assinale o trecho em que predomina a **descrição**.',
    alternatives: [
      { id: 'A', text: 'Ela abriu a janela, olhou a rua e decidiu sair.', whyWrong: 'Ações em sequência (abriu → olhou → decidiu): narração.' },
      { id: 'B', text: 'O casarão tinha janelas altas, paredes descascadas e um portão de ferro enferrujado.' },
      { id: 'C', text: 'Ligue o aparelho e aguarde o sinal sonoro.', whyWrong: 'Imperativo orientando o leitor: injunção.' },
      { id: 'D', text: 'A reciclagem reduz o volume de lixo enviado aos aterros.', whyWrong: 'Informa e explica um fato geral: exposição.' },
      { id: 'E', text: 'É urgente rever as regras de trânsito, pois os acidentes aumentaram.', whyWrong: '“É urgente” expressa posição do autor, sustentada por um argumento (“pois…”): argumentação.' },
    ],
    correct: 'B',
    explanation: 'Em B, o casarão é **caracterizado**: verbo de estado/posse (“tinha”), enumeração e adjetivos (altas, descascadas, enferrujado). Nada acontece → descrição.',
  },
  {
    id: 'tt-10',
    topicId,
    skillId: 'tt-descricao',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Os trechos abaixo são descritivos. Assinale aquele em que a descrição é predominantemente **subjetiva**, isto é, marcada pelas impressões de quem descreve.',
    alternatives: [
      { id: 'A', text: 'O imóvel tem 70 m², dois quartos, sala, cozinha e um banheiro.', whyWrong: 'Descrição objetiva: medidas e cômodos, dados verificáveis.' },
      { id: 'B', text: 'A peça é de aço inoxidável, mede 12 cm e pesa 200 g.', whyWrong: 'Descrição objetiva: material, medida e peso, sem impressão pessoal.' },
      { id: 'C', text: 'A casa parecia cansada: as janelas, tristes, olhavam para uma rua que ninguém mais visitava.' },
      { id: 'D', text: 'O suspeito mede cerca de 1,80 m, tem cabelos curtos e vestia camiseta azul no momento da abordagem.', whyWrong: 'Descrição objetiva, de caráter técnico: altura, cabelo e roupa, sem juízo de quem descreve.' },
      { id: 'E', text: 'O terreno fica na esquina da Rua das Flores e é cercado por um muro de dois metros.', whyWrong: 'Descrição objetiva: localização e medida verificáveis.' },
    ],
    correct: 'C',
    explanation: 'Em C, a casa “parecia cansada” e as janelas são “tristes” e “olhavam” (personificação): são **impressões** do observador, não dados verificáveis. Descrição subjetiva.',
  },

  // ── Dissertação: expor × argumentar ──
  {
    id: 'tt-11',
    topicId,
    skillId: 'tt-dissertacao',
    difficulty: 1,
    type: 'multiple_choice',
    passage: FOTOSSINTESE,
    statement: 'Quanto ao tipo textual, o texto é predominantemente:',
    alternatives: [
      { id: 'A', text: 'expositivo, pois explica um fenômeno sem defender ponto de vista.' },
      { id: 'B', text: 'argumentativo, pois defende a importância das plantas para o planeta.', whyWrong: 'O texto não defende tese nem usa expressões de avaliação; a “importância das plantas” nem é mencionada.' },
      { id: 'C', text: 'narrativo, pois apresenta fatos em sequência temporal.', whyWrong: 'Não há personagens nem episódio situado no tempo; o texto explica como um fenômeno ocorre de modo geral.' },
      { id: 'D', text: 'injuntivo, pois ensina o leitor a realizar a fotossíntese.', whyWrong: 'Não há instruções nem imperativo; o texto explica, não orienta uma ação.' },
      { id: 'E', text: 'argumentativo, pois “Como resultado” introduz a conclusão de uma tese.', whyWrong: '“Como resultado” indica a consequência do processo explicado, não a conclusão de uma tese. Um conectivo isolado não define o tipo.' },
    ],
    correct: 'A',
    explanation: 'Definição (“é o processo pelo qual…”), presente atemporal (ocorre, libera) e nenhuma tomada de posição: **exposição**.',
  },
  {
    id: 'tt-12',
    topicId,
    skillId: 'tt-dissertacao',
    difficulty: 2,
    type: 'multiple_choice',
    passage: BIBLIOTECAS,
    statement: 'O texto é predominantemente argumentativo. Assinale a alternativa que aponta corretamente uma marca dessa argumentação.',
    alternatives: [
      { id: 'A', text: '“Portanto” introduz a conclusão que o autor tira dos argumentos apresentados.' },
      { id: 'B', text: 'A forma verbal “fecham” indica uma ação pontual e concluída no passado, típica da narração.', whyWrong: '“Fecham” está no presente e indica um fato habitual, usado como argumento; não há narração.' },
      { id: 'C', text: 'O autor evita juízos de valor e se limita a informar o horário das bibliotecas.', whyWrong: '“não é luxo, mas necessidade” é juízo de valor — é a própria tese.' },
      { id: 'D', text: '“Se” introduz uma instrução dirigida ao leitor, como em um manual.', whyWrong: '“Se” introduz uma condição usada no raciocínio (se fecham cedo, o público fica sem acesso); não há instrução.' },
      { id: 'E', text: 'A primeira frase descreve as características físicas das bibliotecas.', whyWrong: 'A primeira frase apresenta a tese (ampliar o horário é necessidade); não há descrição física.' },
    ],
    correct: 'A',
    explanation: 'A estrutura é **tese** (1ª frase) → **argumentos** (público que trabalha de dia; falta de acesso) → **conclusão** introduzida por “Portanto”. O conectivo conclusivo é marca típica da argumentação.',
  },
  {
    id: 'tt-13',
    topicId,
    skillId: 'tt-dissertacao',
    difficulty: 1,
    type: 'true_false',
    statement: 'Em um texto expositivo, o autor apresenta informações e explicações sobre um tema, sem ter como objetivo principal convencer o leitor de uma tese.',
    correct: true,
    explanation: 'Certo. A exposição **informa e explica**; a argumentação **defende um ponto de vista**. Pergunte: o autor quer que eu saiba algo ou que eu concorde com algo?',
  },
  {
    id: 'tt-14',
    topicId,
    skillId: 'tt-dissertacao',
    difficulty: 3,
    type: 'true_false',
    passage: BIBLIOTECAS,
    statement: 'Por não empregar a primeira pessoa e manter linguagem impessoal, o texto deve ser classificado como expositivo.',
    correct: false,
    explanation: 'Errado. **Impessoalidade não é sinônimo de exposição.** Mesmo sem “eu”, o texto defende uma tese (“não é luxo, mas necessidade”), sustenta-a com argumentos e conclui com “Portanto”: é argumentativo.',
  },
  {
    id: 'tt-15',
    topicId,
    skillId: 'tt-dissertacao',
    difficulty: 3,
    type: 'multiple_choice',
    statement: 'Todos os trechos tratam do mesmo tema. Assinale aquele em que predomina a **argumentação**, e não a simples exposição.',
    alternatives: [
      { id: 'A', text: 'O termo “nomofobia” designa o medo de ficar sem acesso ao celular.', whyWrong: 'É uma definição: exposição.' },
      { id: 'B', text: 'Há pesquisas que associam o uso excessivo de telas à dispersão da atenção; outras não encontram essa relação.', whyWrong: 'Apresenta as duas posições sem tomar partido: exposição.' },
      { id: 'C', text: 'Proibir o celular em sala de aula, embora pareça uma medida radical, é a forma mais eficaz de proteger a atenção dos alunos.' },
      { id: 'D', text: 'Em muitas escolas, o uso do celular é restrito durante as aulas.', whyWrong: 'Informa uma situação, sem avaliá-la: exposição.' },
      { id: 'E', text: 'Em atividades pedagógicas, o celular costuma ser usado para pesquisas e gravação de vídeos.', whyWrong: 'Informa como o aparelho é usado, sem defender que deva ou não ser: exposição.' },
    ],
    correct: 'C',
    explanation: 'Em C há **tese** (“é a forma mais eficaz”), avaliação (“radical”) e **concessão** (“embora pareça…”), recurso argumentativo clássico: reconhece-se uma objeção para reforçar a posição.',
  },

  // ── Injunção e tipo predominante ──
  {
    id: 'tt-16',
    topicId,
    skillId: 'tt-injuncao',
    difficulty: 1,
    type: 'multiple_choice',
    passage: SEGUNDA_VIA,
    statement: 'Predomina no texto o tipo:',
    alternatives: [
      { id: 'A', text: 'narrativo', whyWrong: 'Não há personagens nem fatos acontecidos; os verbos se dirigem ao leitor, no imperativo.' },
      { id: 'B', text: 'descritivo', whyWrong: 'O texto não retrata o portal nem o documento; indica o que fazer.' },
      { id: 'C', text: 'expositivo', whyWrong: 'O texto não se limita a informar: orienta o leitor a agir, passo a passo.' },
      { id: 'D', text: 'argumentativo', whyWrong: 'Não há tese nem tentativa de convencer; há instruções.' },
      { id: 'E', text: 'injuntivo' },
    ],
    correct: 'E',
    explanation: 'Imperativo (acesse, clique, informe, confira, compareça, imprima), etapas ordenadas (“Em seguida”, “Ao final”) e finalidade de orientar uma ação: **injunção**.',
  },
  {
    id: 'tt-17',
    topicId,
    skillId: 'tt-injuncao',
    difficulty: 1,
    type: 'fill_blank',
    statement: 'Complete com a forma verbal típica do texto injuntivo, em paralelo com “misture”:',
    template: 'Misture a farinha e o açúcar; em seguida, ___ os ovos um a um.',
    options: ['acrescente', 'acrescentou', 'acrescentava'],
    correct: 'acrescente',
    explanation: '“Misture” está no **imperativo**; a instrução seguinte mantém o mesmo modo: “**acrescente**”. As formas no pretérito transformariam a receita em relato.',
  },
  {
    id: 'tt-18',
    topicId,
    skillId: 'tt-injuncao',
    difficulty: 2,
    type: 'true_false',
    statement: 'Em “Retirar o lacre e agitar antes de usar.”, o uso do infinitivo, em vez do imperativo, não impede que o trecho seja classificado como injuntivo.',
    correct: true,
    explanation: 'Certo. O **infinitivo com valor de ordem** é comum em bulas, embalagens e avisos. O trecho continua orientando uma ação: é injunção.',
  },
  {
    id: 'tt-19',
    topicId,
    skillId: 'tt-injuncao',
    difficulty: 3,
    type: 'multiple_choice',
    passage: POSTO,
    statement: 'Quanto à tipologia, é correto afirmar que o texto:',
    alternatives: [
      { id: 'A', text: 'é predominantemente argumentativo, e o relato inicial funciona como exemplo que sustenta a tese.' },
      { id: 'B', text: 'é predominantemente narrativo, pois começa com um fato ocorrido na semana passada.', whyWrong: 'O relato ocupa só a 1ª frase e serve de exemplo; o restante avalia o caso e defende uma posição.' },
      { id: 'C', text: 'é predominantemente injuntivo, pois “deveria ser prioridade” é uma ordem dirigida ao leitor.', whyWrong: '“Deveria” expressa a opinião do autor sobre o que as prefeituras precisam fazer; não instrui o leitor passo a passo.' },
      { id: 'D', text: 'é predominantemente expositivo, pois apenas informa como funciona o agendamento nos postos.', whyWrong: 'O texto avalia (“penaliza”) e propõe uma mudança: há tese, não só informação.' },
      { id: 'E', text: 'é predominantemente descritivo, pois caracteriza a senhora de 70 anos.', whyWrong: 'A idade é um dado do relato, não um retrato do personagem; não há sequência descritiva relevante.' },
    ],
    correct: 'A',
    explanation: 'Texto misto: a 1ª frase é uma **sequência narrativa**, mas está a serviço da tese (“deveria ser prioridade”), sustentada pelo argumento de que o agendamento presencial penaliza quem tem dificuldade de locomoção. Predomina a **argumentação**.',
  },
  {
    id: 'tt-20',
    topicId,
    skillId: 'tt-injuncao',
    difficulty: 3,
    type: 'true_false',
    passage: TRANSITO,
    statement: 'Por terminar com verbo no imperativo (“Pense”), o texto deve ser classificado como predominantemente injuntivo.',
    correct: false,
    explanation: 'Errado. O imperativo final é um **apelo** que reforça a tese. O texto defende uma posição (“Reduzir a velocidade é […] uma escolha racional”) com argumentos e conclusão (“portanto”): predomina a **argumentação**.',
  },
];

export const flashcards: Flashcard[] = [
  // ── Narração ──
  {
    id: 'tt-f-01',
    topicId,
    skillId: 'tt-narracao',
    front: 'Qual é o traço decisivo da narração?',
    back: '**Progressão temporal**: fatos que se sucedem, um levando ao outro.\nPersonagens, tempo e espaço completam o quadro.',
  },
  {
    id: 'tt-f-02',
    topicId,
    skillId: 'tt-narracao',
    front: 'Certo ou errado? _Texto no presente do indicativo não pode ser narrativo._',
    back: '**Errado.** O **presente histórico** narra fatos em sequência: “Ele chega, abre a porta e grita.”',
  },
  {
    id: 'tt-f-03',
    topicId,
    skillId: 'tt-narracao',
    front: 'Quais são os elementos da narrativa?',
    back: '**Narrador**, **personagens**, **tempo**, **espaço** e **enredo** (em geral com um conflito).',
  },
  {
    id: 'tt-f-04',
    topicId,
    skillId: 'tt-narracao',
    front: 'Que tempo verbal costuma predominar na narração?',
    back: 'O **pretérito perfeito** (saiu, chegou, disse), que marca ações concluídas e sucessivas.\nÉ tendência, não regra: há narração no presente.',
  },
  {
    id: 'tt-f-05',
    topicId,
    skillId: 'tt-narracao',
    front: 'Marcadores temporais típicos da narração?',
    back: '“Depois”, “então”, “no dia seguinte”, “quando”, “duas horas depois”.\nEles encadeiam os fatos no tempo.',
  },
  {
    id: 'tt-f-06',
    topicId,
    skillId: 'tt-narracao',
    front: 'Certo ou errado? _Um caso contado como exemplo em um artigo de opinião torna o texto narrativo._',
    back: '**Errado.** É uma **sequência narrativa** a serviço da tese; o tipo predominante continua sendo o argumentativo.',
  },
  {
    id: 'tt-f-07',
    topicId,
    skillId: 'tt-narracao',
    front: 'Como costumam cobrar narração em prova?',
    back: '“Predomina no texto o tipo…” ou certo/errado como “o texto é predominantemente narrativo, como comprovam as formas verbais…”.\nConfira também a **justificativa** do item.',
  },

  // ── Descrição ──
  {
    id: 'tt-f-08',
    topicId,
    skillId: 'tt-descricao',
    front: 'O que caracteriza a descrição?',
    back: 'Apresenta **características** de seres, objetos ou lugares, como um **retrato**.\nEm regra, não há progressão temporal: tudo é mostrado como simultâneo.',
  },
  {
    id: 'tt-f-09',
    topicId,
    skillId: 'tt-descricao',
    front: 'Certo ou errado? _Muitos adjetivos bastam para o texto ser descritivo._',
    back: '**Errado.** Textos argumentativos também usam muitos adjetivos. O critério é a finalidade: retratar algo, sem sucessão de fatos.',
  },
  {
    id: 'tt-f-10',
    topicId,
    skillId: 'tt-descricao',
    front: 'Quais verbos são típicos da descrição?',
    back: 'Verbos de **estado** ou existência: **ser, estar, ter, haver, parecer**.\nNo passado, em geral no **pretérito imperfeito** (era, havia).',
  },
  {
    id: 'tt-f-11',
    topicId,
    skillId: 'tt-descricao',
    front: 'Descrição objetiva × subjetiva?',
    back: '**Objetiva**: dados verificáveis, sem opinião (“mede 3 m”).\n**Subjetiva**: impressões de quem descreve (“um quarto triste, sufocante”).',
  },
  {
    id: 'tt-f-12',
    topicId,
    skillId: 'tt-descricao',
    front: 'Certo ou errado? _Todo verbo no pretérito imperfeito indica descrição._',
    back: '**Errado.** O imperfeito também aparece na narração: “Enquanto ela **dormia**, o ladrão entrou.”',
  },
  {
    id: 'tt-f-13',
    topicId,
    skillId: 'tt-descricao',
    front: 'Teste rápido para separar descrição de narração?',
    back: '**Troque a ordem das frases.** Se nada muda nos fatos, o trecho tende a ser descritivo; na narração, mudar a ordem muda a história.',
  },
  {
    id: 'tt-f-14',
    topicId,
    skillId: 'tt-descricao',
    front: 'Como costumam cobrar descrição em prova?',
    back: 'Pedindo o trecho em que **predomina a descrição** dentro de um texto narrativo, ou afirmando que um trecho “caracteriza” personagem ou ambiente.\nProcure onde a ação **para**.',
  },

  // ── Dissertação ──
  {
    id: 'tt-f-15',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'Expositivo × argumentativo: qual a diferença?',
    back: '**Expositivo**: informa e explica, sem defender tese.\n**Argumentativo**: defende um ponto de vista para **convencer** o leitor.',
  },
  {
    id: 'tt-f-16',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'Certo ou errado? _Texto em 3ª pessoa, sem “eu”, é expositivo._',
    back: '**Errado.** Texto impessoal pode defender tese com firmeza: “É inadmissível que…”. O critério é a finalidade.',
  },
  {
    id: 'tt-f-17',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'O que é a tese?',
    back: 'O **ponto de vista** central que o autor defende e quer que o leitor aceite.\nOs argumentos existem para sustentá-la.',
  },
  {
    id: 'tt-f-18',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'Marcas típicas do texto argumentativo?',
    back: 'Tese; conectivos de **causa**, **conclusão**, **oposição** e **concessão** (pois, portanto, mas, embora); **modalizadores** e avaliações (é preciso, infelizmente, inaceitável).',
  },
  {
    id: 'tt-f-19',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'Certo ou errado? _Usar estatísticas torna o texto expositivo._',
    back: '**Errado.** Dados usados para provar uma posição são **argumentos**. O que separa exposição de argumentação é haver ou não uma tese.',
  },
  {
    id: 'tt-f-20',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'Que tempo verbal é típico da exposição?',
    back: 'O **presente atemporal** (de valor geral): “A água **ferve** a 100 °C ao nível do mar.”\nTambém é comum na argumentação — sozinho, não decide o tipo.',
  },
  {
    id: 'tt-f-21',
    topicId,
    skillId: 'tt-dissertacao',
    front: 'Como costumam cobrar exposição × argumentação em prova?',
    back: 'Certo/errado: “o texto é predominantemente expositivo/argumentativo”. Múltipla escolha: “o trecho que expressa a opinião do autor”.\nPergunte: o autor quer que eu **saiba** ou que eu **concorde**?',
  },

  // ── Injunção e tipo predominante ──
  {
    id: 'tt-f-22',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Qual é a finalidade do texto injuntivo?',
    back: 'Orientar o leitor a **fazer** algo: instruções, ordens, conselhos, normas.\nEx.: receita, manual, bula, regulamento.',
  },
  {
    id: 'tt-f-23',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Marcas linguísticas da injunção?',
    back: '**Imperativo** (faça), **infinitivo** com valor de ordem (agitar antes de usar), **deve-se**, **é proibido**, etapas (primeiro, em seguida, por fim).',
  },
  {
    id: 'tt-f-24',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Certo ou errado? _Um verbo no imperativo basta para o texto ser injuntivo._',
    back: '**Errado.** Um artigo de opinião que termina com “Pense nisso!” continua argumentativo. Vale a finalidade predominante.',
  },
  {
    id: 'tt-f-25',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Como achar o tipo predominante de um texto misto?',
    back: 'Pergunte **para que** o texto foi escrito e qual sequência organiza as outras.\nUma descrição dentro de um conto não o torna descritivo.',
  },
  {
    id: 'tt-f-26',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Tipo × gênero?',
    back: '**Tipo**: modo de organizar o texto (narrativo, descritivo, expositivo, argumentativo, injuntivo) — são poucos.\n**Gênero**: forma concreta que circula (receita, notícia, crônica) — são inúmeros.',
  },
  {
    id: 'tt-f-27',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Certo ou errado? _“Receita culinária” é um tipo textual._',
    back: '**Errado.** Receita é **gênero**; nela predomina o tipo **injuntivo**.',
  },
  {
    id: 'tt-f-28',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Quantos são os tipos textuais?',
    back: 'Depende da classificação. A tradição escolar fala em **narração, descrição e dissertação**; muitos autores listam **narrativo, descritivo, expositivo, argumentativo e injuntivo** (alguns acrescentam o **dialogal**).',
  },
  {
    id: 'tt-f-29',
    topicId,
    skillId: 'tt-injuncao',
    front: 'Como costumam cobrar injunção e tipo predominante em prova?',
    back: '“Predomina no texto o tipo…”, ou certo/errado afirmando que um texto misto “apresenta trecho narrativo, mas é predominantemente argumentativo”.\nJulgue as duas partes do item.',
  },
];
