import type { ProcessExample } from "@/types";
import { box, d, e, n, ROW_BOTTOM, ROW_MAIN, ROW_TOP } from "./diagram-helpers";

/**
 * Exemplos completos de processos BPMN usados na plataforma
 * (página "Exemplos", modo simulação e trilha de aprendizado).
 */
export const processExamples: ProcessExample[] = [
  /* ================================================================= */
  /* 1. Compra em uma loja                                             */
  /* ================================================================= */
  {
    id: "ex-compra",
    title: "Compra em uma loja",
    category: "Vendas",
    difficulty: "facil",
    problem:
      "Uma loja física precisa registrar pedidos de clientes com segurança, evitando vender itens que não existem em estoque ou despachar pedidos cujo pagamento foi recusado.",
    scenario:
      "A atendente Marina recebe o cliente na loja e registra os itens do pedido no sistema de vendas. O sistema consulta o estoque em tempo real; se o produto estiver disponível, os itens são separados e o pagamento é autorizado pela maquininha. Quando o pagamento é recusado ou o estoque está zerado, a loja avisa o cliente e encerra o atendimento sem concretizar a venda.",
    diagram: {
      nodes: [
        { id: "start", kind: "start", x: 60, y: 120, data: { label: "Cliente inicia a compra", phase: "start" } },
        { id: "t1", kind: "task", x: 200, y: 108, data: { label: "Registrar os itens do pedido", taskType: "user" } },
        { id: "t2", kind: "task", x: 400, y: 108, data: { label: "Consultar o estoque", taskType: "service" } },
        { id: "gw1", kind: "gateway", x: 654, y: 114, data: { label: "Produto em estoque?", gateway: "exclusive" } },
        { id: "t3", kind: "task", x: 800, y: 28, data: { label: "Separar os itens na loja", taskType: "manual" } },
        { id: "gw2", kind: "gateway", x: 1054, y: 34, data: { label: "Pagamento aprovado?", gateway: "exclusive" } },
        { id: "t4", kind: "task", x: 1200, y: 28, data: { label: "Despachar para o cliente", taskType: "send" } },
        { id: "end1", kind: "end", x: 1260, y: 120, data: { label: "Pedido entregue ao cliente", phase: "end" } },
        { id: "t5", kind: "task", x: 1000, y: 188, data: { label: "Liberar a reserva e avisar o cliente", taskType: "send" } },
        { id: "end2", kind: "end", x: 1260, y: 200, data: { label: "Venda cancelada", phase: "end" } },
        { id: "t6", kind: "task", x: 800, y: 268, data: { label: "Notificar ruptura de estoque", taskType: "send" } },
        { id: "end3", kind: "end", x: 1060, y: 280, data: { label: "Pedido encerrado sem estoque", phase: "end" } },
      ],
      edges: [
        { id: "ce1", source: "start", target: "t1", type: "sequence" },
        { id: "ce2", source: "t1", target: "t2", type: "sequence" },
        { id: "ce3", source: "t2", target: "gw1", type: "sequence" },
        { id: "ce4", source: "gw1", target: "t3", type: "sequence", label: "Sim — há estoque" },
        { id: "ce5", source: "gw1", target: "t6", type: "sequence", label: "Não — sem estoque" },
        { id: "ce6", source: "t3", target: "gw2", type: "sequence" },
        { id: "ce7", source: "gw2", target: "t4", type: "sequence", label: "Sim — pagamento aprovado" },
        { id: "ce8", source: "gw2", target: "t5", type: "sequence", label: "Não — pagamento recusado" },
        { id: "ce9", source: "t4", target: "end1", type: "sequence" },
        { id: "ce10", source: "t5", target: "end2", type: "sequence" },
        { id: "ce11", source: "t6", target: "end3", type: "sequence" },
      ],
    },
    steps: [
      {
        index: 1,
        title: "Início e registro do pedido",
        text: "O processo começa quando o cliente manifesta a intenção de comprar. A atendente registra os itens solicitados no sistema de vendas para que tudo fique rastreável.",
        nodeIds: ["start", "t1"],
      },
      {
        index: 2,
        title: "Consulta ao estoque",
        text: "O sistema consulta o estoque em tempo real. Essa é uma tarefa de serviço: quem executa é o sistema, não a pessoa.",
        nodeIds: ["t2"],
      },
      {
        index: 3,
        title: "Decisão de disponibilidade",
        text: "O gateway exclusivo avalia uma única pergunta: o produto está disponível? Apenas um dos dois caminhos será percorrido.",
        nodeIds: ["gw1"],
      },
      {
        index: 4,
        title: "Separação dos itens",
        text: "Com estoque confirmado, a equipe separa fisicamente os itens do pedido. Em seguida, o pagamento é solicitado ao cliente.",
        nodeIds: ["t3", "gw2"],
      },
      {
        index: 5,
        title: "Despacho ou recusa do pagamento",
        text: "Se o pagamento for aprovado, o pedido é despachado e o cliente recebe seus itens. Se for recusado, a reserva é liberada e o cliente é avisado.",
        nodeIds: ["t4", "t5"],
      },
      {
        index: 6,
        title: "Desfechos possíveis",
        text: "O processo termina em um de três finais: pedido entregue, venda cancelada por pagamento recusado ou pedido encerrado por falta de estoque.",
        nodeIds: ["end1", "end2", "end3", "t6"],
      },
    ],
    symbolsUsed: [
      "event-start",
      "task-user",
      "task-service",
      "task-manual",
      "task-send",
      "gateway-exclusive",
      "event-end",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway exclusivo (XOR): a pergunta 'produto em estoque?' tem respostas mutually exclusivas — ou há estoque, ou não há. Nunca percorreremos os dois caminhos ao mesmo tempo, então o XOR é o gateway correto.",
      },
      {
        node: "gw2",
        text: "Gateway exclusivo (XOR): o resultado da maquininha é um dos dois — aprovado ou recusado. A condição de cada saída fica rotulada na aresta de saída, conforme a notação BPMN 2.0.",
      },
    ],
    simulation: {
      startNodeId: "start",
      decisions: [
        {
          nodeId: "gw1",
          question: "O produto escolhido pelo cliente está disponível em estoque?",
          options: [
            { label: "Sim", edgeId: "ce4", outcome: "Estoque confirmado: os itens são separados na loja." },
            { label: "Não", edgeId: "ce5", outcome: "Ruptura de estoque: o cliente é avisado e o pedido encerra." },
          ],
        },
        {
          nodeId: "gw2",
          question: "A maquininha autorizou o pagamento do pedido?",
          options: [
            { label: "Sim", edgeId: "ce7", outcome: "Pagamento aprovado: o pedido é despachado ao cliente." },
            { label: "Não", edgeId: "ce8", outcome: "Pagamento recusado: a reserva é liberada e a venda é cancelada." },
          ],
        },
      ],
      endings: {
        end1: "Sucesso! O pedido foi despachado e entregue ao cliente.",
        end2: "A venda foi cancelada porque o pagamento não foi autorizado.",
        end3: "O pedido foi encerrado porque o produto não tinha estoque disponível.",
      },
    },
  },

  /* ================================================================= */
  /* 2. Atendimento ao cliente                                         */
  /* ================================================================= */
  {
    id: "ex-atendimento",
    title: "Atendimento ao cliente",
    category: "Atendimento",
    difficulty: "medio",
    problem:
      "O suporte precisa responder pedidos de clientes sem perder histórico, escalando corretamente os casos difíceis e encerrando cada atendimento apenas com a confirmação do cliente.",
    scenario:
      "A cliente Paula abre um chamado pelo telefone informando que seu roteador não conecta. O atendente Joana registra o protocolo, diagnostica a ocorrência e decide se resolve na primeira linha ou aciona o nível 2. Antes de encerrar, o sistema aguarda a confirmação do cliente por mensagem; sem confirmação, o atendimento é retomado.",
    diagram: {
      nodes: [
        { id: "start", kind: "start", x: 60, y: 120, data: { label: "Cliente aciona o suporte", phase: "start", marker: "message" } },
        { id: "t1", kind: "task", x: 200, y: 108, data: { label: "Registrar o protocolo do atendimento", taskType: "user" } },
        { id: "t2", kind: "task", x: 400, y: 108, data: { label: "Diagnosticar a ocorrência", taskType: "user" } },
        { id: "gw1", kind: "gateway", x: 654, y: 114, data: { label: "Resolve na primeira linha?", gateway: "exclusive" } },
        { id: "t3", kind: "task", x: 800, y: 28, data: { label: "Aplicar a solução imediata", taskType: "manual" } },
        { id: "t4", kind: "task", x: 800, y: 188, data: { label: "Acionar a equipe de nível 2", taskType: "send" } },
        { id: "e1", kind: "intermediate", x: 1060, y: 120, data: { label: "Aguardar confirmação do cliente", phase: "intermediate", marker: "message" } },
        { id: "gw2", kind: "gateway", x: 1254, y: 114, data: { label: "Cliente confirmou?", gateway: "exclusive" } },
        { id: "end1", kind: "end", x: 1260, y: 40, data: { label: "Encerrar e enviar pesquisa de satisfação", phase: "end", marker: "message" } },
        { id: "t5", kind: "task", x: 1200, y: 188, data: { label: "Retomar o atendimento com o cliente", taskType: "user" } },
        { id: "end2", kind: "end", x: 1260, y: 280, data: { label: "Atendimento encerrado após nova orientação", phase: "end" } },
      ],
      edges: [
        { id: "ae1", source: "start", target: "t1", type: "sequence" },
        { id: "ae2", source: "t1", target: "t2", type: "sequence" },
        { id: "ae3", source: "t2", target: "gw1", type: "sequence" },
        { id: "ae4", source: "gw1", target: "t3", type: "sequence", label: "Sim — solução conhecida" },
        { id: "ae5", source: "gw1", target: "t4", type: "sequence", label: "Não — exige especialista" },
        { id: "ae6", source: "t3", target: "e1", type: "sequence" },
        { id: "ae7", source: "t4", target: "e1", type: "sequence" },
        { id: "ae8", source: "e1", target: "gw2", type: "sequence" },
        { id: "ae9", source: "gw2", target: "end1", type: "sequence", label: "Sim — cliente confirmou" },
        { id: "ae10", source: "gw2", target: "t5", type: "sequence", label: "Não — cliente pediu ajustes" },
        { id: "ae11", source: "t5", target: "end2", type: "sequence" },
      ],
    },
    steps: [
      {
        index: 1,
        title: "Recepção da demanda",
        text: "O processo inicia com uma mensagem: o cliente contata o suporte. O atendente registra o protocolo para rastreabilidade do atendimento.",
        nodeIds: ["start", "t1"],
      },
      {
        index: 2,
        title: "Diagnóstico da ocorrência",
        text: "O atendente investiga os sintomas relatados e compara com a base de conhecimento. É aqui que se define a rota do atendimento.",
        nodeIds: ["t2", "gw1"],
      },
      {
        index: 3,
        title: "Primeira linha ou nível 2",
        text: "Problemas simples são resolvidos na hora; problemas complexos são enviados por mensagem à equipe especializada. Os dois caminhos convergem para a mesma espera de confirmação.",
        nodeIds: ["t3", "t4"],
      },
      {
        index: 4,
        title: "Aguardando o cliente",
        text: "O evento intermediário de mensagem pausa o fluxo até que o cliente responda. Sem essa confirmação, o chamado não pode ser encerrado.",
        nodeIds: ["e1"],
      },
      {
        index: 5,
        title: "Confirmação e encerramento",
        text: "Confirmado o atendimento, o processo termina com um evento de fim de mensagem, que dispara a pesquisa de satisfação. Sem confirmação, o atendimento é retomado.",
        nodeIds: ["gw2", "end1", "t5"],
      },
      {
        index: 6,
        title: "Novo ciclo de atendimento",
        text: "Após a retomada, o atendente reorienta o cliente e o processo chega ao fim convencional, com o histórico preservado no protocolo.",
        nodeIds: ["end2"],
      },
    ],
    symbolsUsed: [
      "event-start-message",
      "task-user",
      "task-manual",
      "task-send",
      "gateway-exclusive",
      "event-intermediate-message",
      "event-end-message",
      "event-end",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway exclusivo (XOR): o caso é resolvido na primeira linha OU escalado ao nível 2 — as duas rotas se excluem mutuamente, então basta um gateway de decisão simples.",
      },
      {
        node: "gw2",
        text: "Gateway exclusivo (XOR): depois da espera, o cliente confirmou ou não confirmou. O evento intermediário de mensagem já pausou o fluxo; agora basta avaliar o resultado.",
      },
    ],
  },

  /* ================================================================= */
  /* 3. Contratação de funcionário                                     */
  /* ================================================================= */
  {
    id: "ex-contratacao",
    title: "Contratação de funcionário",
    category: "Recursos Humanos",
    difficulty: "avancado",
    problem:
      "O RH precisa contratar novos colaboradores coordenando várias áreas ao mesmo tempo, garantindo que nenhuma etapa essencial seja pulada antes da admissão.",
    scenario:
      "A vaga de analista foi aprovada pela diretoria. O recrutador publica a divulgação e recebe currículos; os candidatos são entrevistados e, em paralelo, o RH solicita os documentos. Só quando entrevista e documentação terminam, a comissão avalia o candidato. Aprovado, inicia-se a admissão; reprovado, o candidato recebe a negativa e o processo termina.",
    diagram: d(
      [
        box("pool", "pool", 20, 20, 1900, 320, { poolName: "Recursos Humanos" }),
        box(
          "lane1",
          "lane",
          74,
          50,
          1832,
          130,
          { laneName: "Recrutamento" },
          { poolId: "pool" }
        ),
        box(
          "lane2",
          "lane",
          74,
          190,
          1832,
          130,
          { laneName: "Comissão de contratação" },
          { poolId: "pool" }
        ),
        n(
          "s",
          "start",
          140,
          115,
          { label: "Vaga aprovada" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "t1",
          "task",
          340,
          115,
          { label: "Divulgar a vaga e triar currículos", taskType: "user" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "gw1",
          "gateway",
          560,
          115,
          { gateway: "parallel", label: "Dividir" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "t2",
          "task",
          780,
          115,
          { label: "Realizar as entrevistas", taskType: "user" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "t3",
          "task",
          780,
          255,
          { label: "Solicitar os documentos", taskType: "send" },
          { poolId: "pool", laneId: "lane2" }
        ),
        n(
          "gw2",
          "gateway",
          1000,
          115,
          { gateway: "parallel", label: "Juntar" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "t4",
          "task",
          1180,
          255,
          { label: "Avaliar o candidato", taskType: "user" },
          { poolId: "pool", laneId: "lane2" }
        ),
        n(
          "gw3",
          "gateway",
          1400,
          255,
          { gateway: "exclusive", label: "Aprovado?" },
          { poolId: "pool", laneId: "lane2" }
        ),
        n(
          "t5",
          "task",
          1600,
          115,
          { label: "Iniciar a admissão", taskType: "user" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "t6",
          "task",
          1600,
          255,
          { label: "Agradecer ao candidato", taskType: "send" },
          { poolId: "pool", laneId: "lane2" }
        ),
        n(
          "e1",
          "end",
          1820,
          115,
          { label: "Contratação concluída" },
          { poolId: "pool", laneId: "lane1" }
        ),
        n(
          "e2",
          "end",
          1820,
          255,
          { label: "Candidato agradecido", marker: "message" },
          { poolId: "pool", laneId: "lane2" }
        ),
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
    steps: [
      {
        index: 1,
        title: "Abertura da vaga",
        text: "Com a vaga aprovada, o recrutador divulga a oportunidade e tria os currículos recebidos. A etapa fica na raia de Recrutamento.",
        nodeIds: ["s", "t1"],
      },
      {
        index: 2,
        title: "Divisão paralela",
        text: "O gateway paralelo (com '+') dispara duas frentes simultâneas: entrevistas e solicitação de documentos. Nenhuma depende da outra.",
        nodeIds: ["gw1", "t2", "t3"],
      },
      {
        index: 3,
        title: "Sincronização",
        text: "A junção paralela só segue quando as duas frentes terminarem. Assim, nenhum candidato é avaliado com documentação faltando.",
        nodeIds: ["gw2"],
      },
      {
        index: 4,
        title: "Avaliação e decisão",
        text: "A comissão avalia o candidato e o gateway exclusivo decide: aprovado segue para admissão; reprovado recebe a negativa.",
        nodeIds: ["t4", "gw3"],
      },
      {
        index: 5,
        title: "Desfechos",
        text: "A contratação conclui o processo com sucesso; a reprovação termina com mensagem de agradecimento ao candidato.",
        nodeIds: ["t5", "t6", "e1", "e2"],
      },
    ],
    symbolsUsed: [
      "pool",
      "lane",
      "event-start",
      "task-user",
      "task-send",
      "gateway-parallel",
      "gateway-exclusive",
      "event-end",
      "event-end-message",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway paralelo (AND): entrevista e documentos acontecem ao mesmo tempo, sem condição — todos os ramos executam e depois sincronizam na junção.",
      },
      {
        node: "gw3",
        text: "Gateway exclusivo (XOR): o resultado da avaliação é único — aprovado OU reprovado, com as saídas rotuladas pelas condições.",
      },
    ],
  },

  /* ================================================================= */
  /* 4. Aprovação de despesa                                           */
  /* ================================================================= */
  {
    id: "ex-aprovacao",
    title: "Aprovação de despesa",
    category: "Financeiro",
    difficulty: "medio",
    problem:
      "A empresa precisa controlar reembolsos de despesas sem burocratizar os casos pequenos, aprovando rápido o que está dentro da política e escalando o que exige atenção maior.",
    scenario:
      "O colaborador lança uma despesa com a nota fiscal anexada. O financeiro confere a documentação e classifica o valor: até R$ 500, o gestor direto aprova; acima disso, a diretoria também participa. Qualquer reprovção volta ao colaborador com justificativa, e as despesas aprovadas são reembolsadas na folha seguinte.",
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Despesa lançada", marker: "message" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Conferir a nota fiscal", taskType: "user" }),
        n("gw1", "gateway", 540, ROW_MAIN, { gateway: "exclusive", label: "Documentação ok?" }),
        n("t2", "task", 780, ROW_BOTTOM, { label: "Devolver com justificativa", taskType: "send" }),
        n("e2", "end", 1020, ROW_BOTTOM, { label: "Despesa devolvida", marker: "message" }),
        n("t3", "task", 780, ROW_MAIN, { label: "Aprovar do gestor", taskType: "user" }),
        n("gw2", "gateway", 1020, ROW_MAIN, { gateway: "exclusive", label: "Acima de R$ 500?" }),
        n("t4", "task", 1260, ROW_TOP, { label: "Aprovar da diretoria", taskType: "user" }),
        n("t5", "task", 1260, ROW_MAIN, { label: "Programar o reembolso", taskType: "service" }),
        n("e1", "end", 1520, ROW_MAIN, { label: "Despesa reembolsada" }),
        n("e3", "end", 1520, ROW_TOP, { label: "Reembolso autorizado" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Não"),
        e("f4", "gw1", "t3", "Sim"),
        e("f5", "t2", "e2"),
        e("f6", "t3", "gw2"),
        e("f7", "gw2", "t4", "Sim"),
        e("f8", "gw2", "t5", "Não"),
        e("f9", "t4", "t5"),
        e("f10", "t5", "e1"),
        e("f11", "t4", "e3"),
      ]
    ),
    steps: [
      {
        index: 1,
        title: "Lançamento e conferência",
        text: "A despesa chega por mensagem com a nota anexada. O financeiro confere a documentação antes de qualquer decisão.",
        nodeIds: ["s", "t1"],
      },
      {
        index: 2,
        title: "Primeira triagem",
        text: "Documentação incompleta devolve a despesa ao colaborador com justificativa — caminho que encerra com mensagem.",
        nodeIds: ["gw1"],
      },
      {
        index: 3,
        title: "Aprovação do gestor",
        text: "Com documentação válida, o gestor direto avalia a despesa. É uma tarefa de usuário: uma pessoa decide dentro do sistema.",
        nodeIds: ["t3"],
      },
      {
        index: 4,
        title: "Limite de valor",
        text: "O gateway exclusivo pergunta se o valor passa de R$ 500. Se passa, a diretoria também aprova; se não, segue direto para o reembolso.",
        nodeIds: ["gw2", "t4"],
      },
      {
        index: 5,
        title: "Reembolso",
        text: "Aprovada a despesa, o sistema programa o pagamento na folha seguinte e o processo termina com o valor reembolsado.",
        nodeIds: ["t5", "e1", "e3"],
      },
    ],
    symbolsUsed: [
      "event-start-message",
      "task-user",
      "task-service",
      "task-send",
      "gateway-exclusive",
      "event-end",
      "event-end-message",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway exclusivo (XOR): a documentação está completa ou não — respostas que se excluem, com as condições rotuladas nas saídas.",
      },
      {
        node: "gw2",
        text: "Gateway exclusivo (XOR): o valor da despesa cai em uma faixa ou na outra. É uma comparação simples de limite.",
      },
    ],
  },

  /* ================================================================= */
  /* 5. Emissão de certificado                                         */
  /* ================================================================= */
  {
    id: "ex-certificado",
    title: "Emissão de certificado",
    category: "Educação",
    difficulty: "facil",
    problem:
      "Uma instituição de ensino precisa emitir certificados apenas para alunos que concluíram todas as exigências, evitando emissões indevidas.",
    scenario:
      "Ao final do curso, o sistema verifica a frequência e as notas do aluno. Se ambas forem aprovadas, o certificado é gerado e enviado por e-mail. Se qualquer requisito falhar, o aluno é avisado e tem direito a uma nova tentativa no próximo ciclo.",
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Curso concluído", marker: "signal" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Verificar frequência e notas", taskType: "service" }),
        n("gw1", "gateway", 540, ROW_MAIN, { gateway: "inclusive", label: "Requisitos atendidos?" }),
        n("t2", "task", 780, ROW_TOP, { label: "Gerar o certificado", taskType: "service" }),
        n("t3", "task", 1020, ROW_TOP, { label: "Enviar por e-mail", taskType: "send" }),
        n("e1", "end", 1260, ROW_TOP, { label: "Certificado emitido", marker: "message" }),
        n("t4", "task", 780, ROW_BOTTOM, { label: "Avisar o aluno", taskType: "send" }),
        n("e2", "end", 1020, ROW_BOTTOM, { label: "Aguardando nova tentativa" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Frequência e notas OK"),
        e("f4", "gw1", "t4", "Requisito não atendido"),
        e("f5", "t2", "t3"),
        e("f6", "t3", "e1"),
        e("f7", "t4", "e2"),
      ]
    ),
    steps: [
      {
        index: 1,
        title: "Gatilho por sinal",
        text: "O sinal de conclusão do curso dispara o processo para todos os alunos elegíveis ao mesmo tempo.",
        nodeIds: ["s"],
      },
      {
        index: 2,
        title: "Verificação automática",
        text: "O sistema confere frequência e notas — uma tarefa de serviço, sem intervenção humana.",
        nodeIds: ["t1"],
      },
      {
        index: 3,
        title: "Avaliação dos requisitos",
        text: "O gateway avalia se as exigências foram cumpridas e direciona para a emissão ou para o aviso.",
        nodeIds: ["gw1"],
      },
      {
        index: 4,
        title: "Emissão e envio",
        text: "Aprovado o aluno, o certificado é gerado e enviado por e-mail, terminando com uma mensagem ao destinatário.",
        nodeIds: ["t2", "t3", "e1"],
      },
      {
        index: 5,
        title: "Nova tentativa",
        text: "Sem requisitos, o aluno é avisado e o processo encerra aguardando o próximo ciclo.",
        nodeIds: ["t4", "e2"],
      },
    ],
    symbolsUsed: [
      "event-start-signal",
      "task-service",
      "task-send",
      "gateway-inclusive",
      "event-end-message",
      "event-end",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway inclusivo (OR): as exigências de frequência e nota podem falhar isoladamente ou em conjunto, então um ou mais caminhos de correção podem valer ao mesmo tempo.",
      },
    ],
  },

  /* ================================================================= */
  /* 6. Suporte técnico com paralelismo                                */
  /* ================================================================= */
  {
    id: "ex-suporte",
    title: "Resolução de chamado técnico",
    category: "TI",
    difficulty: "avancado",
    problem:
      "A equipe de TI precisa resolver chamados com prazo controlado, executando diagnóstico e backup em paralelo e reagindo a falhas sem perder o histórico.",
    scenario:
      "Um chamado chega pelo portal. O técnico inicia o diagnóstico e, ao mesmo tempo, executa o backup do ambiente afetado. Se o diagnóstico identificar falha, o tratamento é aplicado; caso contrário, o chamado é encerrado como falso alarme. Antes de finalizar, o sistema espera a validação do usuário por até 48 horas — se não houver resposta, o chamado é encerrado automaticamente.",
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Chamado aberto", marker: "message" }),
        n("gw1", "gateway", 260, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
        n("t1", "task", 480, ROW_TOP, { label: "Diagnosticar o ambiente", taskType: "user" }),
        n("t2", "task", 480, ROW_BOTTOM, { label: "Executar o backup", taskType: "service" }),
        n("gw2", "gateway", 700, ROW_MAIN, { gateway: "parallel", label: "Juntar" }),
        n("gw3", "gateway", 880, ROW_MAIN, { gateway: "exclusive", label: "Há falha?" }),
        n("t3", "task", 1100, ROW_TOP, { label: "Aplicar o tratamento", taskType: "user" }),
        n("t4", "task", 1100, ROW_BOTTOM, { label: "Registrar falso alarme", taskType: "service" }),
        n("e2", "end", 1340, ROW_BOTTOM, { label: "Chamado encerrado sem falha" }),
        n("i1", "intermediate", 1340, ROW_TOP, { label: "Aguardar validação (48h)", marker: "timer" }),
        n("gw4", "gateway", 1540, ROW_TOP, { gateway: "eventBased", label: "Resposta?" }),
        n("i2", "intermediate", 1760, ROW_TOP, { label: "Validação recebida", marker: "message" }),
        n("t5", "task", 1760, ROW_BOTTOM, { label: "Encerrar por timeout", taskType: "service" }),
        n("e1", "end", 2000, ROW_TOP, { label: "Chamado resolvido", marker: "message" }),
        n("e3", "end", 2000, ROW_BOTTOM, { label: "Encerrado sem validação" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1"),
        e("f3", "gw1", "t2"),
        e("f4", "t1", "gw2"),
        e("f5", "t2", "gw2"),
        e("f6", "gw2", "gw3"),
        e("f7", "gw3", "t3", "Sim"),
        e("f8", "gw3", "t4", "Não"),
        e("f9", "t3", "i1"),
        e("f10", "t4", "e2"),
        e("f11", "i1", "gw4"),
        e("f12", "gw4", "i2"),
        e("f13", "gw4", "t5"),
        e("f14", "i2", "e1"),
        e("f15", "t5", "e3"),
      ]
    ),
    steps: [
      {
        index: 1,
        title: "Abertura e divisão paralela",
        text: "O chamado chega por mensagem e o gateway paralelo dispara diagnóstico e backup ao mesmo tempo — independentes entre si.",
        nodeIds: ["s", "gw1", "t1", "t2"],
      },
      {
        index: 2,
        title: "Sincronização",
        text: "A junção paralela aguarda as duas frentes antes de prosseguir, garantindo que o backup esteja pronto para eventual rollback.",
        nodeIds: ["gw2"],
      },
      {
        index: 3,
        title: "Diagnóstico",
        text: "O gateway exclusivo avalia o resultado do diagnóstico: com falha, aplica-se o tratamento; sem falha, registra-se o falso alarme.",
        nodeIds: ["gw3", "t3", "t4"],
      },
      {
        index: 4,
        title: "Espera com prazo",
        text: "O evento intermediário de temporizador segura o fluxo por até 48 horas aguardando a validação do usuário.",
        nodeIds: ["i1"],
      },
      {
        index: 5,
        title: "Gateway de eventos",
        text: "O gateway baseado em eventos decide pelo tempo: validação recebida ou timeout — o que chegar primeiro define o desfecho.",
        nodeIds: ["gw4", "i2", "t5", "e1", "e3"],
      },
    ],
    symbolsUsed: [
      "event-start-message",
      "gateway-parallel",
      "gateway-exclusive",
      "gateway-event-based",
      "event-intermediate-timer",
      "event-intermediate-message",
      "task-user",
      "task-service",
      "event-end-message",
      "event-end",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway paralelo (AND): diagnóstico e backup não dependem um do outro — ambos executam, e a junção sincroniza antes da próxima etapa.",
      },
      {
        node: "gw3",
        text: "Gateway exclusivo (XOR): o diagnóstico resulta em falha OU ausência de falha; as condições se excluem e ficam rotuladas nas saídas.",
      },
      {
        node: "gw4",
        text: "Gateway baseado em eventos: a escolha não depende de condição de dados, e sim de qual ocorrência chega primeiro — validação por mensagem ou expiração do prazo.",
      },
    ],
  },

  /* ================================================================= */
  /* 7. Pagamento de fatura                                            */
  /* ================================================================= */
  {
    id: "ex-pagamento",
    title: "Pagamento de fatura",
    category: "Financeiro",
    difficulty: "medio",
    problem:
      "A empresa precisa receber faturas com prazo definido, cobrando automaticamente os atrasados e encerrando cada fatura de forma inequívoca.",
    scenario:
      "A fatura é emitida e enviada ao cliente. O processo espera o vencimento e verifica se o pagamento chegou. Pago, a fatura é baixada; em aberto, é emitida uma cobrança e o processo aguarda mais cinco dias. Ainda sem pagamento, o processo encerra marcando a inadimplência para recuperação.",
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Fatura emitida", marker: "message" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Enviar a fatura ao cliente", taskType: "send" }),
        n("i1", "intermediate", 540, ROW_MAIN, { label: "Aguardar o vencimento", marker: "timer" }),
        n("gw1", "gateway", 760, ROW_MAIN, { gateway: "exclusive", label: "Pago até o vencimento?" }),
        n("t2", "task", 980, ROW_TOP, { label: "Baixar a fatura", taskType: "service" }),
        n("e1", "end", 1220, ROW_TOP, { label: "Fatura liquidada" }),
        n("t3", "task", 980, ROW_BOTTOM, { label: "Emitir cobrança", taskType: "send" }),
        n("i2", "intermediate", 1220, ROW_BOTTOM, { label: "Esperar 5 dias", marker: "timer" }),
        n("gw2", "gateway", 1440, ROW_BOTTOM, { gateway: "exclusive", label: "Pagou na cobrança?" }),
        n("t4", "task", 1660, ROW_BOTTOM, { label: "Baixar com multa", taskType: "service" }),
        n("e2", "end", 1900, ROW_BOTTOM, { label: "Fatura paga com atraso" }),
        n("e3", "end", 1660, ROW_TOP, { label: "Inadimplência registrada" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "i1"),
        e("f3", "i1", "gw1"),
        e("f4", "gw1", "t2", "Sim"),
        e("f5", "gw1", "t3", "Não"),
        e("f6", "t2", "e1"),
        e("f7", "t3", "i2"),
        e("f8", "i2", "gw2"),
        e("f9", "gw2", "t4", "Sim"),
        e("f10", "gw2", "e3", "Não"),
        e("f11", "t4", "e2"),
      ]
    ),
    steps: [
      {
        index: 1,
        title: "Emissão e envio",
        text: "A fatura nasce por mensagem e é enviada ao cliente por uma tarefa de envio — sem espera de resposta nesta etapa.",
        nodeIds: ["s", "t1"],
      },
      {
        index: 2,
        title: "Espera até o vencimento",
        text: "O evento intermediário de temporizador segura o fluxo até a data de vencimento da fatura.",
        nodeIds: ["i1"],
      },
      {
        index: 3,
        title: "Verificação do pagamento",
        text: "O gateway exclusivo avalia se o pagamento foi recebido até o vencimento e separa os dois caminhos.",
        nodeIds: ["gw1"],
      },
      {
        index: 4,
        title: "Liquidação",
        text: "Pago no prazo, a fatura é baixada pelo sistema e o processo termina com a liquidação registrada.",
        nodeIds: ["t2", "e1"],
      },
      {
        index: 5,
        title: "Cobrança e inadimplência",
        text: "Sem pagamento, é emitida a cobrança e o processo espera mais cinco dias. Se ainda não pagar, a inadimplência é registrada; pagando com atraso, aplica-se a multa e baixa-se a fatura.",
        nodeIds: ["t3", "i2", "gw2", "t4", "e2", "e3"],
      },
    ],
    symbolsUsed: [
      "event-start-message",
      "task-send",
      "task-service",
      "event-intermediate-timer",
      "gateway-exclusive",
      "event-end",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway exclusivo (XOR): a fatura foi paga até o vencimento OU não foi — respostas que se excluem mutuamente, com condições rotuladas.",
      },
      {
        node: "gw2",
        text: "Gateway exclusivo (XOR): depois da cobrança, o cliente pagou ou continuou inadimplente. Um segundo ciclo de decisão idêntico ao anterior.",
      },
    ],
    simulation: {
      startNodeId: "s",
      decisions: [
        {
          nodeId: "gw1",
          question: "O cliente pagou a fatura até o vencimento?",
          options: [
            { label: "Sim, pagou no prazo", edgeId: "f4", outcome: "Fatura liquidada sem multa." },
            { label: "Não, venceu em aberto", edgeId: "f5", outcome: "Cobrança emitida ao cliente." },
          ],
        },
        {
          nodeId: "gw2",
          question: "Após a cobrança, o cliente pagou?",
          options: [
            { label: "Sim, pagou com atraso", edgeId: "f9", outcome: "Fatura baixada com multa de atraso." },
            { label: "Não, seguiu inadimplente", edgeId: "f10", outcome: "Inadimplência registrada para recuperação." },
          ],
        },
      ],
      endings: {
        e1: "Fatura paga no prazo — processo concluído sem pendências.",
        e2: "Fatura paga após a cobrança, com multa aplicada.",
        e3: "Cliente inadimplente: a fatura segue para recuperação.",
      },
    },
  },

  /* ================================================================= */
  /* 8. Matrícula escolar                                              */
  /* ================================================================= */
  {
    id: "ex-matricula",
    title: "Matrícula escolar",
    category: "Educação",
    difficulty: "facil",
    problem:
      "A escola precisa processar matrículas verificando vagas e documentação, confirmando cada inscrição apenas após todos os requisitos.",
    scenario:
      "A família solicita a matrícula online. O sistema verifica se há vaga na turma e se a documentação está completa. Sem vaga, a família é avisada e pode escolher outra turma; com vaga e documentos, a matrícula é confirmada e a reserva do posto é feita.",
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Matrícula solicitada", marker: "message" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Verificar a documentação", taskType: "service" }),
        n("gw1", "gateway", 540, ROW_MAIN, { gateway: "exclusive", label: "Documentos completos?" }),
        n("t2", "task", 780, ROW_BOTTOM, { label: "Solicitar os documentos faltantes", taskType: "send" }),
        n("e2", "end", 1020, ROW_BOTTOM, { label: "Aguardando documentos" }),
        n("t3", "task", 780, ROW_MAIN, { label: "Consultar a vaga na turma", taskType: "service" }),
        n("gw2", "gateway", 1020, ROW_MAIN, { gateway: "exclusive", label: "Há vaga?" }),
        n("t4", "task", 1260, ROW_TOP, { label: "Confirmar a matrícula", taskType: "user" }),
        n("t5", "task", 1260, ROW_BOTTOM, { label: "Oferecer outra turma", taskType: "send" }),
        n("e1", "end", 1520, ROW_TOP, { label: "Matrícula confirmada" }),
        n("e3", "end", 1520, ROW_BOTTOM, { label: "Turma lotada informada" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Não"),
        e("f4", "gw1", "t3", "Sim"),
        e("f5", "t2", "e2"),
        e("f6", "t3", "gw2"),
        e("f7", "gw2", "t4", "Sim"),
        e("f8", "gw2", "t5", "Não"),
        e("f9", "t4", "e1"),
        e("f10", "t5", "e3"),
      ]
    ),
    steps: [
      {
        index: 1,
        title: "Solicitação",
        text: "A matrícula chega por mensagem e o sistema confere a documentação enviada pela família.",
        nodeIds: ["s", "t1"],
      },
      {
        index: 2,
        title: "Documentação",
        text: "Documentos incompletos geram um pedido de complemento e o processo espera — o desfecho é provisório.",
        nodeIds: ["gw1", "t2", "e2"],
      },
      {
        index: 3,
        title: "Consulta de vaga",
        text: "Com documentos válidos, o sistema consulta a lotação da turma antes de qualquer confirmação.",
        nodeIds: ["t3"],
      },
      {
        index: 4,
        title: "Decisão final",
        text: "Com vaga, a matrícula é confirmada pela equipe. Sem vaga, a família recebe a oferta de outra turma.",
        nodeIds: ["gw2", "t4", "t5"],
      },
      {
        index: 5,
        title: "Desfechos",
        text: "O processo termina em um de três finais: matrícula confirmada, documentos pendentes ou turma lotada informada.",
        nodeIds: ["e1", "e2", "e3"],
      },
    ],
    symbolsUsed: [
      "event-start-message",
      "task-service",
      "task-user",
      "task-send",
      "gateway-exclusive",
      "event-end",
      "event-end-message",
      "flow-sequence",
    ],
    decisions: [
      {
        node: "gw1",
        text: "Gateway exclusivo (XOR): os documentos estão completos OU não estão — uma classificação binária com saídas rotuladas.",
      },
      {
        node: "gw2",
        text: "Gateway exclusivo (XOR): há vaga OU a turma está lotada. A resposta define qual dos dois desfechos o processo alcança.",
      },
    ],
  },
];
