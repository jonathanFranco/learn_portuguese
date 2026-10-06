import type { Phase, Topic } from '../domain/types';

export const phases: Phase[] = [
  { id: 1, name: 'Fundamentos' },
  { id: 2, name: 'Interpretação' },
  { id: 3, name: 'Sintaxe' },
  { id: 4, name: 'Gramática de concursos' },
  { id: 5, name: 'Aprofundamento' },
  { id: 6, name: 'Domínio' },
];

/** Assunto da trilha. Fica disponível quando existe `topics/<id>.ts` com o conteúdo (ver index.ts). */
export type TopicDef = Omit<Topic, 'available'>;

function topic(
  id: string,
  name: string,
  phase: Topic['phase'],
  prerequisites: string[],
  description: string,
  skills: [string, string][],
): TopicDef {
  return { id, name, description, phase, prerequisites, skills: skills.map(([id, name]) => ({ id, name })) };
}

/** Ordem da trilha = ordem desta lista (define o "próximo passo"). */
export const topics: TopicDef[] = [
  // Fase 1 — Fundamentos
  topic('classes-gramaticais', 'Classes gramaticais', 1, [], 'Substantivo, adjetivo, pronome, verbo, advérbio, preposição e conjunção.', [
    ['cg-substantivo-adjetivo', 'Substantivo e adjetivo'],
    ['cg-pronome', 'Pronomes'],
    ['cg-verbo-adverbio', 'Verbo e advérbio'],
    ['cg-preposicao-conjuncao', 'Preposição e conjunção'],
    ['cg-mudanca-classe', 'A classe depende da função'],
  ]),

  // Fase 2 — Interpretação
  topic('interpretacao', 'Interpretação de texto', 2, [], 'Ideia central, inferência, sentido das palavras e conectivos.', [
    ['in-ideia-central', 'Ideia central'],
    ['in-inferencia', 'Inferência'],
    ['in-sentido-contexto', 'Sentido no contexto'],
    ['in-coesao', 'Referência e conectivos'],
  ]),
  topic('tipologia-textual', 'Tipologia textual', 2, ['interpretacao'], 'Narração, descrição, dissertação e injunção: como reconhecer o tipo que predomina.', [
    ['tt-narracao', 'Narração'],
    ['tt-descricao', 'Descrição'],
    ['tt-dissertacao', 'Dissertação: expor × argumentar'],
    ['tt-injuncao', 'Injunção e tipo predominante'],
  ]),
  topic('generos-textuais', 'Gêneros textuais', 2, ['tipologia-textual'], 'Notícia, editorial, crônica, charge e outros: finalidade, público e marcas de cada gênero.', [
    ['gt-tipo-genero', 'Tipo × gênero'],
    ['gt-jornalisticos', 'Notícia, reportagem e opinião'],
    ['gt-cotidianos', 'Charge, tirinha, anúncio e e-mail'],
    ['gt-literarios', 'Crônica, conto e poema'],
  ]),
  topic('coesao-coerencia', 'Coesão e coerência', 2, ['interpretacao'], 'Retomadas, conectivos, substituições e a lógica do texto.', [
    ['cc-referencial', 'Coesão referencial'],
    ['cc-sequencial', 'Conectivos e relações lógicas'],
    ['cc-substituicao', 'Elipse e substituição lexical'],
    ['cc-coerencia', 'Coerência e contradição'],
  ]),

  // Fase 3 — Sintaxe
  topic('sujeito-predicado', 'Sujeito e predicado', 3, ['classes-gramaticais'], 'Como achar o sujeito, seus tipos e o que é o predicado.', [
    ['sp-identificar', 'Identificar o sujeito'],
    ['sp-tipos', 'Tipos de sujeito'],
    ['sp-posposto', 'Sujeito depois do verbo'],
    ['sp-predicado', 'Predicado'],
  ]),
  topic('complementos-verbais', 'Complementos verbais', 3, ['sujeito-predicado'], 'Transitividade, objeto direto e indireto, complemento nominal e agente da passiva.', [
    ['cmp-transitividade', 'Transitividade do verbo'],
    ['cmp-od-oi', 'Objeto direto × indireto'],
    ['cmp-pronomes', 'O, a, lhe como complemento'],
    ['cmp-complemento-nominal', 'Complemento nominal'],
    ['cmp-agente', 'Agente da passiva'],
  ]),
  topic('adjunto-adverbial', 'Adjunto adverbial', 3, ['sujeito-predicado'], 'As circunstâncias da frase, como diferenciar de complemento e a vírgula no deslocamento.', [
    ['aa-circunstancias', 'Circunstâncias'],
    ['aa-x-objeto', 'Adjunto adverbial × objeto indireto'],
    ['aa-virgula', 'Adjunto deslocado e vírgula'],
    ['aa-adnominal', 'Adjunto adnominal × complemento nominal'],
  ]),
  topic('aposto-vocativo', 'Aposto e vocativo', 3, ['sujeito-predicado'], 'Quem explica (aposto) e quem é chamado (vocativo), e a pontuação de cada um.', [
    ['av-aposto', 'Tipos de aposto'],
    ['av-vocativo', 'Vocativo'],
    ['av-diferenca', 'Aposto × vocativo'],
    ['av-pontuacao', 'Pontuação do aposto e do vocativo'],
  ]),
  topic('periodo-composto', 'Período simples e composto', 3, ['sujeito-predicado'], 'Contar orações, coordenação × subordinação e orações reduzidas.', [
    ['pc-oracao', 'Oração e período'],
    ['pc-coord-sub', 'Coordenação × subordinação'],
    ['pc-reduzidas', 'Orações reduzidas'],
    ['pc-conectivos', 'Conectivos entre orações'],
  ]),

  // Fase 4 — Gramática de concursos
  topic('concordancia-verbal', 'Concordância verbal', 4, ['sujeito-predicado'], 'O verbo e o sujeito: regra geral e os casos que mais caem.', [
    ['cv-regra-geral', 'Regra geral'],
    ['cv-posposto', 'Sujeito depois do verbo'],
    ['cv-haver-fazer', 'Haver e fazer impessoais'],
    ['cv-coletivo', 'Coletivos e “a maioria de”'],
    ['cv-se', 'Voz passiva com “se”'],
  ]),
  topic('crase', 'Crase', 4, ['classes-gramaticais'], 'Quando o “a” leva acento grave — e quando não leva.', [
    ['cr-a-mais-a', 'Crase = a + a'],
    ['cr-proibida', 'Onde não há crase'],
    ['cr-horas-locucoes', 'Horas e locuções'],
    ['cr-facultativa', 'Crase facultativa'],
    ['cr-aquele', 'Àquele, àquela, àquilo'],
  ]),
  topic('concordancia-nominal', 'Concordância nominal', 4, ['classes-gramaticais'], 'Adjetivo, artigo e pronome com o substantivo, e as palavras que mais derrubam: anexo, meio, bastante, é proibido.', [
    ['cn-regra-geral', 'Regra geral e vários substantivos'],
    ['cn-variaveis', 'Anexo, obrigado, mesmo, quite'],
    ['cn-invariaveis', 'Meio, bastante, menos, alerta'],
    ['cn-e-proibido', '“É proibido”, “é necessário”'],
  ]),
  topic('regencia-verbal', 'Regência verbal', 4, ['complementos-verbais'], 'Que preposição o verbo pede: assistir, aspirar, visar, implicar, obedecer, preferir, chegar.', [
    ['rv-conceito', 'O verbo pede preposição?'],
    ['rv-sentido', 'Verbos que mudam de sentido'],
    ['rv-classicos', 'Obedecer, preferir, chegar, esquecer'],
    ['rv-relativo', 'Regência com pronome relativo'],
  ]),
  topic('regencia-nominal', 'Regência nominal', 4, ['regencia-verbal'], 'Substantivos, adjetivos e advérbios que pedem preposição.', [
    ['rn-conceito', 'Nomes que pedem preposição'],
    ['rn-preposicoes', 'A preposição certa'],
    ['rn-relativo', 'Regência nominal com relativo'],
    ['rn-paralelismo', 'Dois nomes, preposições diferentes'],
  ]),
  topic('colocacao-pronominal', 'Colocação pronominal', 4, ['classes-gramaticais'], 'Próclise, ênclise e mesóclise: onde vai o pronome oblíquo.', [
    ['cp-proclise', 'Próclise: palavras atrativas'],
    ['cp-enclise', 'Ênclise'],
    ['cp-mesoclise', 'Mesóclise'],
    ['cp-locucoes', 'Locuções verbais'],
  ]),
  topic('pontuacao', 'Pontuação', 4, ['sujeito-predicado'], 'Vírgula proibida, vírgula obrigatória e os outros sinais.', [
    ['pt-virgula-proibida', 'Vírgula proibida'],
    ['pt-virgula-usos', 'Usos da vírgula'],
    ['pt-oracoes', 'Vírgula entre orações'],
    ['pt-outros-sinais', 'Ponto e vírgula, dois-pontos, travessão'],
  ]),

  // Fase 5 — Aprofundamento
  topic('oracoes-coordenadas', 'Orações coordenadas', 5, ['periodo-composto'], 'Aditivas, adversativas, alternativas, conclusivas e explicativas.', [
    ['oc-assindetica', 'Assindética × sindética'],
    ['oc-aditiva-adversativa', 'Aditivas e adversativas'],
    ['oc-alternativa-conclusiva', 'Alternativas e conclusivas'],
    ['oc-explicativa', 'Explicativas × causais'],
  ]),
  topic('oracoes-subordinadas', 'Orações subordinadas', 5, ['periodo-composto'], 'Substantivas, adjetivas e adverbiais.', [
    ['os-substantivas', 'Substantivas'],
    ['os-adjetivas', 'Adjetivas: restritiva × explicativa'],
    ['os-adverbiais-causa', 'Causa, consequência, condição, finalidade'],
    ['os-adverbiais-concessao', 'Concessão, conformidade, comparação, proporção, tempo'],
  ]),
  topic('funcoes-sintaticas', 'Funções sintáticas', 5, ['sujeito-predicado'], 'Termos da oração, predicativo e as funções do “que” e do “se”.', [
    ['fs-termos', 'Essenciais, integrantes e acessórios'],
    ['fs-predicativo', 'Predicativo do sujeito × do objeto'],
    ['fs-que', 'Funções do “que”'],
    ['fs-se', 'Funções do “se”'],
  ]),
  topic('semantica', 'Semântica', 5, ['interpretacao'], 'Sinônimos, parônimos, denotação × conotação, polissemia e ambiguidade.', [
    ['sm-sinonimia', 'Sinônimos e antônimos no contexto'],
    ['sm-paronimos', 'Parônimos e homônimos'],
    ['sm-denotacao', 'Denotação × conotação'],
    ['sm-ambiguidade', 'Polissemia e ambiguidade'],
  ]),
  topic('figuras-linguagem', 'Figuras de linguagem', 5, ['interpretacao'], 'Metáfora, metonímia, ironia, antítese e as figuras de construção.', [
    ['fl-metafora', 'Metáfora e comparação'],
    ['fl-metonimia', 'Metonímia'],
    ['fl-pensamento', 'Ironia, antítese, paradoxo, hipérbole, eufemismo'],
    ['fl-construcao', 'Elipse, pleonasmo, anáfora, silepse'],
  ]),
  topic('reescrita', 'Reescrita de frases', 5, ['interpretacao'], 'Trocar conectivos, voz e discurso sem mudar o sentido nem quebrar a correção.', [
    ['re-conectivos', 'Conectivos equivalentes'],
    ['re-voz', 'Voz ativa × passiva'],
    ['re-discurso', 'Discurso direto × indireto'],
    ['re-correcao', 'O que quebra a correção'],
  ]),
  topic('variacao-linguistica', 'Variação linguística', 5, ['interpretacao'], 'Variação regional, social, histórica e situacional; norma-padrão e adequação.', [
    ['vl-tipos', 'Tipos de variação'],
    ['vl-norma', 'Norma-padrão × usos populares'],
    ['vl-registro', 'Formal × informal: adequação'],
    ['vl-preconceito', 'Preconceito linguístico'],
  ]),

  // Fase 6 — Domínio
  topic('questoes-mistas', 'Questões mistas', 6, [], 'Gramática dentro do texto: questões que juntam vários assuntos, como na prova.', [
    ['qm-gramatica-texto', 'Gramática no texto'],
    ['qm-reescrita', 'Reescrita e correção'],
    ['qm-pontuacao-concordancia', 'Pontuação, concordância e regência juntas'],
    ['qm-sentido', 'Sentido e efeito de expressões'],
  ]),
  // O simulado (prova com tempo sobre todos os assuntos) não é assunto: fecha a trilha na tela da Trilha.
];
