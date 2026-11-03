import type { LearningModule } from "@/types";
import { d, e, n, box, ROW_BOTTOM, ROW_MAIN, ROW_TOP } from "./diagram-helpers";

/**
 * Trilha de aprendizado: 7 módulos em sequência, do básico à aplicação.
 * Cada módulo tem 4 a 6 lições com blocos variados de conteúdo.
 */

export const modules: LearningModule[] = [
  /* ================================================================ */
  /* 1. FUNDAMENTOS                                                    */
  /* ================================================================ */
  {
    id: "mod-fundamentos",
    order: 1,
    title: "Fundamentos de BPMN",
    subtitle: "O que é processos, notação e como ler um diagrama",
    icon: "BookOpen",
    summary:
      "Entenda o que é um processo de negócio, para que serve a notação BPMN e quais são os três elementos que compõem qualquer diagrama.",
    lessons: [
      {
        id: "li-fundamentos-o-que-e",
        title: "O que é um processo de negócio",
        blocks: [
          {
            type: "text",
            text:
              "Um processo de negócio é uma sequência de atividades que transforma uma entrada em um resultado com valor para alguém. Pedir um pizza, contratar um funcionário ou emitir uma nota fiscal são processos: todos têm um início, uma série de etapas e um desfecho.",
          },
          {
            type: "bullets",
            items: [
              "Entrada: o que dispara ou alimenta o processo (um pedido, uma solicitação).",
              "Atividades: o trabalho de fato executado por pessoas ou sistemas.",
              "Decisões: pontos em que o fluxo se divide conforme uma condição.",
              "Resultado: o desfecho alcançado, registrado em um evento de fim.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Por que modelar?",
            text:
              "Um processo documentado de forma padronizada reduz ambiguidades, permite medir tempos e custos e é a base para automatizar etapas com segurança.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Descreva a situação",
                text: "Escreva em uma frase o que acontece e qual resultado se espera.",
              },
              {
                title: "Liste as etapas",
                text: "Identifique quem faz o quê, e em que ordem.",
              },
              {
                title: "Marque as decisões",
                text: "Separe os pontos em que o caminho pode mudar.",
              },
              {
                title: "Defina os desfechos",
                text: "Liste todos os resultados possíveis do processo.",
              },
            ],
          },
        ],
      },
      {
        id: "li-fundamentos-notacao",
        title: "Para que serve a notação BPMN",
        blocks: [
          {
            type: "text",
            text:
              "BPMN (Business Process Model and Notation) é uma notação gráfica padronizada pela OMG e reconhecida pela norma ISO/IEC 19510. Ela define formas, símbolos e regras para descrever processos de forma que qualquer parte interessada — analista, gestor ou desenvolvedor — leia o mesmo diagrama da mesma maneira.",
          },
          {
            type: "comparison",
            header: ["Sem notação", "Com BPMN"],
            rows: [
              {
                label: "Comunicação",
                a: "Cada um desenha como pode; discussões sobre forma, não sobre conteúdo.",
                b: "Forma padronizada: a discussão fica sobre o processo em si.",
              },
              {
                label: "Precisão",
                a: "Ambiguidades escondem erros de lógica.",
                b: "Símbolos específicos separam decisão, espera e falha.",
              },
              {
                label: "Automação",
                a: "Difícil traduzir o desenho em regra de sistema.",
                b: "A notação é interpretável por motores de processo (BPMN engines).",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Cores são opcionais",
            text:
              "A especificação padroniza forma e significado, não a cor. Paletas de cores ajudam na leitura, desde que não contradigam a notação.",
          },
        ],
      },
      {
        id: "li-fundamentos-tres-elementos",
        title: "Eventos, atividades e fluxos",
        blocks: [
          {
            type: "text",
            text:
              "Todo diagrama BPMN é montado com três famílias de elementos. Reconhecê-las é o primeiro passo para ler qualquer processo.",
          },
          {
            type: "symbolCards",
            symbolIds: ["event-start", "task", "flow-sequence"],
          },
          {
            type: "bullets",
            items: [
              "Eventos (círculos): ocorrências que iniciam, interrompem ou encerram o fluxo.",
              "Atividades (retângulos): o trabalho executado dentro do processo.",
              "Fluxos (linhas): a ordem de execução entre os elementos.",
            ],
          },
          {
            type: "diagram",
            caption:
              "Um processo mínimo: um evento de início, duas atividades e um evento de fim, ligados por fluxos de sequência.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
                n("t1", "task", 300, ROW_MAIN, { label: "Conferir o pedido" }),
                n("t2", "task", 540, ROW_MAIN, { label: "Separar os itens" }),
                n("e1", "end", 780, ROW_MAIN, { label: "Pedido pronto" }),
              ],
              [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
            ),
            highlightNodeIds: ["s", "t1", "e1"],
          },
        ],
      },
      {
        id: "li-fundamentos-ler-diagrama",
        title: "Como ler um diagrama",
        blocks: [
          {
            type: "text",
            text:
              "A leitura de um diagrama BPMN segue sempre a mesma direção: comece pelo evento de início (borda fina) e siga as setas até os eventos de fim (borda grossa). Gateways indicam onde o caminho se divide.",
          },
          {
            type: "steps",
            items: [
              {
                title: "1. Encontre o início",
                text: "Círculo de borda fina, normalmente à esquerda. Só há um.",
              },
              {
                title: "2. Siga o fluxo",
                text: "As setas preenchidas mostram a ordem das etapas.",
              },
              {
                title: "3. Pare nos gateways",
                text: "Losangos indicam divisões: leia os rótulos das saídas.",
              },
              {
                title: "4. Chegue aos fins",
                text: "Círculos de borda grossa marcam os resultados possíveis.",
              },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Cuidado com linhas cruzadas",
            text:
              "Quando uma conexão cruza outra sem relação, prefira reposicionar os elementos. Diagrama legível é diagrama que comunica.",
          },
        ],
      },
    ],
    challengeIds: ["des-05-sem-inicio", "des-08-processo-sem-fim"],
    quizCategories: ["fundamentos", "interpretacao"],
    unlockAfter: [],
  },

  /* ================================================================ */
  /* 2. EVENTOS                                                        */
  /* ================================================================ */
  {
    id: "mod-eventos",
    order: 2,
    title: "Eventos",
    subtitle: "Início, intermediário e fim — e seus marcadores",
    icon: "Zap",
    summary:
      "Domine o elemento circular do BPMN: borda fina, dupla e grossa, além dos marcadores de mensagem, temporizador, erro e os demais tipos.",
    lessons: [
      {
        id: "li-eventos-visao-geral",
        title: "O elemento circular e suas três fases",
        blocks: [
          {
            type: "text",
            text:
              "Eventos representam ocorrências: algo acontece, e o processo reage. A forma é sempre um círculo; o que muda é a borda, que indica a posição do evento no fluxo.",
          },
          {
            type: "bullets",
            items: [
              "Início (borda fina): tem entrada? Nunca. Tem saída? Sempre.",
              "Intermediário (borda dupla): fica no meio do fluxo, com entrada e saída.",
              "Fim (borda grossa): recebe o fluxo e nunca tem saída.",
            ],
          },
          {
            type: "symbolCards",
            symbolIds: ["event-start", "event-intermediate", "event-end"],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Regra de ouro",
            text:
              "Fina = começa · Dupla = acontece no meio · Grossa = termina. Essa regra vale para qualquer marcador interno.",
          },
        ],
      },
      {
        id: "li-eventos-inicio",
        title: "Eventos de início e seus gatilhos",
        blocks: [
          {
            type: "text",
            text:
              "O evento de início indica quando uma instância do processo nasce. A variante escolhida diz qual é o gatilho: uma mensagem, um horário, um sinal ou nenhum gatilho explícito.",
          },
          {
            type: "symbolCards",
            symbolIds: [
              "event-start",
              "event-start-message",
              "event-start-timer",
              "event-start-signal",
            ],
          },
          {
            type: "bullets",
            items: [
              "Simples: o processo começa por decisão humana ou por fluxo de trabalho.",
              "Mensagem: outro participante ou sistema dispara o início (pedido por API, e-mail).",
              "Temporizador: rotinas recorrentes, como relatórios diários às 18h.",
              "Sinal: um broadcast dispara vários processos ao mesmo tempo.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Um processo, um início",
            text:
              "Múltiplos eventos de início só são válidos em subprocessos com gatilhos diferentes. No processo principal, mantenha um único início.",
          },
        ],
      },
      {
        id: "li-eventos-intermediarios",
        title: "Eventos intermediários: esperas e verificações",
        blocks: [
          {
            type: "text",
            text:
              "Eventos intermediários ficam entre etapas. Os mais usados modelam esperas deliberadas — por mensagem ou por tempo — sem transformar a espera em uma atividade.",
          },
          {
            type: "symbolCards",
            symbolIds: [
              "event-intermediate",
              "event-intermediate-message",
              "event-intermediate-timer",
            ],
          },
          {
            type: "diagram",
            caption:
              "Após enviar a cobrança, o processo espera 5 dias antes de verificar o pagamento.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Cobrança emitida" }),
                n("t1", "task", 300, ROW_MAIN, { label: "Emitir a cobrança", taskType: "send" }),
                n("i1", "intermediate", 540, ROW_MAIN, { label: "Esperar 5 dias", marker: "timer" }),
                n("t2", "task", 780, ROW_MAIN, { label: "Verificar o pagamento" }),
                n("e1", "end", 1000, ROW_MAIN, { label: "Cobrança concluída" }),
              ],
              [
                e("f1", "s", "t1"),
                e("f2", "t1", "i1"),
                e("f3", "i1", "t2"),
                e("f4", "t2", "e1"),
              ]
            ),
            highlightNodeIds: ["i1"],
          },
          {
            type: "callout",
            tone: "info",
            title: "Espera é evento, não tarefa",
            text:
              "'Aguardar resposta' não executa trabalho: é um evento intermediário de mensagem. A tarefa vem depois, quando a resposta chega.",
          },
        ],
      },
      {
        id: "li-eventos-fim",
        title: "Eventos de fim e desfechos",
        blocks: [
          {
            type: "text",
            text:
              "O evento de fim encerra a instância do processo. O marcador interno diz como ele termina: normalmente, emitindo uma mensagem, propagando um erro ou interrompendo todas as rotas.",
          },
          {
            type: "symbolCards",
            symbolIds: [
              "event-end",
              "event-end-message",
              "event-end-error",
              "event-end-terminate",
            ],
          },
          {
            type: "bullets",
            items: [
              "Simples: desfecho normal; rotule com o resultado alcançado.",
              "Mensagem: o processo termina comunicando alguém.",
              "Erro: propaga uma falha tratada (usado em subprocessos).",
              "Termina: encerra imediatamente todas as rotas paralelas.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Fim não tem saída",
            text:
              "Se o fluxo continua depois de um evento de fim, o elemento está errado — troque-o por um evento intermediário.",
          },
        ],
      },
      {
        id: "li-eventos-excecoes",
        title: "Erros e escalonamentos",
        blocks: [
          {
            type: "text",
            text:
              "Eventos de exceção ficam anexados à borda de uma atividade (eventos de fronteira). Eles desviam o fluxo quando algo dá errado ou quando a espera excede um limite — sem interromper a atividade original no caso do escalonamento.",
          },
          {
            type: "symbolCards",
            symbolIds: ["event-intermediate-error", "event-intermediate-escalation"],
          },
          {
            type: "comparison",
            header: ["Erro (error)", "Escalonamento (escalation)"],
            rows: [
              {
                label: "O que indica",
                a: "Falha técnica ou exceção do processo.",
                b: "Necessidade de atenção de um nível superior.",
              },
              {
                label: "Interrompe a atividade?",
                a: "Sim, quando anexado como fronteira interruptiva.",
                b: "Não — a atividade continua em paralelo.",
              },
              {
                label: "Uso típico",
                a: "Banco recusou a transação; integração caiu.",
                b: "Análise parada há 2 dias; aprovação acima do limite.",
              },
            ],
          },
        ],
      },
    ],
    challengeIds: ["des-03-atendimento", "des-09-identificar-simbolos"],
    quizCategories: ["eventos"],
    unlockAfter: ["mod-fundamentos"],
  },

  /* ================================================================ */
  /* 3. ATIVIDADES                                                     */
  /* ================================================================ */
  {
    id: "mod-atividades",
    order: 3,
    title: "Atividades e subprocessos",
    subtitle: "Tarefas, seus tipos e quando detalhar em subprocessos",
    icon: "Layers",
    summary:
      "Aprenda a nomear corretamente as tarefas, a escolher o tipo certo (usuário, serviço, manual, envio, recebimento) e a decidir entre subprocesso e atividade de chamada.",
    lessons: [
      {
        id: "li-atividades-tarefa",
        title: "A tarefa e como nomeá-la",
        blocks: [
          {
            type: "text",
            text:
              "A tarefa é o elemento mais frequente de qualquer processo: representa uma unidade de trabalho com início e fim definidos. O rótulo deve descrever a ação de forma verificável.",
          },
          {
            type: "symbolCards",
            symbolIds: ["task"],
          },
          {
            type: "comparison",
            header: ["Ruim", "Bom"],
            rows: [
              { label: "Rótulo", a: "Processamento", b: "Validar os dados do cadastro" },
              { label: "Rótulo", a: "Cliente", b: "Registrar o pedido no sistema" },
              { label: "Granularidade", a: "Realizar todo o faturamento", b: "Emitir a nota fiscal" },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Verbo no infinitivo com objeto",
            text:
              "Escreva 'Revisar a nota fiscal', não 'Revisão'. A frase deve responder: o que é feito, e sobre o quê.",
          },
        ],
      },
      {
        id: "li-atividades-tipos",
        title: "Os tipos de tarefa",
        blocks: [
          {
            type: "text",
            text:
              "O ícone no canto superior esquerdo diz quem executa e como. Escolher o tipo certo evita discussões sobre responsabilidade depois.",
          },
          {
            type: "symbolCards",
            symbolIds: [
              "task-user",
              "task-service",
              "task-manual",
              "task-send",
              "task-receive",
              "task-script",
            ],
          },
          {
            type: "bullets",
            items: [
              "Usuário: pessoa executa dentro de um sistema (aprovar, revisar).",
              "Serviço: aplicação executa automaticamente (API, consulta, cálculo).",
              "Manual: trabalho físico fora de um sistema (conferir, transportar).",
              "Envio: emite uma mensagem e segue — não espera resposta.",
              "Recebimento: pausa até uma mensagem chegar.",
              "Script: lógica local embutida no motor de processo.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Envio não é espera",
            text:
              "Se o processo aguarda uma resposta, use evento intermediário de mensagem (ou tarefa de recebimento) — não uma tarefa de envio.",
          },
        ],
      },
      {
        id: "li-atividades-subprocesso",
        title: "Subprocesso e atividade de chamada",
        blocks: [
          {
            type: "text",
            text:
              "Quando uma parte do processo tem etapas próprias, condense-a. O subprocesso (com '+' no rodapé) guarda um fluxo interno; a atividade de chamada (borda grossa) invoca um processo definido em outro lugar.",
          },
          {
            type: "symbolCards",
            symbolIds: ["subprocess", "subprocess-expanded", "call-activity"],
          },
          {
            type: "comparison",
            header: ["Subprocesso", "Call Activity"],
            rows: [
              { label: "Escopo", a: "Interno ao processo atual", b: "Processo externo e reutilizável" },
              { label: "Marcador", a: "'+' no rodapé", b: "Borda grossa" },
              { label: "Contexto", a: "Mesmas variáveis do processo", b: "Variáveis próprias de entrada/saída" },
              { label: "Uso típico", a: "Detalhe que poluiria o diagrama", b: "'Emitir nota' usado por vários processos" },
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Subprocesso precisa de início e fim",
            text:
              "O fluxo interno de um subprocesso começa em um evento de início e termina em um evento de fim próprios.",
          },
        ],
      },
      {
        id: "li-atividades-decisao",
        title: "Atividade não decide: gateway decide",
        blocks: [
          {
            type: "text",
            text:
              "Um erro clássico é transformar a tarefa em ponto de decisão, dando três ou quatro saídas diretas a ela. A execução executa; a decisão é papel do gateway.",
          },
          {
            type: "diagram",
            caption:
              "Depois da tarefa, um gateway exclusivo separa os caminhos com rótulos de condição.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Nota recebida" }),
                n("t1", "task", 300, ROW_MAIN, { label: "Revisar a nota", taskType: "user" }),
                n("gw", "gateway", 540, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
                n("t2", "task", 780, ROW_TOP, { label: "Pagar a nota" }),
                n("t3", "task", 780, ROW_BOTTOM, { label: "Corrigir a nota" }),
                n("e1", "end", 1000, ROW_TOP, { label: "Nota paga" }),
                n("e2", "end", 1000, ROW_BOTTOM, { label: "Nota devolvida" }),
              ],
              [
                e("f1", "s", "t1"),
                e("f2", "t1", "gw"),
                e("f3", "gw", "t2", "Sim"),
                e("f4", "gw", "t3", "Não"),
                e("f5", "t2", "e1"),
                e("f6", "t3", "e2"),
              ]
            ),
            highlightNodeIds: ["gw"],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Sinal de alerta",
            text:
              "Uma tarefa com mais de duas saídas diretas quase sempre indica um gateway esquecido no meio.",
          },
        ],
      },
    ],
    challengeIds: ["des-02-pagamento", "des-04-contratacao"],
    quizCategories: ["atividades"],
    unlockAfter: ["mod-eventos"],
  },

  /* ================================================================ */
  /* 4. GATEWAYS                                                       */
  /* ================================================================ */
  {
    id: "mod-gateways",
    order: 4,
    title: "Gateways e decisões",
    subtitle: "Exclusivo, paralelo, inclusivo e baseado em eventos",
    icon: "GitBranch",
    summary:
      "O ponto de controle do fluxo: aprenda quando dividir, quando sincronizar e qual dos cinco gateways usar em cada situação.",
    lessons: [
      {
        id: "li-gateways-visao",
        title: "O que é um gateway",
        blocks: [
          {
            type: "text",
            text:
              "O gateway é um losango que controla o fluxo: divide caminhos, decide rotas e sincroniza ramos. Ele não executa trabalho — apenas direciona o token.",
          },
          {
            type: "symbolCards",
            symbolIds: [
              "gateway-exclusive",
              "gateway-parallel",
              "gateway-inclusive",
              "gateway-event-based",
              "gateway-complex",
            ],
          },
          {
            type: "bullets",
            items: [
              "Divisão (diverging): uma entrada, duas ou mais saídas.",
              "Junção (joining): duas ou mais entradas, uma saída.",
              "O marcador interno é o mesmo nas duas funções — o que muda é o contexto.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Sem trabalho, sem rótulo",
            text:
              "Um gateway de uma única saída não decide nada. Se não há divisão nem junção, remova o gateway e conecte direto.",
          },
        ],
      },
      {
        id: "li-gateways-exclusivo",
        title: "Gateway exclusivo (XOR)",
        blocks: [
          {
            type: "text",
            text:
              "O marcador 'X' indica escolha mutuamente exclusiva: exatamente uma saída é executada. As condições das saídas se excluem — 'Sim' e 'Não' nunca valer ao mesmo tempo.",
          },
          {
            type: "symbolCards",
            symbolIds: ["gateway-exclusive"],
          },
          {
            type: "diagram",
            caption: "Apenas um caminho é escolhido conforme a condição.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Nota recebida" }),
                n("gw", "gateway", 300, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
                n("t1", "task", 540, ROW_TOP, { label: "Pagar a nota" }),
                n("t2", "task", 540, ROW_BOTTOM, { label: "Corrigir a nota" }),
                n("e1", "end", 780, ROW_TOP, { label: "Nota paga" }),
                n("e2", "end", 780, ROW_BOTTOM, { label: "Nota devolvida" }),
              ],
              [
                e("f1", "s", "gw"),
                e("f2", "gw", "t1", "Sim"),
                e("f3", "gw", "t2", "Não"),
                e("f4", "t1", "e1"),
                e("f5", "t2", "e2"),
              ]
            ),
            highlightNodeIds: ["gw"],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Rotule todas as saídas",
            text:
              "Uma decisão exclusiva sem rótulos é ambígua: ninguém sabe qual caminho a condição ativa.",
          },
        ],
      },
      {
        id: "li-gateways-paralelo",
        title: "Gateway paralelo (AND)",
        blocks: [
          {
            type: "text",
            text:
              "O marcador '+' ativa todos os caminhos ao mesmo tempo, sem nenhuma condição. A junção paralela correspondente espera todos os ramos antes de seguir — se faltar um, o fluxo trava.",
          },
          {
            type: "symbolCards",
            symbolIds: ["gateway-parallel"],
          },
          {
            type: "diagram",
            caption:
              "Divisão e junção paralelas: ambos os ramos executam e depois sincronizam.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Contrato aprovado" }),
                n("gw1", "gateway", 280, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
                n("t1", "task", 520, ROW_TOP, { label: "Preparar o posto" }),
                n("t2", "task", 520, ROW_BOTTOM, { label: "Cadastrar no sistema" }),
                n("gw2", "gateway", 760, ROW_MAIN, { gateway: "parallel", label: "Juntar" }),
                n("e1", "end", 980, ROW_MAIN, { label: "Tudo pronto" }),
              ],
              [
                e("f1", "s", "gw1"),
                e("f2", "gw1", "t1"),
                e("f3", "gw1", "t2"),
                e("f4", "t1", "gw2"),
                e("f5", "t2", "gw2"),
                e("f6", "gw2", "e1"),
              ]
            ),
            highlightNodeIds: ["gw1", "gw2"],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Não rotule saídas paralelas",
            text:
              "Condição em saída de paralelo é contradição: todos os caminhos executam, sempre.",
          },
        ],
      },
      {
        id: "li-gateways-inclusivo",
        title: "Gateway inclusivo (OR)",
        blocks: [
          {
            type: "text",
            text:
              "O marcador 'O' cobre o caso em que um ou mais caminhos podem valer ao mesmo tempo. É o gateway de condições que não se excluem — por exemplo, aprovação do gestor e, se o valor for alto, também da diretoria.",
          },
          {
            type: "symbolCards",
            symbolIds: ["gateway-inclusive"],
          },
          {
            type: "comparison",
            header: ["Exclusivo (XOR)", "Inclusivo (OR)"],
            rows: [
              { label: "Saídas executadas", a: "Exatamente uma", b: "Uma ou mais" },
              { label: "Condições", a: "Se excluem mutuamente", b: "Podem valer juntas" },
              { label: "Junção", a: "Qualquer entrada (não sincroniza)", b: "Espera apenas os ramos ativados" },
              { label: "Exemplo", a: "Aprovado OU reprovado", b: "Gestor E/OU diretoria" },
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Junção inclusiva",
            text:
              "Depois de um divisivo inclusivo, use uma junção inclusiva: ela sincroniza somente os ramos que realmente executaram.",
          },
        ],
      },
      {
        id: "li-gateways-eventos-complexo",
        title: "Baseado em eventos e complexo",
        blocks: [
          {
            type: "text",
            text:
              "O gateway baseado em eventos (pentágono interno) decide pelo tempo: vence o evento que chegar primeiro. O complexo (asterisco) aplica regras de sincronização personalizadas.",
          },
          {
            type: "symbolCards",
            symbolIds: ["gateway-event-based", "gateway-complex"],
          },
          {
            type: "diagram",
            caption:
              "Vence o evento que chegar primeiro: resposta do cliente ou fim do prazo.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Proposta enviada" }),
                n("gw", "gateway", 300, ROW_MAIN, { gateway: "eventBased", label: "Esperar" }),
                n("i1", "intermediate", 540, ROW_TOP, { label: "Resposta recebida", marker: "message" }),
                n("i2", "intermediate", 540, ROW_BOTTOM, { label: "Prazo expirado", marker: "timer" }),
                n("t1", "task", 780, ROW_TOP, { label: "Registrar a resposta" }),
                n("e1", "end", 1000, ROW_TOP, { label: "Resposta tratada" }),
                n("e2", "end", 780, ROW_BOTTOM, { label: "Encerrar sem resposta" }),
              ],
              [
                e("f1", "s", "gw"),
                e("f2", "gw", "i1"),
                e("f3", "gw", "i2"),
                e("f4", "i1", "t1"),
                e("f5", "t1", "e1"),
                e("f6", "i2", "e2"),
              ]
            ),
            highlightNodeIds: ["gw"],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Baseado em eventos não avalia dados",
            text:
              "Se a escolha depende de uma condição de negócio, use exclusivo. O gateway de eventos espera ocorrências reais.",
          },
        ],
      },
    ],
    challengeIds: ["des-01-compra", "des-06-gateway-quebrado", "des-10-simulacao-pedido"],
    quizCategories: ["gateways"],
    unlockAfter: ["mod-atividades"],
  },

  /* ================================================================ */
  /* 5. CONEXÕES, POOLS E LANES                                        */
  /* ================================================================ */
  {
    id: "mod-conexoes",
    order: 5,
    title: "Conexões, pools e lanes",
    subtitle: "Sequência, mensagem, associação e a estrutura do diagrama",
    icon: "Link2",
    summary:
      "As três linhas do BPMN e a estrutura organizacional: quando usar cada conexão e como separar participantes e responsabilidades.",
    lessons: [
      {
        id: "li-conexoes-tipos",
        title: "Os três tipos de conexão",
        blocks: [
          {
            type: "text",
            text:
              "Cada linha tem uma semântica própria. Trocar uma pela outra muda o significado do diagrama — e é justamente o erro que o desafio de correção entre pools testa.",
          },
          {
            type: "symbolCards",
            symbolIds: ["flow-sequence", "flow-message", "flow-association"],
          },
          {
            type: "bullets",
            items: [
              "Sequência (contínua, seta preenchida): liga elementos da mesma pool e mostra a ordem de execução.",
              "Mensagem (tracejada, seta aberta): comunica participantes de pools diferentes.",
              "Associação (pontilhada, sem seta): vincula artefatos — anotações, dados e grupos — a etapas.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Associação não tem seta",
            text:
              "A associação é pontilhada e sem ponta: ela vincula anotações e dados a etapas, sem indicar ordem.",
          },
        ],
      },
      {
        id: "li-conexoes-regras",
        title: "Regras de conexão que não podem falhar",
        blocks: [
          {
            type: "bullets",
            items: [
              "Fluxo de sequência só existe dentro da mesma pool.",
              "Entre pools diferentes, apenas fluxo de mensagem.",
              "Eventos de fim não têm saída.",
              "Eventos de início não têm entrada.",
              "Associação liga artefatos (anotações, dados, grupos), não duas etapas.",
              "Nenhum elemento de fluxo pode ficar isolado do caminho principal.",
            ],
          },
          {
            type: "diagram",
            caption:
              "Entre 'Cliente' e 'Loja' a ligação correta é o fluxo de mensagem — linha tracejada.",
            diagram: d(
              [
                box("p1", "pool", 40, 20, 760, 130, { poolName: "Cliente" }),
                box("p2", "pool", 40, 170, 760, 140, { poolName: "Loja" }),
                n("s", "start", 140, 90, { label: "Cliente decide comprar" }, { poolId: "p1" }),
                n("t1", "task", 420, 90, { label: "Enviar o pedido", taskType: "send" }, { poolId: "p1" }),
                n("t2", "task", 300, 245, { label: "Receber o pedido", taskType: "receive" }, { poolId: "p2" }),
                n("e1", "end", 580, 245, { label: "Pedido registrado" }, { poolId: "p2" }),
              ],
              [
                e("f1", "s", "t1"),
                e("m1", "t1", "t2", undefined, "message"),
                e("f2", "t2", "e1"),
              ]
            ),
            highlightNodeIds: ["t1", "t2"],
          },
        ],
      },
      {
        id: "li-conexoes-pools",
        title: "Pools e participantes",
        blocks: [
          {
            type: "text",
            text:
              "A pool representa um participante independente — organização, departamento ou papel. Em diagramas de colaboração, cada processo fica em sua própria pool, e as trocas acontecem por mensagens.",
          },
          {
            type: "symbolCards",
            symbolIds: ["pool", "participant"],
          },
          {
            type: "bullets",
            items: [
              "Pool com processo: mostra o fluxo interno do participante.",
              "Pool em caixa-preta: só troca mensagens, sem detalhar o processo.",
              "O nome do participante fica na barra lateral esquerda.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Colaboração x processo único",
            text:
              "Um diagrama de processo único tem uma pool. Mais de um processo interagindo exige uma pool por participante.",
          },
        ],
      },
      {
        id: "li-conexoes-lanes",
        title: "Lanes: quem é responsável",
        blocks: [
          {
            type: "text",
            text:
              "As lanes (raias) dividem a pool em faixas horizontais, cada uma com um responsável. Elas não mudam a execução — mudam a leitura de quem faz o quê.",
          },
          {
            type: "symbolCards",
            symbolIds: ["lane"],
          },
          {
            type: "diagram",
            caption: "Cada raia reúne as etapas de um responsável.",
            diagram: d(
              [
                box("p1", "pool", 40, 10, 840, 280, { poolName: "Atendimento" }),
                box("l1", "lane", 74, 40, 786, 120, { laneName: "Atendente" }, { poolId: "p1" }),
                box("l2", "lane", 74, 165, 786, 115, { laneName: "Supervisor" }, { poolId: "p1" }),
                n("s", "start", 140, 100, { label: "Chamada recebida" }, { poolId: "p1", laneId: "l1" }),
                n("t1", "task", 340, 100, { label: "Atender o cliente" }, { poolId: "p1", laneId: "l1" }),
                n("gw", "gateway", 560, 100, { gateway: "exclusive", label: "Resolvido?" }, { poolId: "p1", laneId: "l1" }),
                n("t2", "task", 760, 222, { label: "Revisar o caso" }, { poolId: "p1", laneId: "l2" }),
                n("e1", "end", 340, 222, { label: "Chamada encerrada" }, { poolId: "p1", laneId: "l2" }),
              ],
              [
                e("f1", "s", "t1"),
                e("f2", "t1", "gw"),
                e("f3", "gw", "e1", "Sim"),
                e("f4", "gw", "t2", "Não"),
              ]
            ),
            highlightNodeIds: ["l1", "l2"],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Raias cruzam fluxos",
            text:
              "O fluxo de sequência pode atravessar raias — é assim que se mostra a passagem de responsabilidade entre áreas.",
          },
        ],
      },
    ],
    challengeIds: ["des-07-fluxo-entre-pools"],
    quizCategories: ["conexoes", "pools"],
    unlockAfter: ["mod-gateways"],
  },

  /* ================================================================ */
  /* 6. PRÁTICA NO LABORATÓRIO                                         */
  /* ================================================================ */
  {
    id: "mod-pratica",
    order: 6,
    title: "Prática no laboratório",
    subtitle: "Monte, corrija, identifique e simule processos reais",
    icon: "FlaskConical",
    summary:
      "Aplique tudo o que aprendeu em 10 desafios: construir diagramas do zero, corrigir erros de notação, identificar símbolos e simular fluxos.",
    lessons: [
      {
        id: "li-pratica-montar",
        title: "Como montar um processo do zero",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "1. Leia a situação-problema",
                text: "Sublinhe gatilhos, decisões ('se... senão') e desfechos.",
              },
              {
                title: "2. Coloque o início e o fim",
                text: "Evento de início à esquerda; eventos de fim para cada resultado.",
              },
              {
                title: "3. Lance as atividades",
                text: "Uma tarefa por unidade de trabalho, com verbo e objeto.",
              },
              {
                title: "4. Insira os gateways",
                text: "Onde houver 'se', coloque um exclusivo e rotule as saídas.",
              },
              {
                title: "5. Valide",
                text: "Rode a validação e elimine todos os erros antes de concluir.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Comece sempre pelos extremos",
            text:
              "Montar início e fim primeiro cria o 'esqueleto' do processo e evita atividades órfãs.",
          },
        ],
      },
      {
        id: "li-pratica-corrigir",
        title: "Como diagnosticar erros de notação",
        blocks: [
          {
            type: "text",
            text:
              "No modo 'Corrija', a validação acusa o problema — o trabalho é entender por que ele existe e consertar a causa, não apenas apagar o sintoma.",
          },
          {
            type: "bullets",
            items: [
              "Falta de início/fim: o processo não tem gatilho nem resultado definido.",
              "Gateway com uma saída: não é decisão — divida ou remova.",
              "Atividade isolada: alguém foi esquecido do fluxo.",
              "Sequência entre pools: troque para fluxo de mensagem.",
              "Fim com saída: o elemento de fim não é um intermediário.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Leia o rascunho inteiro",
            text:
              "Um diagrama pode ter vários problemas ao mesmo tempo. Corrija todos antes de validar: a checagem só passa quando nenhum erro persiste.",
          },
        ],
      },
      {
        id: "li-pratica-identificar",
        title: "Leitura rápida de símbolos",
        blocks: [
          {
            type: "text",
            text:
              "No modo 'Identifique', clique nos elementos e escolha o símbolo correto. Use sempre a mesma ordem de raciocínio dos especialistas.",
          },
          {
            type: "steps",
            items: [
              {
                title: "1. Forma",
                text: "Círculo (evento), retângulo (atividade) ou losango (gateway)?",
              },
              {
                title: "2. Borda",
                text: "Se for círculo: fina = início, dupla = intermediário, grossa = fim.",
              },
              {
                title: "3. Marcador",
                text: "Relógio, envelope, raio, triângulo, '+', 'X', 'O'…",
              },
              {
                title: "4. Ícone da tarefa",
                text: "Pessoa, engrenagem, mão, seta para fora ou para dentro.",
              },
            ],
          },
        ],
      },
      {
        id: "li-pratica-simular",
        title: "Simulação: o token percorre o fluxo",
        blocks: [
          {
            type: "text",
            text:
              "A simulação executa o processo como um token: ele parte do início, atravessa as atividades e pausa nos gateways para você escolher o caminho. O percurso fica destacado no diagrama.",
          },
          {
            type: "bullets",
            items: [
              "Rode o processo mais de uma vez, mudando as respostas.",
              "Compare os desfechos: cada combinação leva a um fim diferente.",
              "Se o token parar, há uma atividade sem saída ou um gateway mal conectado.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Simulação é validação viva",
            text:
              "Um diagrama que não termina na simulação tem problema de conexão — mesmo que a checagem estática esteja limpa.",
          },
        ],
      },
    ],
    challengeIds: [
      "des-01-compra",
      "des-02-pagamento",
      "des-03-atendimento",
      "des-04-contratacao",
      "des-05-sem-inicio",
      "des-06-gateway-quebrado",
      "des-07-fluxo-entre-pools",
      "des-08-processo-sem-fim",
      "des-09-identificar-simbolos",
      "des-10-simulacao-pedido",
    ],
    quizCategories: ["pratica", "interpretacao"],
    unlockAfter: ["mod-conexoes"],
  },

  /* ================================================================ */
  /* 7. AVALIAÇÃO                                                      */
  /* ================================================================ */
  {
    id: "mod-avaliacao",
    order: 7,
    title: "Avaliação final",
    subtitle: "Consolide o conteúdo e meça seu domínio da notação",
    icon: "GraduationCap",
    summary:
      "Revise os pontos-chave de toda a trilha e responda ao quiz completo para consolidar o aprendizado.",
    lessons: [
      {
        id: "li-avalicao-revisao",
        title: "Revisão: o essencial da notação",
        blocks: [
          {
            type: "bullets",
            items: [
              "Eventos: círculo — fina (início), dupla (intermediário), grossa (fim).",
              "Atividades: retângulo; o ícone diz quem executa.",
              "Gateways: losango — X (exclusivo), + (paralelo), O (inclusivo).",
              "Sequência só dentro da pool; entre pools, mensagem.",
              "Toda atividade tem entrada e saída; todo processo tem início e fim.",
              "Decisão é gateway, nunca tarefa.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Erros mais cobrados",
            text:
              "Gateway com uma saída, atividade sem fluxo, sequência entre pools e evento de fim com saída concentram a maioria das falhas em avaliação.",
          },
        ],
      },
      {
        id: "li-avalicao-checklist",
        title: "Checklist de revisão de um diagrama",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "1. Estrutura",
                text: "Um início? Ao menos um fim? Todos conectados?",
              },
              {
                title: "2. Decisões",
                text: "Gateways com saídas rotuladas e tipos corretos?",
              },
              {
                title: "3. Conexões",
                text: "Sequência dentro da pool, mensagem entre pools?",
              },
              {
                title: "4. Rótulos",
                text: "Verbos com objeto nos rótulos de tarefa?",
              },
              {
                title: "5. Simulação",
                text: "O fluxo termina em todas as respostas possíveis?",
              },
            ],
          },
          {
            type: "diagram",
            caption:
              "Estrutura de referência: início, tarefa, decisão exclusiva com dois desfechos rotulados.",
            diagram: d(
              [
                n("s", "start", 80, ROW_MAIN, { label: "Solicitação recebida" }),
                n("t1", "task", 300, ROW_MAIN, { label: "Analisar a solicitação", taskType: "user" }),
                n("gw", "gateway", 540, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
                n("t2", "task", 780, ROW_TOP, { label: "Executar a solicitação" }),
                n("t3", "task", 780, ROW_BOTTOM, { label: "Rejeitar com justificativa", taskType: "send" }),
                n("e1", "end", 1000, ROW_TOP, { label: "Solicitação concluída" }),
                n("e2", "end", 1000, ROW_BOTTOM, { label: "Solicitação rejeitada", marker: "message" }),
              ],
              [
                e("f1", "s", "t1"),
                e("f2", "t1", "gw"),
                e("f3", "gw", "t2", "Sim"),
                e("f4", "gw", "t3", "Não"),
                e("f5", "t2", "e1"),
                e("f6", "t3", "e2"),
              ]
            ),
            highlightNodeIds: ["gw"],
          },
        ],
      },
      {
        id: "li-avalicao-quiz",
        title: "Prepare-se para o quiz",
        blocks: [
          {
            type: "text",
            text:
              "O quiz reúne 30 questões distribuídas em oito categorias, com dificuldades progressivas. As questões de diagrama pedem interpretação real de um fluxo — não decore, pratique a leitura.",
          },
          {
            type: "bullets",
            items: [
              "Fundamentos, eventos, atividades, gateways, conexões e pools: teoria.",
              "Interpretação de diagramas: leia o fluxo e responda.",
              "Situações práticas: diagnostique e corrija.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "XP por desempenho",
            text:
              "Cada acerto vale XP; 100% em um quiz com 10 ou mais questões desbloqueia a conquista 'Nota máxima'.",
          },
        ],
      },
    ],
    challengeIds: [],
    quizCategories: [
      "fundamentos",
      "eventos",
      "atividades",
      "gateways",
      "conexoes",
      "pools",
      "interpretacao",
      "pratica",
    ],
    unlockAfter: ["mod-pratica"],
  },
];

export function moduleById(id: string): LearningModule | undefined {
  return modules.find((m) => m.id === id);
}

export function lessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}::${lessonId}`;
}

/** Total de lições em toda a trilha. */
export const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
