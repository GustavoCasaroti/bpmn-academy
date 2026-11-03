import type { Challenge } from "@/types";
import { box, d, e, n, ROW_BOTTOM, ROW_MAIN, ROW_TOP } from "@/data/diagram-helpers";

/**
 * Desafios do Laboratório BPMN.
 * 4 para montar, 4 para corrigir, 1 de identificação e 1 de simulação.
 */

export const challenges: Challenge[] = [
  /* ================================================================ */
  /* MODO 1 — MONTE O PROCESSO                                         */
  /* ================================================================ */
  {
    id: "des-01-compra",
    mode: "build",
    title: "Pedido com verificação de estoque",
    situation:
      "Uma empresa recebe um pedido de compra. Primeiro, precisa verificar a disponibilidade do produto. Se houver estoque, o pedido é aprovado e enviado para separação. Caso contrário, o cliente deve ser informado de que o produto está indisponível.",
    difficulty: "facil",
    moduleId: "mod-pratica",
    xp: 150,
    unlockAfter: ["mod-fundamentos", "mod-gateways"],
    requiredSymbols: [
      "event-start",
      "task",
      "gateway-exclusive",
      "task-send",
      "event-end",
      "event-end-message",
    ],
    minTasks: 3,
    minEndEvents: 2,
    requireDecision: true,
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Verificar a disponibilidade", taskType: "service" }),
        n("gw1", "gateway", 520, ROW_MAIN, { gateway: "exclusive", label: "Há estoque?" }),
        n("t2", "task", 740, ROW_TOP, { label: "Aprovar e enviar para separação" }),
        n("t3", "task", 740, ROW_BOTTOM, { label: "Informar indisponibilidade", taskType: "send" }),
        n("e1", "end", 980, ROW_TOP, { label: "Pedido em separação" }),
        n("e2", "end", 980, ROW_BOTTOM, { label: "Cliente avisado", marker: "message" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Sim"),
        e("f4", "gw1", "t3", "Não"),
        e("f5", "t2", "e1"),
        e("f6", "t3", "e2"),
      ]
    ),
    feedback: {
      success:
        "Processo montado corretamente: início, verificação, decisão exclusiva com dois caminhos rotulados e desfechos distintos.",
      hints: [
        "Comece por um evento de início simples — o pedido chega sem gatilho especial.",
        "A frase 'se houver estoque... caso contrário' pede um gateway exclusivo com saídas rotuladas.",
        "Cada resultado possível termina em um evento de fim; o aviso ao cliente pode usar o fim por mensagem.",
      ],
    },
  },
  {
    id: "des-02-pagamento",
    mode: "build",
    title: "Pagamento aprovado ou estorno",
    situation:
      "Após a separação de um pedido, o sistema registra o pagamento. Se o pagamento for aprovado, é emitida a nota fiscal e ela é enviada ao cliente. Se for recusado, o sistema solicita o estorno junto ao banco e avisa o cliente da recusa.",
    difficulty: "medio",
    moduleId: "mod-pratica",
    xp: 150,
    unlockAfter: ["mod-fundamentos", "mod-atividades", "mod-gateways"],
    requiredSymbols: [
      "event-start",
      "task",
      "gateway-exclusive",
      "task-send",
      "event-end",
      "event-end-message",
    ],
    minTasks: 4,
    minEndEvents: 2,
    requireDecision: true,
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido separado" }),
        n("t1", "task", 280, ROW_MAIN, { label: "Registrar o pagamento", taskType: "service" }),
        n("gw1", "gateway", 500, ROW_MAIN, { gateway: "exclusive", label: "Pagamento aprovado?" }),
        n("t2", "task", 720, ROW_TOP, { label: "Emitir a nota fiscal", taskType: "service" }),
        n("t3", "task", 940, ROW_TOP, { label: "Enviar a nota ao cliente", taskType: "send" }),
        n("t4", "task", 720, ROW_BOTTOM, { label: "Solicitar o estorno", taskType: "service" }),
        n("t5", "task", 940, ROW_BOTTOM, { label: "Avisar o cliente da recusa", taskType: "send" }),
        n("e1", "end", 1180, ROW_TOP, { label: "Venda faturada", marker: "message" }),
        n("e2", "end", 1180, ROW_BOTTOM, { label: "Estorno solicitado" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Sim"),
        e("f4", "gw1", "t4", "Não"),
        e("f5", "t2", "t3"),
        e("f6", "t4", "t5"),
        e("f7", "t3", "e1"),
        e("f8", "t5", "e2"),
      ]
    ),
    feedback: {
      success:
        "Fluxo completo: decisão única, emissão e envio no caminho de sucesso, estorno e aviso no caminho de falha.",
      hints: [
        "Existem quatro atividades: registrar, emitir, enviar e solicitar estorno (mais o aviso).",
        "A decisão é exclusiva: o pagamento é aprovado OU recusado.",
        "Rotule as duas saídas do gateway e termine cada caminho com um evento de fim.",
      ],
    },
  },
  {
    id: "des-03-atendimento",
    mode: "build",
    title: "Triagem de atendimento ao cliente",
    situation:
      "Um cliente contata o suporte. A demanda é triada: se for dúvida simples, ela é respondida na hora e o atendimento termina. Se não for simples, é aberto um chamado e o processo aguarda a resposta do especialista por mensagem; quando ela chega, o cliente é retornado e o atendimento se encerra.",
    difficulty: "medio",
    moduleId: "mod-pratica",
    xp: 160,
    unlockAfter: ["mod-eventos", "mod-conexoes"],
    requiredSymbols: [
      "event-start-message",
      "task",
      "gateway-exclusive",
      "event-intermediate-message",
      "event-end",
      "event-end-message",
    ],
    minTasks: 3,
    minEndEvents: 2,
    requireDecision: true,
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Contato do cliente", marker: "message" }),
        n("t1", "task", 280, ROW_MAIN, { label: "Triar a demanda", taskType: "user" }),
        n("gw1", "gateway", 500, ROW_MAIN, { gateway: "exclusive", label: "Dúvida simples?" }),
        n("t2", "task", 720, ROW_TOP, { label: "Responder diretamente", taskType: "user" }),
        n("e1", "end", 960, ROW_TOP, { label: "Dúvida resolvida" }),
        n("t3", "task", 720, ROW_BOTTOM, { label: "Abrir o chamado", taskType: "user" }),
        n("i1", "intermediate", 960, ROW_BOTTOM, { label: "Resposta recebida", marker: "message" }),
        n("t4", "task", 1180, ROW_BOTTOM, { label: "Retornar ao cliente", taskType: "send" }),
        n("e2", "end", 1420, ROW_BOTTOM, { label: "Cliente notificado", marker: "message" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Sim"),
        e("f4", "gw1", "t3", "Não"),
        e("f5", "t2", "e1"),
        e("f6", "t3", "i1"),
        e("f7", "i1", "t4"),
        e("f8", "t4", "e2"),
      ]
    ),
    feedback: {
      success:
        "Excelente: gatilho por mensagem, triagem com decisão exclusiva e espera por resposta modelada com evento intermediário.",
      hints: [
        "A situação começa com um contato do cliente: use o evento de início por mensagem.",
        "A espera pela resposta do especialista é um evento intermediário de mensagem, não uma tarefa.",
        "Rotule as saídas da triagem e termine os dois caminhos com eventos de fim.",
      ],
    },
  },
  {
    id: "des-04-contratacao",
    mode: "build",
    title: "Contratação com etapas paralelas",
    situation:
      "Depois de aprovada a vaga, o RH realiza a entrevista e, ao mesmo tempo, solicita os documentos do candidato. Quando as duas etapas terminam, o candidato é avaliado. Se for aprovado, inicia-se a admissão e o processo termina com a contratação; se reprovado, o candidato é avisado e o processo é encerrado.",
    difficulty: "avancado",
    moduleId: "mod-pratica",
    xp: 160,
    unlockAfter: ["mod-atividades", "mod-conexoes"],
    requiredSymbols: [
      "event-start",
      "task",
      "gateway-exclusive",
      "gateway-parallel",
      "task-send",
      "event-end",
    ],
    minTasks: 5,
    minEndEvents: 2,
    requireDecision: true,
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Vaga aprovada" }),
        n("t1", "task", 260, ROW_MAIN, { label: "Registrar a aprovação" }),
        n("gw1", "gateway", 480, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
        n("t2", "task", 700, ROW_TOP, { label: "Realizar a entrevista", taskType: "user" }),
        n("t3", "task", 700, ROW_BOTTOM, { label: "Solicitar os documentos", taskType: "send" }),
        n("gw2", "gateway", 930, ROW_MAIN, { gateway: "parallel", label: "Juntar" }),
        n("t4", "task", 1140, ROW_MAIN, { label: "Avaliar o candidato", taskType: "user" }),
        n("gw3", "gateway", 1370, ROW_MAIN, { gateway: "exclusive", label: "Aprovado?" }),
        n("t5", "task", 1590, ROW_TOP, { label: "Iniciar a admissão" }),
        n("t6", "task", 1590, ROW_BOTTOM, { label: "Agradecer ao candidato", taskType: "send" }),
        n("e1", "end", 1820, ROW_TOP, { label: "Contratação concluída" }),
        n("e2", "end", 1820, ROW_BOTTOM, { label: "Candidato agradecido" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2"),
        e("f4", "gw1", "t3"),
        e("f5", "t2", "gw2"),
        e("f6", "t3", "gw2"),
        e("f7", "gw2", "t4"),
        e("f8", "t4", "gw3"),
        e("f9", "gw3", "t5", "Sim"),
        e("f10", "gw3", "t6", "Não"),
        e("f11", "t5", "e1"),
        e("f12", "t6", "e2"),
      ]
    ),
    feedback: {
      success:
        "Processo completo com divisão e junção paralelas e decisão final exclusiva. Estrutura clássica de contratação.",
      hints: [
        "'Ao mesmo tempo' pede um gateway paralelo de divisão — e outro de junção para sincronizar.",
        "Depois da junção, a avaliação e a decisão final usam um gateway exclusivo com saídas rotuladas.",
        "São pelo menos cinco tarefas e dois eventos de fim.",
      ],
    },
  },

  /* ================================================================ */
  /* MODO 2 — CORRIJA O PROCESSO                                       */
  /* ================================================================ */
  {
    id: "des-05-sem-inicio",
    mode: "fix",
    title: "Processo sem evento inicial",
    situation:
      "Este processo começa 'do nada': a primeira atividade não é alcançada por nenhum gatilho. Encontre o problema e corrija o diagrama para que ele tenha um início correto.",
    difficulty: "facil",
    moduleId: "mod-pratica",
    xp: 110,
    unlockAfter: ["mod-eventos"],
    initialDiagram: d(
      [
        n("t1", "task", 260, ROW_MAIN, { label: "Registrar a solicitação", taskType: "user" }),
        n("t2", "task", 520, ROW_MAIN, { label: "Validar os dados", taskType: "service" }),
        n("e1", "end", 780, ROW_MAIN, { label: "Solicitação registrada" }),
      ],
      [e("f1", "t1", "t2"), e("f2", "t2", "e1")]
    ),
    expectedIssueCodes: ["no-start"],
    knownIssues: [
      {
        id: "no-start",
        title: "Falta o evento de início",
        explanation:
          "Todo processo precisa de um evento de início (círculo de borda fina) que indica onde a instância começa. Sem ele, não há como saber qual é a primeira etapa nem quando o processo é disparado.",
        fix:
          "Adicione um evento de início à esquerda de 'Registrar a solicitação' e conecte-os com um fluxo de sequência.",
      },
    ],
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Solicitação criada" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Registrar a solicitação", taskType: "user" }),
        n("t2", "task", 560, ROW_MAIN, { label: "Validar os dados", taskType: "service" }),
        n("e1", "end", 820, ROW_MAIN, { label: "Solicitação registrada" }),
      ],
      [e("f0", "s", "t1"), e("f1", "t1", "t2"), e("f2", "t2", "e1")]
    ),
    feedback: {
      success:
        "Correto! O processo agora tem um ponto de partida claro, e a primeira atividade foi alcançada pelo fluxo.",
      hints: [
        "Olhe para a extremidade esquerda do diagrama: o que deveria estar lá?",
        "O elemento de início é circular, de borda fina e não recebe fluxos de entrada.",
        "Após adicioná-lo, conecte-o à primeira atividade com um fluxo de sequência.",
      ],
    },
  },
  {
    id: "des-06-gateway-quebrado",
    mode: "fix",
    title: "Decisão incompleta e atividade órfã",
    situation:
      "O fluxo tem um gateway que promete dividir o caminho, mas não entrega; e existe uma atividade que ninguém executa. Corrija os dois problemas mantendo a continuidade do processo.",
    difficulty: "medio",
    moduleId: "mod-pratica",
    xp: 110,
    unlockAfter: ["mod-gateways"],
    initialDiagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
        n("t1", "task", 280, ROW_MAIN, { label: "Conferir o pedido" }),
        n("gw1", "gateway", 500, ROW_MAIN, { gateway: "exclusive", label: "Tudo certo?" }),
        n("t2", "task", 720, ROW_MAIN, { label: "Separar os itens" }),
        n("e1", "end", 960, ROW_MAIN, { label: "Pedido pronto" }),
        n("t3", "task", 500, 280, { label: "Cobrar o frete", taskType: "service" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2"),
        e("f4", "t2", "e1"),
      ]
    ),
    expectedIssueCodes: ["gateway-single-path", "isolated-node"],
    knownIssues: [
      {
        id: "gateway-single-path",
        title: "Gateway com um único caminho",
        explanation:
          "Um gateway existe para dividir ou juntar fluxos. Com uma única saída ele não decide nada e apenas confunde a leitura do diagrama.",
        fix:
          "Dê uma segunda saída ao gateway (por exemplo, ligando-o à atividade 'Cobrar o frete') e rotule as saídas com as condições — ou remova o gateway e ligue a etapa diretamente.",
      },
      {
        id: "isolated-node",
        title: "Atividade desconectada",
        explanation:
          "A atividade 'Cobrar o frete' não tem entrada nem saída: ela nunca será executada e quebra a continuidade do fluxo.",
        fix:
          "Conecte-a ao fluxo — por exemplo, como caminho alternativo do gateway — ou remova-a do diagrama.",
      },
    ],
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
        n("t1", "task", 280, ROW_MAIN, { label: "Conferir o pedido" }),
        n("gw1", "gateway", 500, ROW_MAIN, { gateway: "exclusive", label: "Tudo certo?" }),
        n("t2", "task", 740, ROW_TOP, { label: "Separar os itens" }),
        n("t3", "task", 740, ROW_BOTTOM, { label: "Cobrar o frete", taskType: "service" }),
        n("e1", "end", 980, ROW_TOP, { label: "Pedido pronto" }),
        n("e2", "end", 980, ROW_BOTTOM, { label: "Frete cobrado" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Sim"),
        e("f4", "gw1", "t3", "Não"),
        e("f5", "t2", "e1"),
        e("f6", "t3", "e2"),
      ]
    ),
    feedback: {
      success:
        "Muito bem! O gateway agora decide de verdade e nenhuma atividade ficou de fora do fluxo.",
      hints: [
        "Um gateway com uma saída não é uma decisão — decisões têm ao menos dois caminhos.",
        "Toda atividade precisa de entrada e saída para participar do fluxo.",
        "Não esqueça de rotular as saídas do gateway exclusivo com as condições.",
      ],
    },
  },
  {
    id: "des-07-fluxo-entre-pools",
    mode: "fix",
    title: "Conexão proibida entre pools",
    situation:
      "Duas organizações participam do processo e a ligação entre elas foi feita com o tipo de conexão errado. A notação BPMN proíbe esse tipo de ligação entre pools diferentes.",
    difficulty: "avancado",
    moduleId: "mod-pratica",
    xp: 120,
    unlockAfter: ["mod-conexoes"],
    initialDiagram: d(
      [
        box("p1", "pool", 40, 20, 780, 150, { poolName: "Cliente" }),
        box("p2", "pool", 40, 190, 780, 170, { poolName: "Loja" }),
        n("t1", "task", 340, 105, { label: "Enviar o pedido", taskType: "send" }, { poolId: "p1" }),
        n("t2", "task", 340, 250, { label: "Registrar o pedido", taskType: "user" }, { poolId: "p2" }),
        n("e1", "end", 620, 250, { label: "Pedido registrado" }, { poolId: "p2" }),
      ],
      [
        e("bad", "t1", "t2", undefined, "sequence"),
        e("f1", "t2", "e1"),
      ]
    ),
    expectedIssueCodes: ["sequence-between-pools"],
    knownIssues: [
      {
        id: "sequence-between-pools",
        title: "Fluxo de sequência entre pools",
        explanation:
          "O fluxo de sequência descreve a ordem de execução dentro de um mesmo processo. Entre participantes diferentes — pools distintas — a comunicação é representada pelo fluxo de mensagem (linha tracejada com seta aberta).",
        fix:
          "Selecione a conexão entre 'Enviar o pedido' e 'Registrar o pedido' e troque o tipo para fluxo de mensagem.",
      },
    ],
    solution: d(
      [
        box("p1", "pool", 40, 20, 780, 150, { poolName: "Cliente" }),
        box("p2", "pool", 40, 190, 780, 170, { poolName: "Loja" }),
        n("t1", "task", 340, 105, { label: "Enviar o pedido", taskType: "send" }, { poolId: "p1" }),
        n("t2", "task", 340, 250, { label: "Registrar o pedido", taskType: "user" }, { poolId: "p2" }),
        n("e1", "end", 620, 250, { label: "Pedido registrado" }, { poolId: "p2" }),
      ],
      [e("msg", "t1", "t2", undefined, "message"), e("f1", "t2", "e1")]
    ),
    feedback: {
      success:
        "Perfeito! A comunicação entre os participantes agora usa fluxo de mensagem, como manda a notação.",
      hints: [
        "A regra é simples: sequência só dentro da mesma pool.",
        "Entre pools, a ligação correta é o fluxo de mensagem — linha tracejada.",
        "Selecione a conexão errada e altere o tipo na barra de ferramentas.",
      ],
    },
  },
  {
    id: "des-08-processo-sem-fim",
    mode: "fix",
    title: "Processo sem encerramento",
    situation:
      "O fluxo abaixo executa duas etapas e simplesmente acaba. Sem um desfecho definido, não é possível dizer qual é o resultado do processo.",
    difficulty: "facil",
    moduleId: "mod-pratica",
    xp: 110,
    unlockAfter: ["mod-eventos", "mod-atividades"],
    initialDiagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Exame solicitado" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Coletar a amostra", taskType: "manual" }),
        n("t2", "task", 560, ROW_MAIN, { label: "Analisar a amostra", taskType: "service" }),
      ],
      [e("f1", "s", "t1"), e("f2", "t1", "t2")]
    ),
    expectedIssueCodes: ["no-end", "task-without-outgoing"],
    knownIssues: [
      {
        id: "no-end",
        title: "Falta o evento de fim",
        explanation:
          "O processo não apresenta nenhum desfecho. O evento de fim (círculo de borda grossa) indica qual é o resultado alcançado pela instância do processo.",
        fix:
          "Adicione um evento de fim à direita de 'Analisar a amostra' e conecte a atividade a ele.",
      },
      {
        id: "task-without-outgoing",
        title: "Atividade sem saída",
        explanation:
          "A última atividade não leva a lugar nenhum: o token chega nela e morre, sem encerrar o processo formalmente.",
        fix:
          "Conecte 'Analisar a amostra' ao novo evento de fim com um fluxo de sequência.",
      },
    ],
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Exame solicitado" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Coletar a amostra", taskType: "manual" }),
        n("t2", "task", 560, ROW_MAIN, { label: "Analisar a amostra", taskType: "service" }),
        n("e1", "end", 820, ROW_MAIN, { label: "Laudo emitido" }),
      ],
      [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
    ),
    feedback: {
      success:
        "Correto! O processo agora termina em um evento de fim que descreve o resultado alcançado.",
      hints: [
        "O elemento de fim tem borda grossa e nenhuma saída.",
        "Dê um rótulo que expresse o resultado ('Laudo emitido'), não apenas 'Fim'.",
        "Conecte a última atividade até ele com um fluxo de sequência.",
      ],
    },
  },

  /* ================================================================ */
  /* MODO 3 — IDENTIFIQUE OS SÍMBOLOS                                  */
  /* ================================================================ */
  {
    id: "des-09-identificar-simbolos",
    mode: "identify",
    title: "Leitura rápida de um diagrama",
    situation:
      "Este diagrama foi montado por outra equipe. Clique em cada elemento indicado e identifique qual símbolo BPMN ele representa.",
    difficulty: "facil",
    moduleId: "mod-atividades",
    xp: 90,
    unlockAfter: ["mod-eventos"],
    identifyDiagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Assinatura do contrato", marker: "timer" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Preparar o material", taskType: "manual" }),
        n("gw1", "gateway", 540, ROW_MAIN, { gateway: "inclusive", label: "Aprovações?" }),
        n("t2", "task", 780, ROW_TOP, { label: "Aprovar o orçamento", taskType: "user" }),
        n("t3", "task", 780, ROW_BOTTOM, { label: "Revisar a documentação", taskType: "user" }),
        n("i1", "intermediate", 1020, ROW_MAIN, { label: "Confirmação recebida", marker: "message" }),
        n("sp", "subProcess", 1260, ROW_MAIN, { label: "Executar a implantação" }),
        n("e1", "end", 1520, ROW_MAIN, { label: "Implantação concluída", marker: "terminate" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Orçamento"),
        e("f4", "gw1", "t3", "Documentação"),
        e("f5", "t2", "i1"),
        e("f6", "t3", "i1"),
        e("f7", "i1", "sp"),
        e("f8", "sp", "e1"),
      ]
    ),
    identifyQuestions: [
      {
        nodeId: "s",
        question: "Qual é o elemento que inicia este processo?",
        options: [
          "Evento de início por temporizador",
          "Evento de início por mensagem",
          "Evento intermediário de temporizador",
          "Evento de início simples",
        ],
        correctOptionId: "a",
        explanation:
          "Borda fina = início; relógio interno = temporizador. Ou seja, o processo começa quando o prazo da assinatura é atingido.",
      },
      {
        nodeId: "gw1",
        question: "Qual é o gateway usado na divisão?",
        options: [
          "Gateway exclusivo (XOR)",
          "Gateway paralelo (AND)",
          "Gateway inclusivo (OR)",
          "Gateway baseado em eventos",
        ],
        correctOptionId: "c",
        explanation:
          "O 'O' dentro do losango marca o gateway inclusivo: um ou mais caminhos podem ser ativados conforme as condições.",
      },
      {
        nodeId: "t3",
        question: "Qual é o tipo desta atividade?",
        options: [
          "Tarefa de serviço",
          "Tarefa manual",
          "Tarefa de usuário",
          "Tarefa de envio",
        ],
        correctOptionId: "c",
        explanation:
          "O ícone de pessoa identifica a tarefa de usuário: uma pessoa executa a ação dentro de um sistema.",
      },
      {
        nodeId: "e1",
        question: "Qual é o evento que encerra o processo?",
        options: [
          "Evento de fim simples",
          "Evento de fim por mensagem",
          "Evento de fim por erro",
          "Evento de fim por terminação",
        ],
        correctOptionId: "d",
        explanation:
          "O círculo preenchido no centro é o marcador de terminação: ele encerra imediatamente todas as rotas paralelas do processo.",
      },
    ],
    feedback: {
      success:
        "Identificação perfeita — você leu marcadores, tipos de atividade e gateway corretamente.",
      hints: [
        "Observe a borda do círculo: fina, dupla ou grossa diz a posição do evento.",
        "O marcador interno diz o tipo: relógio, envelope, raio, triângulo ou círculo preenchido.",
        "Nos gateways, o símbolo interno é a chave: X, +, O, pentágono ou asterisco.",
      ],
    },
  },

  /* ================================================================ */
  /* MODO 4 — SIMULAÇÃO                                               */
  /* ================================================================ */
  {
    id: "des-10-simulacao-pedido",
    mode: "simulate",
    title: "Simule o pedido online",
    situation:
      "Execute o processo escolhendo os caminhos nas decisões: produto disponível? pagamento aprovado? cliente confirmou a entrega? O caminho percorrido será destacado no diagrama.",
    difficulty: "avancado",
    moduleId: "mod-pratica",
    xp: 100,
    unlockAfter: ["mod-gateways"],
    solution: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido criado", marker: "message" }),
        n("gw1", "gateway", 280, ROW_MAIN, { gateway: "exclusive", label: "Produto disponível?" }),
        n("t1", "task", 500, ROW_TOP, { label: "Reservar o produto", taskType: "service" }),
        n("t2", "task", 500, ROW_BOTTOM, { label: "Informar ruptura", taskType: "send" }),
        n("e2", "end", 740, ROW_BOTTOM, { label: "Pedido cancelado" }),
        n("gw2", "gateway", 760, ROW_TOP, { gateway: "exclusive", label: "Pagamento aprovado?" }),
        n("t3", "task", 980, ROW_TOP, { label: "Faturar o pedido", taskType: "service" }),
        n("e3", "end", 1220, ROW_TOP, { label: "Pagamento recusado" }),
        n("gw3", "gateway", 1240, ROW_TOP, { gateway: "exclusive", label: "Cliente confirmou?" }),
        n("t4", "task", 1460, ROW_TOP, { label: "Entregar o pedido", taskType: "manual" }),
        n("e1", "end", 1700, ROW_TOP, { label: "Pedido entregue", marker: "message" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1", "Sim"),
        e("f3", "gw1", "t2", "Não"),
        e("f4", "t1", "gw2"),
        e("f5", "gw2", "t3", "Aprovado"),
        e("f6", "gw2", "e3", "Recusado"),
        e("f7", "t3", "gw3"),
        e("f8", "gw3", "t4", "Sim"),
        e("f9", "gw3", "e3", "Não"),
        e("f10", "t4", "e1"),
        e("f11", "t2", "e2"),
      ]
    ),
    simulation: {
      startNodeId: "s",
      decisions: [
        {
          nodeId: "gw1",
          question: "O produto está disponível em estoque?",
          options: [
            { label: "Sim, há estoque", edgeId: "f2", outcome: "Produto reservado" },
            { label: "Não, sem estoque", edgeId: "f3", outcome: "Pedido cancelado por ruptura" },
          ],
        },
        {
          nodeId: "gw2",
          question: "O pagamento foi aprovado?",
          options: [
            { label: "Aprovado", edgeId: "f5", outcome: "Pedido faturado" },
            { label: "Recusado", edgeId: "f6", outcome: "Pagamento recusado" },
          ],
        },
        {
          nodeId: "gw3",
          question: "O cliente confirmou o recebimento?",
          options: [
            { label: "Confirmou", edgeId: "f8", outcome: "Entrega concluída" },
            { label: "Não confirmou", edgeId: "f9", outcome: "Entrega não concluída" },
          ],
        },
      ],
      endings: {
        e1: "Pedido entregue com sucesso — processo concluído.",
        e2: "Produto indisponível — pedido cancelado.",
        e3: "Pedido interrompido antes da entrega.",
      },
    },
    feedback: {
      success:
        "Você percorreu o processo e viu como cada decisão leva a um desfecho diferente.",
      hints: [
        "Rode o processo pelo menos três vezes, mudando as respostas, para ver todos os desfechos.",
        "Observe que o gateway exclusivo nunca executa dois caminhos ao mesmo tempo.",
        "Os eventos de fim diferentes mostram os resultados possíveis do processo.",
      ],
    },
  },
];
