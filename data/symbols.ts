import type { BpmnSymbol, SymbolCategoryInfo } from "@/types";
import { d, e, n, box, ROW_MAIN, ROW_TOP, ROW_BOTTOM } from "./diagram-helpers";

export const symbolCategories: SymbolCategoryInfo[] = [
  {
    id: "event",
    name: "Eventos",
    description:
      "Ocorrências que iniciam, interrompem ou encerram um processo. São sempre circulares.",
    color: "#0284c7",
  },
  {
    id: "activity",
    name: "Atividades",
    description:
      "O trabalho realizado dentro do processo: tarefas, subprocessos e chamadas.",
    color: "#047857",
  },
  {
    id: "gateway",
    name: "Gateways",
    description:
      "Pontos de controle do fluxo: divisão, junção, decisão e sincronização.",
    color: "#b45309",
  },
  {
    id: "connection",
    name: "Objetos de conexão",
    description: "Linhas que ligam os elementos: sequência, mensagem e associação.",
    color: "#4338ca",
  },
  {
    id: "structure",
    name: "Raias e participantes",
    description: "Estrutura de organização: pools, lanes e participantes.",
    color: "#be123c",
  },
  {
    id: "artifact",
    name: "Artefatos",
    description:
      "Elementos auxiliares que documentam o processo sem alterar o fluxo.",
    color: "#6d28d9",
  },
];

export const bpmnSymbols: BpmnSymbol[] = [
  /* ================================================================ */
  /* A. EVENTOS                                                        */
  /* ================================================================ */
  {
    id: "event-start",
    category: "event",
    namePt: "Evento de início",
    nameEn: "None Start Event",
    summary:
      "Círculo de borda fina que indica o ponto de partida de um processo. Não possui marcador interno.",
    purpose: "Define onde a instância do processo começa a ser executada.",
    whenToUse:
      "Use sempre exatamente um evento de início por processo. Escolha a variante certa conforme o gatilho: sem gatilho explícito, use o início simples.",
    example:
      "Um processo de atendimento começa quando o cliente liga para o call center.",
    commonErrors: [
      "Criar mais de um evento de início no mesmo processo (válido apenas em subprocessos com múltiplos gatilhos).",
      "Usar evento de início como se fosse uma atividade de espera.",
      "Deixar o evento de início sem nenhuma saída — o fluxo nunca começa.",
    ],
    keywords: ["início", "start", "começo", "gatilho", "inicial"],
    render: { kind: "event", phase: "start", marker: "none" },
    miniExample: {
      caption: "Processo simples: começa, executa uma tarefa e termina.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Cliente liga" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Atender o cliente" }),
          n("e1", "end", 480, ROW_MAIN, { label: "Atendimento encerrado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "e1")]
      ),
      highlightNodeIds: ["s"],
    },
  },
  {
    id: "event-start-message",
    category: "event",
    namePt: "Evento de início por mensagem",
    nameEn: "Message Start Event",
    summary:
      "Evento de início com o marcador de envelope, indicando que o processo só começa quando uma mensagem chega.",
    purpose:
      "Inicia uma instância do processo como resposta a uma comunicação externa.",
    whenToUse:
      "Use quando outro processo ou participante dispara o início, por exemplo o recebimento de um pedido por e-mail ou de uma chamada de API.",
    example:
      "Um processo de faturamento começa quando o sistema recebido a confirmação do pedido do cliente.",
    commonErrors: [
      "Confundir com evento de início por sinal: mensagem tem destinatário específico, sinal não.",
      "Usar mensagem de início e, na mesma atividade, esperar outra mensagem sem necessidade.",
    ],
    keywords: ["mensagem", "message", "envelope", "e-mail", "início"],
    render: { kind: "event", phase: "start", marker: "message" },
    miniExample: {
      caption: "O pedido chega por mensagem e dispara o processo de venda.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido", marker: "message" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Validar o pedido" }),
          n("e1", "end", 480, ROW_MAIN, { label: "Pedido em separação" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "e1")]
      ),
      highlightNodeIds: ["s"],
    },
  },
  {
    id: "event-start-timer",
    category: "event",
    namePt: "Evento de início por temporizador",
    nameEn: "Timer Start Event",
    summary:
      "Evento de início com o marcador de relógio: o processo começa em um horário, data ou intervalo definido.",
    purpose: "Dispara processos rotineiros e recorrentes sem intervenção humana.",
    whenToUse:
      "Use para rotinas diárias, semanais ou mensais, como fechamento contábil, envio de relatórios e varreduras noturnas.",
    example: "Todo dia às 08h inicia o processo de geração do relatório de vendas.",
    commonErrors: [
      "Usar temporizador no meio do processo sem justificar a espera (prefira evento intermediário).",
      "Escrever a regra de tempo apenas no rótulo sem definir a expressão no elemento.",
      "Misturar recorrência (repeat) com espera simples.",
    ],
    keywords: ["temporizador", "timer", "relógio", "horário", "agendar", "recorrente"],
    render: { kind: "event", phase: "start", marker: "timer" },
    miniExample: {
      caption: "Fechamento diário disparado automaticamente às 18h.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Todo dia às 18h", marker: "timer" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Gerar relatório do dia" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Enviar aos gestores", taskType: "send" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Relatório enviado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["s"],
    },
  },
  {
    id: "event-start-signal",
    category: "event",
    namePt: "Evento de início por sinal",
    nameEn: "Signal Start Event",
    summary:
      "Evento de início com o marcador de triângulo, indicando que o processo começa ao ser emitido um sinal broadcast.",
    purpose:
      "Reage a um evento broadcast que pode ser capturado por vários processos ao mesmo tempo.",
    whenToUse:
      "Use quando um único comunicador dispara múltiplos processos, como um alerta de segurança, abertura de loja ou nova campanha.",
    example:
      "Ao abrir a loja, um sinal inicia os processos de acionamento de caixas e de liberação do sistema.",
    commonErrors: [
      "Usar sinal quando apenas um destinatário reage — nesse caso use mensagem.",
      "Confundir sinal com erro: sinal não interrompe o fluxo por falha técnica.",
    ],
    keywords: ["sinal", "signal", "broadcast", "triângulo", "alerta"],
    render: { kind: "event", phase: "start", marker: "signal" },
    miniExample: {
      caption: "Um sinal de abertura dispara o preparo da loja.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Sinal: loja aberta", marker: "signal" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Acionar os caixas" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Liberar o sistema" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Loja pronta" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["s"],
    },
  },
  {
    id: "event-intermediate",
    category: "event",
    namePt: "Evento intermediário",
    nameEn: "None Intermediate Event",
    summary:
      "Evento de borda dupla usado no meio do fluxo. Sem marcador, representa uma ocorrência genérica registrada no processo.",
    purpose: "Marca um ponto de passagem ou uma verificação entre etapas.",
    whenToUse:
      "Use como ponto de controle de acompanhamento, por exemplo marcar que uma aprovação foi registrada, sem gatilho de mensagem ou tempo.",
    example: "Depois de aprovar a compra, registra-se um ponto de acompanhamento antes do pagamento.",
    commonErrors: [
      "Usar intermediário sem marcador quando o que existe é uma espera (use temporizador).",
      "Colocar evento intermediário no lugar de uma atividade que executa trabalho.",
    ],
    keywords: ["intermediário", "intermediate", "borda dupla", "marcação", "checkpoint"],
    render: { kind: "event", phase: "intermediate", marker: "none" },
    miniExample: {
      caption: "Ponto de acompanhamento entre duas etapas do processo.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Solicitação criada" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Revisar a solicitação" }),
          n("i1", "intermediate", 480, ROW_MAIN, { label: "Aprovação registrada" }),
          n("t2", "task", 680, ROW_MAIN, { label: "Executar a compra" }),
          n("e1", "end", 880, ROW_MAIN, { label: "Compra concluída" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "i1"), e("f3", "i1", "t2"), e("f4", "t2", "e1")]
      ),
      highlightNodeIds: ["i1"],
    },
  },
  {
    id: "event-intermediate-message",
    category: "event",
    namePt: "Evento intermediário de mensagem",
    nameEn: "Message Intermediate Catching Event",
    summary:
      "Evento de borda dupla com envelope: o fluxo pausa até que uma mensagem específica seja recebida.",
    purpose: "Sincroniza o processo com uma resposta externa (cliente, sistema ou outro processo).",
    whenToUse:
      "Use sempre que o processo precisar aguardar uma confirmação, resposta ou notificação antes de continuar.",
    example:
      "Após enviar a proposta, o processo espera a resposta do cliente por mensagem antes de faturar.",
    commonErrors: [
      "Usar um evento intermediário simples no lugar da espera por mensagem.",
      "Criar a espera como atividade manual de espera em vez de evento de mensagem.",
      "Colocar evento de mensagem entre pools com fluxo de sequência (é proibido).",
    ],
    keywords: ["mensagem", "message", "espera", "resposta", "intermediário"],
    render: { kind: "event", phase: "intermediate", marker: "message" },
    miniExample: {
      caption: "O processo aguarda a confirmação do cliente antes de faturar.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Proposta enviada" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Aguardar resposta do cliente" }),
          n("i1", "intermediate", 480, ROW_MAIN, { label: "Resposta recebida", marker: "message" }),
          n("t2", "task", 680, ROW_MAIN, { label: "Faturar o contrato" }),
          n("e1", "end", 880, ROW_MAIN, { label: "Contrato faturado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "i1"), e("f3", "i1", "t2"), e("f4", "t2", "e1")]
      ),
      highlightNodeIds: ["i1"],
    },
  },
  {
    id: "event-intermediate-timer",
    category: "event",
    namePt: "Evento intermediário de temporizador",
    nameEn: "Timer Intermediate Catching Event",
    summary:
      "Evento de borda dupla com relógio: o fluxo espera até uma data, horário ou duração específica.",
    purpose: "Controla prazos, carências e janelas de tempo dentro do processo.",
    whenToUse:
      "Use para esperas deliberadas como 'aguardar 24 horas', 'até as 9h' ou '3 dias úteis após o envio'.",
    example:
      "Após enviar a cobrança, o processo espera 5 dias antes de verificar se o pagamento chegou.",
    commonErrors: [
      "Usar temporizador de início quando a espera é intermediária.",
      "Modelar a espera como tarefa em vez de evento.",
      "Esquecer de conectar a saída do temporizador — a espera nunca termina.",
    ],
    keywords: ["temporizador", "timer", "prazo", "espera", "carência", "horário"],
    render: { kind: "event", phase: "intermediate", marker: "timer" },
    miniExample: {
      caption: "Após a cobrança, espera-se 5 dias antes de verificar o pagamento.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Cobrança emitida" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Emitir a cobrança", taskType: "send" }),
          n("i1", "intermediate", 480, ROW_MAIN, { label: "Esperar 5 dias", marker: "timer" }),
          n("t2", "task", 680, ROW_MAIN, { label: "Verificar o pagamento" }),
          n("e1", "end", 880, ROW_MAIN, { label: "Cobrança concluída" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "i1"), e("f3", "i1", "t2"), e("f4", "t2", "e1")]
      ),
      highlightNodeIds: ["i1"],
    },
  },
  {
    id: "event-intermediate-error",
    category: "event",
    namePt: "Evento intermediário de erro",
    nameEn: "Error Intermediate Catching Event",
    summary:
      "Evento de borda dupla e borda externa dupla com o marcador de raio: captura uma falha vinda de uma atividade ou subprocesso.",
    purpose: "Desvia o fluxo quando uma atividade falha, permitindo tratamento da exceção.",
    whenToUse:
      "Use como evento de fronteira anexado a uma atividade ou dentro de um subprocesso de evento. Nunca use como evento intermediário comum no meio do fluxo.",
    example:
      "Anexado à tarefa 'Processar pagamento', ele desvia para 'Notificar falha' se o banco recusar a transação.",
    commonErrors: [
      "Colocar evento de erro solto no meio do fluxo sem estar anexado a uma atividade.",
      "Usar erro para regra de negócio — erro é exceção técnica, não decisão.",
      "Confundir erro com cancelamento: cancelamento interrompe uma transação.",
    ],
    keywords: ["erro", "error", "exceção", "falha", "raio", "fronteira", "boundary"],
    render: { kind: "event", phase: "intermediate", marker: "error" },
    miniExample: {
      caption: "O evento de erro fica anexado à atividade e desvia o fluxo em caso de falha.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pagamento solicitado" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Processar pagamento" }),
          n("b1", "intermediate", 300, 194, { label: "Falha no banco", marker: "error" }),
          n("t2", "task", 520, 194, { label: "Notificar a falha", taskType: "send" }),
          n("e1", "end", 720, ROW_MAIN, { label: "Pagamento aprovado" }),
          n("e2", "end", 720, 194, { label: "Pagamento recusado", marker: "error" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "e1"), e("f3", "b1", "t2"), e("f4", "t2", "e2")]
      ),
      highlightNodeIds: ["b1"],
    },
  },
  {
    id: "event-intermediate-escalation",
    category: "event",
    namePt: "Evento intermediário de escalonamento",
    nameEn: "Escalation Intermediate Catching Event",
    summary:
      "Evento de borda dupla com o marcador de seta em zigue-zague: captura um escalonamento de nível hierárquico.",
    purpose: "Pede atenção de um nível superior sem encerrar a atividade original.",
    whenToUse:
      "Use como evento de fronteira não interruptivo quando uma tarefa demora ou precisa de aprovação de um gestor.",
    example:
      "Após 2 dias sem resposta, a análise é escalada ao gerente enquanto o processo segue em paralelo.",
    commonErrors: [
      "Usar escalonamento para erro técnico (use erro).",
      "Confundir com cancelamento: escalonamento não interrompe a atividade anexada.",
    ],
    keywords: ["escalonamento", "escalation", "gerente", "nível superior", "zigue-zague"],
    render: { kind: "event", phase: "intermediate", marker: "escalation" },
    miniExample: {
      caption: "Se a análise demora, o caso é escalado ao gestor sem parar a atividade.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Caso aberto" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Analisar o caso" }),
          n("b1", "intermediate", 300, 194, { label: "Demora detectada", marker: "escalation" }),
          n("t2", "task", 520, 194, { label: "Escalar ao gestor", taskType: "send" }),
          n("e1", "end", 720, ROW_MAIN, { label: "Caso resolvido" }),
          n("e2", "end", 720, 194, { label: "Gestor notificado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "e1"), e("f3", "b1", "t2"), e("f4", "t2", "e2")]
      ),
      highlightNodeIds: ["b1"],
    },
  },
  {
    id: "event-end",
    category: "event",
    namePt: "Evento de fim",
    nameEn: "None End Event",
    summary:
      "Círculo de borda grossa que encerra o fluxo sem nenhum marcador interno.",
    purpose: "Indica que a instância do processo terminou com normalidade.",
    whenToUse:
      "Use para o desfecho padrão do processo. Prefira rótulos que digam o resultado alcançado, não apenas 'fim'.",
    example: "O atendimento termina depois que o cliente confirma a solução do problema.",
    commonErrors: [
      "Deixar o evento de fim sem rótulo, perdendo o resultado do processo.",
      "Conectar uma saída no evento de fim (fim não tem saída).",
      "Encerrar o processo com uma tarefa em vez de evento de fim.",
    ],
    keywords: ["fim", "end", "encerramento", "término", "borda grossa"],
    render: { kind: "event", phase: "end", marker: "none" },
    miniExample: {
      caption: "O fluxo termina em um evento de fim sem marcador.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Separar os itens" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Entregar ao cliente" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Pedido entregue" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["e1"],
    },
  },
  {
    id: "event-end-message",
    category: "event",
    namePt: "Evento de fim por mensagem",
    nameEn: "Message End Event",
    summary:
      "Evento de fim com marcador de envelope: o processo termina emitindo uma mensagem para fora dele.",
    purpose: "Encerra o fluxo avisando um participante ou sistema sobre o resultado.",
    whenToUse:
      "Use quando o encerramento precisa comunicar alguém, como confirmação de pedido, aviso de reprovação ou notificação de conclusão.",
    example: "Ao concluir a análise, o processo envia a resposta ao solicitante e termina.",
    commonErrors: [
      "Usar fim por mensagem quando ninguém é notificado.",
      "Colocar duas notificações no mesmo fim (separe em duas tarefas de envio antes).",
    ],
    keywords: ["fim", "mensagem", "message", "notificar", "avisar"],
    render: { kind: "event", phase: "end", marker: "message" },
    miniExample: {
      caption: "O processo termina avisando o cliente por mensagem.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Solicitação recebida" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Analisar a solicitação" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Responder ao solicitante", taskType: "send" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Resposta enviada", marker: "message" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["e1"],
    },
  },
  {
    id: "event-end-error",
    category: "event",
    namePt: "Evento de fim por erro",
    nameEn: "Error End Event",
    summary:
      "Evento de fim com borda dupla e marcador de raio: encerra o fluxo sinalizando uma falha tratada.",
    purpose: "Propaga uma exceção para um processo chamador ou interrompe o subprocesso com falha.",
    whenToUse:
      "Use dentro de subprocessos e fluxos de tratamento de erro, após registrar ou notificar a falha.",
    example:
      "Se a integração com o banco falha, o subprocesso de pagamento termina com erro e o processo chamador reage.",
    commonErrors: [
      "Usar fim de erro para regra de negócio (ex.: pedido sem estoque).",
      "Encerrar com erro sem antes tentar o tratamento ou a notificação.",
    ],
    keywords: ["erro", "error", "fim", "exceção", "falha"],
    render: { kind: "event", phase: "end", marker: "error" },
    miniExample: {
      caption: "Após notificar a falha, o fluxo termina com erro.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pagamento solicitado" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Processar pagamento" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Registrar a falha" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Falha no pagamento", marker: "error" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["e1"],
    },
  },
  {
    id: "event-end-cancel",
    category: "event",
    namePt: "Evento de fim por cancelamento",
    nameEn: "Cancel End Event",
    summary:
      "Evento de fim com borda dupla e marcador em X: encerra uma transação cancelando-a de forma controlada.",
    purpose: "Propaga o cancelamento de uma transação para o processo que a iniciou.",
    whenToUse:
      "Use apenas em transações (subprocesso de transação) quando uma regra de cancelamento é acionada.",
    example:
      "Na compra de ingressos, o cancelamento em até 24 horas encerra a transação e devolve o valor.",
    commonErrors: [
      "Usar cancelamento fora de uma transação — a notação exige transação.",
      "Confundir cancelamento com erro: cancelamento é intencional e regra de negócio.",
    ],
    keywords: ["cancelamento", "cancel", "transação", "estorno", "devolução"],
    render: { kind: "event", phase: "end", marker: "cancel" },
    miniExample: {
      caption: "Dentro de uma transação, o cancelamento encerra o fluxo com devolução.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Reserva solicitada" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Reservar o ingresso" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Confirmar a reserva" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Reserva confirmada" }),
          n("e2", "end", 680, 220, { label: "Cancelada e estornada", marker: "cancel" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "t2"),
          e("f3", "t2", "e1"),
          e("f4", "t1", "e2", "Regra de cancelamento"),
        ]
      ),
      highlightNodeIds: ["e2"],
    },
  },
  {
    id: "event-end-terminate",
    category: "event",
    namePt: "Evento de fim por terminação",
    nameEn: "Terminate End Event",
    summary:
      "Evento de fim com círculo preenchido no centro: encerra imediatamente todas as rotas paralelas do processo.",
    purpose: "Interrompe a instância inteira do processo, não apenas a rota atual.",
    whenToUse:
      "Use quando uma condição crítica encerra o processo por inteiro, mesmo com outros caminhos em execução.",
    example:
      "Se o pagamento é estornado, o pedido é encerrado na hora, parando separação e expedição que estavam em paralelo.",
    commonErrors: [
      "Usar fim simples em fluxo paralelo — os outros ramos continuariam executando.",
      "Usar terminação quando só uma rota deve parar.",
    ],
    keywords: ["terminação", "terminate", "interromper", "paralelo", "preenchido"],
    render: { kind: "event", phase: "end", marker: "terminate" },
    miniExample: {
      caption: "A terminação encerra o processo inteiro, parando também o ramo paralelo.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido aprovado" }),
          n("gw1", "gateway", 280, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
          n("t1", "task", 480, ROW_TOP, { label: "Separar os itens" }),
          n("t2", "task", 480, ROW_BOTTOM, { label: "Faturar o pedido" }),
          n("gw2", "gateway", 680, ROW_MAIN, { gateway: "parallel", label: "Juntar" }),
          n("e1", "end", 880, ROW_MAIN, { label: "Pedido concluído" }),
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
      highlightNodeIds: ["e1"],
    },
  },

  /* ================================================================ */
  /* B. ATIVIDADES                                                    */
  /* ================================================================ */
  {
    id: "task",
    category: "activity",
    namePt: "Tarefa",
    nameEn: "Task",
    summary:
      "Retângulo de cantos arredondados que representa uma unidade de trabalho executada por um ator ou sistema.",
    purpose: "Modelar a ação concreta que agrega valor ou transforma o estado do processo.",
    whenToUse:
      "Use sempre que alguém ou algo precise executar algo. Se a tarefa tiver detalhe próprio, torne-a um subprocesso.",
    example: "Separar os itens do pedido no estoque antes da expedição.",
    commonErrors: [
      "Escrever verbos no infinitivo sem objeto (diga 'Revisar a nota fiscal').",
      "Dividir demais: uma tarefa deve ser verificável em uma unidade de trabalho.",
      "Modelar uma decisão como tarefa (decisão é gateway).",
    ],
    keywords: ["tarefa", "task", "atividade", "ação", "trabalho"],
    render: { kind: "task", taskType: "none" },
    miniExample: {
      caption: "A tarefa é o elemento mais frequente de um processo.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido aprovado" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Separar os itens" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Conferir a embalagem" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Pedido pronto" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "task-user",
    category: "activity",
    namePt: "Tarefa de usuário",
    nameEn: "User Task",
    summary:
      "Tarefa executada por uma pessoa com papel definido, identificada pelo ícone de usuário no canto superior esquerdo.",
    purpose: "Indica intervenção humana em um sistema, feita por um usuário específico.",
    whenToUse:
      "Use quando uma pessoa toma uma ação na interface do sistema: revisar, aprovar, digitar, validar.",
    example: "O gestor revisa a nota fiscal no sistema e aprova ou rejeita a despesa.",
    commonErrors: [
      "Usar tarefa de usuário para ação feita por sistema ou integrador.",
      "Deixar o papel (responsável) indefinido em tarefas humanas.",
      "Confundir com tarefa manual: manual é feita fora do sistema.",
    ],
    keywords: ["usuário", "user", "humana", "pessoa", "aprovar", "revisar"],
    render: { kind: "task", taskType: "user" },
    miniExample: {
      caption: "O ícone de usuário mostra que uma pessoa executa a etapa.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Despesa lançada" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Revisar a nota", taskType: "user" }),
          n("gw1", "gateway", 480, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
          n("t2", "task", 680, ROW_TOP, { label: "Reembolsar", taskType: "service" }),
          n("e1", "end", 880, ROW_TOP, { label: "Despesa paga" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "gw1"),
          e("f3", "gw1", "t2", "Sim"),
          e("f4", "gw1", "e1", "Não"),
        ]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "task-service",
    category: "activity",
    namePt: "Tarefa de serviço",
    nameEn: "Service Task",
    summary:
      "Tarefa executada por um serviço ou aplicação automática, identificada pelo ícone de engrenagem.",
    purpose: "Representa processamento automático sem intervenção humana direta.",
    whenToUse:
      "Use para chamadas de API, consultas a banco de dados, cálculos, integrações e rotinas de sistema.",
    example: "O sistema consulta a base de crédito e retorna o limite disponível.",
    commonErrors: [
      "Usar tarefa de serviço para ação humana.",
      "Escrever 'Sistema faz...' quando na verdade é uma integração específica — nomeie a ação.",
      "Confundir com tarefa de envio/recebimento, que comunicam mensagens.",
    ],
    keywords: ["serviço", "service", "sistema", "automação", "engrenagem", "API"],
    render: { kind: "task", taskType: "service" },
    miniExample: {
      caption: "A engrenagem identifica o processamento feito pelo sistema.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Cadastro enviado" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Validar os dados", taskType: "service" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Gravar no cadastro", taskType: "service" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Cliente cadastrado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "task-manual",
    category: "activity",
    namePt: "Tarefa manual",
    nameEn: "Manual Task",
    summary:
      "Tarefa executada por uma pessoa fora de um sistema, identificada pelo ícone de mão.",
    purpose: "Marca trabalho físico ou operacional que não é apoiado por software.",
    whenToUse:
      "Use para ações como conferir a carga, imprimir um documento, transportar material ou montar um produto.",
    example: "O operador confere fisicamente a carga antes de fechar o caminhão.",
    commonErrors: [
      "Usar manual para tarefa feita em sistema (use tarefa de usuário).",
      "Confundir manual com genérica quando o modo de execução é relevante.",
    ],
    keywords: ["manual", "física", "mão", "operação", "conferir"],
    render: { kind: "task", taskType: "manual" },
    miniExample: {
      caption: "O ícone de mão marca trabalho executado fisicamente.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Mercadoria chegou" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Descarregar a carga", taskType: "manual" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Conferir a carga", taskType: "manual" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Carga conferida" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "task-send",
    category: "activity",
    namePt: "Tarefa de envio",
    nameEn: "Send Task",
    summary:
      "Tarefa que transmite uma mensagem para fora do processo, identificada pela seta saindo de uma caixa.",
    purpose: "Comunica um participante ou sistema sem esperar resposta na mesma etapa.",
    whenToUse:
      "Use quando o processo apenas emite uma comunicação: e-mail, notificação, arquivo enviado.",
    example: "O sistema envia o boleto ao cliente por e-mail.",
    commonErrors: [
      "Usar envio quando há espera por resposta (use evento intermediário de mensagem).",
      "Confundir envio com tarefa genérica que apenas 'registra' a comunicação.",
    ],
    keywords: ["envio", "send", "notificar", "e-mail", "mensagem"],
    render: { kind: "task", taskType: "send" },
    miniExample: {
      caption: "A seta saindo da caixa indica mensagem enviada pelo processo.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Venda concluída" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Emitir a nota fiscal", taskType: "service" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Enviar a nota ao cliente", taskType: "send" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Cliente notificado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t2"],
    },
  },
  {
    id: "task-receive",
    category: "activity",
    namePt: "Tarefa de recebimento",
    nameEn: "Receive Task",
    summary:
      "Tarefa que espera a chegada de uma mensagem, identificada pela seta entrando em uma caixa.",
    purpose: "Sincroniza o processo com uma comunicação externa antes de seguir.",
    whenToUse:
      "Use quando o processo precisa receber um dado ou confirmação para continuar, como um pedido ou um aceite.",
    example: "O processo de expedição espera o aceite do transportador antes de despachar.",
    commonErrors: [
      "Usar recebimento quando não há mensagem esperada.",
      "Usar recebimento no lugar do evento intermediário de mensagem sem mensagem estruturada.",
    ],
    keywords: ["recebimento", "receive", "receber", "mensagem", "aceite"],
    render: { kind: "task", taskType: "receive" },
    miniExample: {
      caption: "A seta entrando na caixa indica mensagem que o processo aguarda.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Proposta enviada" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Aguardar o aceite", taskType: "receive" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Iniciar a execução" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Contrato vigente" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "task-script",
    category: "activity",
    namePt: "Tarefa de script",
    nameEn: "Script Task",
    summary:
      "Tarefa executada por um script embutido no motor de processo, identificada pelo ícone de documento.",
    purpose: "Executa lógica local de dados sem chamar um serviço externo.",
    whenToUse:
      "Use para transformações simples de variáveis, concatenações e regras de atribuição.",
    example: "O script monta a string do e-mail de boas-vindas a partir do nome do cliente.",
    commonErrors: [
      "Usar script para lógica de negócio complexa (prefira regra de negócio ou serviço).",
      "Esconder regras importantes em scripts invisíveis para o analista de negócio.",
    ],
    keywords: ["script", "código", "automático", "variável", "documento"],
    render: { kind: "task", taskType: "script" },
    miniExample: {
      caption: "O ícone de documento identifica a execução de um script.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido pago" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Montar a mensagem", taskType: "script" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Enviar o recibo", taskType: "send" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Recibo enviado" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "subprocess",
    category: "activity",
    namePt: "Subprocesso (colapsado)",
    nameEn: "Collapsed Sub-Process",
    summary:
      "Retângulo de atividade com o marcador de '+' no rodapé, indicando que existe um fluxo interno detalhado.",
    purpose: "Condensa um conjunto de etapas em um único elemento para manter o diagrama legível.",
    whenToUse:
      "Use quando uma parte do processo tem várias etapas próprias e pode ser vista como uma unidade.",
    example:
      "A etapa 'Contratar funcionário' agrupa entrevista, exames e assinatura de contrato em um subprocesso.",
    commonErrors: [
      "Usar subprocesso para uma única tarefa.",
      "Colocar o subprocesso sem evento de início e de fim internos.",
      "Confundir com call activity: subprocesso é interno ao processo.",
    ],
    keywords: ["subprocesso", "subprocess", "colapsado", "plus", "detalhe"],
    render: { kind: "activity", activity: "subProcess" },
    miniExample: {
      caption: "O '+' indica que o elemento contém um fluxo interno detalhado.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Vaga aprovada" }),
          n("sp", "subProcess", 300, ROW_MAIN, { label: "Contratar funcionário" }),
          n("t1", "task", 540, ROW_MAIN, { label: "Liberar os acessos" }),
          n("e1", "end", 760, ROW_MAIN, { label: "Novo colaborador" }),
        ],
        [e("f1", "s", "sp"), e("f2", "sp", "t1"), e("f3", "t1", "e1")]
      ),
      highlightNodeIds: ["sp"],
    },
  },
  {
    id: "subprocess-expanded",
    category: "activity",
    namePt: "Subprocesso expandido",
    nameEn: "Expanded Sub-Process",
    summary:
      "Retângulo maior que mostra o próprio fluxo interno do subprocesso dentro do diagrama principal.",
    purpose: "Exibe as etapas internas sem exigir navegação para outro diagrama.",
    whenToUse:
      "Use quando o detalhe interno é importante para entender o processo e há espaço no diagrama.",
    example:
      "O subprocesso 'Faturar' aparece expandido mostrando emissão, conferência e envio da nota.",
    commonErrors: [
      "Expandir subprocessos grandes demais, poluindo o diagrama.",
      "Deixar o subprocesso expandido sem eventos de início e fim internos.",
    ],
    keywords: ["expandido", "expanded", "detalhado", "interno", "fluxo interno"],
    render: { kind: "activity", activity: "expandedSubProcess" },
    miniExample: {
      caption: "As etapas internas ficam visíveis no mesmo diagrama.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido pago" }),
          n(
            "sp",
            "expandedSubProcess",
            320,
            ROW_MAIN,
            { label: "Faturar o pedido" }
          ),
          n("e1", "end", 620, ROW_MAIN, { label: "Nota emitida" }),
        ],
        [e("f1", "s", "sp"), e("f2", "sp", "e1")]
      ),
      highlightNodeIds: ["sp"],
    },
  },
  {
    id: "call-activity",
    category: "activity",
    namePt: "Atividade de chamada",
    nameEn: "Call Activity",
    summary:
      "Retângulo de atividade com borda grossa que invoca um processo ou tarefa global reutilizável.",
    purpose: "Reutilizar um processo definido em outro local, com variáveis próprias.",
    whenToUse:
      "Use quando a mesma etapa é chamada por vários processos, como 'Emitir nota fiscal' ou 'Aprovar orçamento'.",
    example:
      "Vários processos chamam o subprocesso global 'Aprovar orçamento' com seus próprios dados de entrada.",
    commonErrors: [
      "Usar call activity para detalhe interno do mesmo processo (use subprocesso).",
      "Esquecer de mapear as entradas e saídas de dados da chamada.",
    ],
    keywords: ["chamada", "call", "reutilizar", "global", "borda grossa"],
    render: { kind: "activity", activity: "callActivity" },
    miniExample: {
      caption: "A borda grossa diferencia a chamada de um processo reutilizável.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Compra solicitada" }),
          n("ca", "callActivity", 300, ROW_MAIN, { label: "Aprovar orçamento" }),
          n("t1", "task", 540, ROW_MAIN, { label: "Registrar a compra" }),
          n("e1", "end", 760, ROW_MAIN, { label: "Compra registrada" }),
        ],
        [e("f1", "s", "ca"), e("f2", "ca", "t1"), e("f3", "t1", "e1")]
      ),
      highlightNodeIds: ["ca"],
    },
  },

  /* ================================================================ */
  /* C. GATEWAYS                                                      */
  /* ================================================================ */
  {
    id: "gateway-exclusive",
    category: "gateway",
    namePt: "Gateway exclusivo (XOR)",
    nameEn: "Exclusive Gateway",
    summary:
      "Losango com o marcador 'X': divide o fluxo em caminhos alternativos e apenas um é escolhido.",
    purpose: "Modelar decisões mutuamente exclusivas (se/então, senão).",
    whenToUse:
      "Use quando exatamente uma das saídas deve ser executada e as condições se excluem mutuamente.",
    example: "Nota fiscal aprovada? Sim: pagar. Não: devolver para correção.",
    commonErrors: [
      "Usar XOR quando todos os caminhos devem acontecer (use paralelo).",
      "Deixar saídas sem rótulo de condição em decisões divergentes.",
      "Usar XOR de junção para sincronizar fluxos paralelos (use junção paralela).",
    ],
    keywords: ["exclusivo", "XOR", "decisão", "se", "senão", "X"],
    render: { kind: "gateway", gateway: "exclusive" },
    miniExample: {
      caption: "Apenas um dos caminhos é escolhido conforme a condição.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Nota recebida" }),
          n("gw", "gateway", 280, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
          n("t1", "task", 480, ROW_TOP, { label: "Pagar a nota" }),
          n("t2", "task", 480, ROW_BOTTOM, { label: "Corrigir a nota" }),
          n("e1", "end", 700, ROW_TOP, { label: "Nota paga" }),
          n("e2", "end", 700, ROW_BOTTOM, { label: "Nota devolvida" }),
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
  },
  {
    id: "gateway-parallel",
    category: "gateway",
    namePt: "Gateway paralelo (AND)",
    nameEn: "Parallel Gateway",
    summary:
      "Losango com o marcador '+': divide o fluxo em caminhos que executam ao mesmo tempo e os sincroniza depois.",
    purpose: "Executar atividades simultaneamente e garantir que todas terminem antes de seguir.",
    whenToUse:
      "Use quando não há decisão: todas as rotas acontecem, em qualquer ordem, e o processo espera todas.",
    example:
      "Aprovada a contratação, RH e TI executam suas etapas em paralelo e só depois o processo segue.",
    commonErrors: [
      "Colocar condições em saídas de um paralelo (não há escolha a ser feita).",
      "Usar paralelo para alternativas mutuamente exclusivas.",
      "Criar junção paralela com menos ramos de entrada do que os ramos criados — o fluxo trava.",
    ],
    keywords: ["paralelo", "parallel", "AND", "simultâneo", "sincronizar", "juntar"],
    render: { kind: "gateway", gateway: "parallel" },
    miniExample: {
      caption: "Divisão e junção paralelas: ambos os ramos executam e depois sincronizam.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Contrato aprovado" }),
          n("gw1", "gateway", 260, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
          n("t1", "task", 460, ROW_TOP, { label: "Preparar o posto" }),
          n("t2", "task", 460, ROW_BOTTOM, { label: "Cadastrar no sistema" }),
          n("gw2", "gateway", 680, ROW_MAIN, { gateway: "parallel", label: "Juntar" }),
          n("e1", "end", 880, ROW_MAIN, { label: "Tudo pronto" }),
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
      highlightNodeIds: ["gw1"],
    },
  },
  {
    id: "gateway-inclusive",
    category: "gateway",
    namePt: "Gateway inclusivo (OR)",
    nameEn: "Inclusive Gateway",
    summary:
      "Losango com o marcador 'O': divide o fluxo em caminhos onde um ou mais podem ser escolhidos.",
    purpose: "Modelar decisões com condições que não se excluem mutuamente.",
    whenToUse:
      "Use quando mais de um caminho pode valer ao mesmo tempo e você precisa sincronizar todos os escolhidos.",
    example:
      "A compra precisa de aprovação do gestor E, se o valor for alto, também da diretoria.",
    commonErrors: [
      "Usar inclusivo quando apenas um caminho vale (use exclusivo).",
      "Esquecer a junção inclusiva que sincroniza apenas os ramos que realmente executaram.",
      "Confundir com paralelo: inclusivo depende de condições.",
    ],
    keywords: ["inclusivo", "inclusive", "OR", "uma ou mais", "condições"],
    render: { kind: "gateway", gateway: "inclusive" },
    miniExample: {
      caption: "Um ou mais caminhos podem ser ativados conforme as condições.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Solicitação criada" }),
          n("gw1", "gateway", 280, ROW_MAIN, { gateway: "inclusive", label: "Quem aprova?" }),
          n("t1", "task", 500, ROW_TOP, { label: "Aprovar do gestor" }),
          n("t2", "task", 500, ROW_BOTTOM, { label: "Aprovar da diretoria" }),
          n("gw2", "gateway", 720, ROW_MAIN, { gateway: "inclusive", label: "Juntar" }),
          n("e1", "end", 920, ROW_MAIN, { label: "Solicitação aprovada" }),
        ],
        [
          e("f1", "s", "gw1"),
          e("f2", "gw1", "t1", "Valor até 10 mil"),
          e("f3", "gw1", "t2", "Valor acima de 10 mil"),
          e("f4", "t1", "gw2"),
          e("f5", "t2", "gw2"),
          e("f6", "gw2", "e1"),
        ]
      ),
      highlightNodeIds: ["gw1"],
    },
  },
  {
    id: "gateway-event-based",
    category: "gateway",
    namePt: "Gateway baseado em eventos",
    nameEn: "Event-Based Gateway",
    summary:
      "Losango com círculo e pentágono interno: o caminho depende de qual evento ocorrer primeiro.",
    purpose: "Esperar uma ocorrência externa e reagir ao evento que chegar antes.",
    whenToUse:
      "Use para aguardar mensagens, respostas ou prazos alternativos, sem decidir por condição.",
    example:
      "Após enviar a proposta, o processo espera: resposta do cliente ou expiração do prazo.",
    commonErrors: [
      "Usar gateway baseado em eventos com condições de dados (use exclusivo).",
      "Conectar saídas que não sejam eventos intermediários ou tarefas de recebimento.",
      "Confundir com exclusivo: aqui a escolha é feita pelo tempo, não por regra.",
    ],
    keywords: ["eventos", "event-based", "espera", "qual acontece primeiro", "pentágono"],
    render: { kind: "gateway", gateway: "eventBased" },
    miniExample: {
      caption: "Vence o evento que chegar primeiro: resposta do cliente ou fim do prazo.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Proposta enviada" }),
          n("gw", "gateway", 280, ROW_MAIN, { gateway: "eventBased", label: "Esperar" }),
          n("i1", "intermediate", 500, ROW_TOP, { label: "Resposta recebida", marker: "message" }),
          n("i2", "intermediate", 500, ROW_BOTTOM, { label: "Prazo expirado", marker: "timer" }),
          n("t1", "task", 720, ROW_TOP, { label: "Registrar a resposta" }),
          n("e1", "end", 940, ROW_TOP, { label: "Resposta tratada" }),
          n("e2", "end", 720, ROW_BOTTOM, { label: "Encerrar sem resposta" }),
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
  },
  {
    id: "gateway-complex",
    category: "gateway",
    namePt: "Gateway complexo",
    nameEn: "Complex Gateway",
    summary:
      "Losango com asterisco: aplica uma regra de sincronização que não cabe nos gateways padrão.",
    purpose: "Expressar combinações como 'esperar 2 dos 3 ramos' ou comportamento definido pelo modelador.",
    whenToUse:
      "Use apenas quando XOR, AND, OR e baseado em eventos não descrevem a regra necessária.",
    example: "O processo segue quando dois de três departamentos respondem — a terceira resposta não bloqueia.",
    commonErrors: [
      "Usar complexo por conveniência em vez de um gateway padrão.",
      "Não documentar a regra de sincronização, tornando o diagrama ambíguo.",
      "Usar complexo em diagramas para audiências que não conhecem a notação.",
    ],
    keywords: ["complexo", "complex", "asterisco", "regra própria", "sincronização"],
    render: { kind: "gateway", gateway: "complex" },
    miniExample: {
      caption: "O asterisco indica uma regra de sincronização definida pelo modelador.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Consulta aberta" }),
          n("gw1", "gateway", 280, ROW_MAIN, { gateway: "parallel", label: "Consultar" }),
          n("t1", "task", 480, ROW_TOP, { label: "Área A responde" }),
          n("t2", "task", 480, ROW_BOTTOM, { label: "Área B responde" }),
          n("gw2", "gateway", 700, ROW_MAIN, { gateway: "complex", label: "2 de 3 respostas" }),
          n("e1", "end", 900, ROW_MAIN, { label: "Parecer emitido" }),
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
      highlightNodeIds: ["gw2"],
    },
  },

  /* ================================================================ */
  /* D. OBJETOS DE CONEXÃO                                            */
  /* ================================================================ */
  {
    id: "flow-sequence",
    category: "connection",
    namePt: "Fluxo de sequência",
    nameEn: "Sequence Flow",
    summary:
      "Linha contínua com seta preenchida que indica a ordem de execução entre elementos do mesmo processo.",
    purpose: "Define a ordem em que atividades, eventos e gateways são executados.",
    whenToUse:
      "Use sempre dentro de uma mesma pool. É o elemento de conexão mais usado em qualquer diagrama.",
    example: "Conecta 'Revisar pedido' → 'Separar itens' → 'Enviar ao cliente'.",
    commonErrors: [
      "Usar fluxo de sequência entre pools diferentes (obrigatório usar fluxo de mensagem).",
      "Deixar conexões cruzadas que dificultam a leitura do diagrama.",
      "Conectar eventos de fim a outras etapas.",
    ],
    keywords: ["sequência", "sequence", "fluxo", "seta", "ordem"],
    render: { kind: "connection", connection: "sequence" },
    miniExample: {
      caption: "A seta preenchida mostra a ordem das etapas dentro de uma pool.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Conferir o pedido" }),
          n("t2", "task", 480, ROW_MAIN, { label: "Separar os itens" }),
          n("e1", "end", 680, ROW_MAIN, { label: "Pedido pronto" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
      ),
      highlightNodeIds: ["t1"],
    },
  },
  {
    id: "flow-message",
    category: "connection",
    namePt: "Fluxo de mensagem",
    nameEn: "Message Flow",
    summary:
      "Linha tracejada com seta aberta que representa comunicação entre pools diferentes (participantes distintos).",
    purpose: "Mostra o que troca de comunicação entre processos ou organizações.",
    whenToUse:
      "Use somente entre elementos de pools distintas. Dentro de uma pool, use fluxo de sequência.",
    example: "O cliente envia um pedido ao processo de vendas da loja.",
    commonErrors: [
      "Usar fluxo de mensagem dentro da mesma pool.",
      "Usar fluxo de sequência entre pools (é proibido pela notação).",
      "Conectar fluxo de mensagem a gateways (a comunicação se dá entre participantes).",
    ],
    keywords: ["mensagem", "message", "tracejado", "comunicação", "entre pools"],
    render: { kind: "connection", connection: "message" },
    miniExample: {
      caption: "A linha tracejada liga participantes de pools diferentes.",
      diagram: d(
        [
          box("p1", "pool", 40, 20, 760, 130, { poolName: "Cliente" }),
          box("p2", "pool", 40, 170, 760, 130, { poolName: "Loja" }),
          n("s", "start", 130, 90, { label: "Cliente decide comprar" }, { poolId: "p1" }),
          n("t1", "task", 400, 90, { label: "Enviar o pedido", taskType: "send" }, { poolId: "p1" }),
          n("t2", "task", 300, 240, { label: "Receber o pedido", taskType: "receive" }, { poolId: "p2" }),
          n("e1", "end", 560, 240, { label: "Pedido registrado" }, { poolId: "p2" }),
        ],
        [
          e("f1", "s", "t1"),
          e("m1", "t1", "t2", undefined, "message"),
          e("f2", "t2", "e1"),
        ]
      ),
      highlightNodeIds: ["t1", "t2"],
    },
  },
  {
    id: "flow-association",
    category: "connection",
    namePt: "Associação",
    nameEn: "Association",
    summary:
      "Linha pontilhada sem seta que liga artefatos (anotações, dados, grupos) aos elementos do fluxo.",
    purpose: "Vincular informação de apoio a uma atividade sem criar dependência de execução.",
    whenToUse:
      "Use para conectar anotações de texto, objetos de dados e grupos às etapas a que se referem.",
    example: "Uma anotação 'Conferir se o CPF está válido' associada à tarefa de validação.",
    commonErrors: [
      "Usar associação como se fosse fluxo de sequência (ela não ordena execução).",
      "Usar associação para ligar duas atividades entre si.",
    ],
    keywords: ["associação", "association", "pontilhado", "anotação", "vínculo"],
    render: { kind: "connection", connection: "association" },
    miniExample: {
      caption: "A linha pontilhada liga uma anotação à atividade correspondente.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Cadastro enviado" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Validar o cadastro" }),
          n("a1", "annotation", 240, 240, { label: "Conferir CPF e data de nascimento" }),
          n("e1", "end", 560, ROW_MAIN, { label: "Cadastro válido" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "e1"),
          e("a", "a1", "t1", undefined, "association"),
        ]
      ),
      highlightNodeIds: ["a1"],
    },
  },

  /* ================================================================ */
  /* E. RAIAS E PARTICIPANTES                                         */
  /* ================================================================ */
  {
    id: "pool",
    category: "structure",
    namePt: "Pool",
    nameEn: "Pool",
    summary:
      "Grande retângulo que representa uma organização ou processo completo, contendo as raias (lanes) internas.",
    purpose: "Delimita a fronteira do processo e separa participantes distintos.",
    whenToUse:
      "Use em diagramas de colaboração, quando mais de um processo ou organização participam da troca.",
    example: "Uma pool 'Loja' e outra pool 'Transportadora' conectadas por fluxos de mensagem.",
    commonErrors: [
      "Usar fluxo de sequência entre pools.",
      "Criar pools sem identificar o participante responsável.",
      "Colocar mais de um processo independente na mesma pool.",
    ],
    keywords: ["pool", "organização", "participante", "fronteira", "colaboração"],
    render: { kind: "structure", structure: "pool" },
    miniExample: {
      caption: "A pool define a fronteira do processo e abriga suas raias.",
      diagram: d(
        [
          box("p1", "pool", 40, 20, 820, 240, { poolName: "Processo de Compra" }),
          n("s", "start", 130, 90, { label: "Necessidade detectada" }, { poolId: "p1" }),
          n("t1", "task", 340, 90, { label: "Elaborar a requisição" }, { poolId: "p1" }),
          n("gw", "gateway", 560, 90, { gateway: "exclusive", label: "Aprovada?" }, { poolId: "p1" }),
          n("t2", "task", 740, 90, { label: "Efetuar a compra" }, { poolId: "p1" }),
          n("e1", "end", 740, 200, { label: "Compra concluída" }, { poolId: "p1" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "gw"),
          e("f3", "gw", "t2", "Sim"),
          e("f4", "t2", "e1"),
        ]
      ),
      highlightNodeIds: ["p1"],
    },
  },
  {
    id: "lane",
    category: "structure",
    namePt: "Raia (Lane)",
    nameEn: "Lane",
    summary:
      "Faixa horizontal dentro de uma pool que agrupa atividades por responsável, departamento ou função.",
    purpose: "Mostrar quem é responsável por cada etapa do processo.",
    whenToUse:
      "Use quando é importante enxergar a divisão de responsabilidades, como Departamento A x Departamento B.",
    example:
      "Raias 'Comercial', 'Financeiro' e 'Logística' dividindo as tarefas do processo de venda.",
    commonErrors: [
      "Usar lane como se fosse pool (lane sempre está dentro de uma pool).",
      "Cruzar fluxos de sequência entre raias diferentes — é permitido, mas mantenha a leitura limpa.",
      "Criar raias que não agregam informação de responsabilidade.",
    ],
    keywords: ["raia", "lane", "swimlane", "departamento", "responsável", "faixa"],
    render: { kind: "structure", structure: "lane" },
    miniExample: {
      caption: "Cada raia reúne as etapas de um responsável.",
      diagram: d(
        [
          box("p1", "pool", 40, 10, 840, 270, { poolName: "Atendimento" }),
          box("l1", "lane", 74, 40, 786, 110, { laneName: "Atendente" }, { poolId: "p1" }),
          box("l2", "lane", 74, 155, 786, 110, { laneName: "Supervisor" }, { poolId: "p1" }),
          n("s", "start", 140, 95, { label: "Chamada recebida" }, { poolId: "p1", laneId: "l1" }),
          n("t1", "task", 340, 95, { label: "Atender o cliente" }, { poolId: "p1", laneId: "l1" }),
          n("gw", "gateway", 560, 95, { gateway: "exclusive", label: "Resolvido?" }, { poolId: "p1", laneId: "l1" }),
          n("t2", "task", 760, 210, { label: "Revisar o caso" }, { poolId: "p1", laneId: "l2" }),
          n("e1", "end", 340, 210, { label: "Chamada encerrada" }, { poolId: "p1", laneId: "l2" }),
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
  },
  {
    id: "participant",
    category: "structure",
    namePt: "Participante",
    nameEn: "Participant",
    summary:
      "Nome da organização ou papel representado pela pool; pode ser uma pool com processo ou uma pool em caixa-preta.",
    purpose: "Identificar quem participa da colaboração, mesmo sem detalhar seu processo.",
    whenToUse:
      "Use na barra lateral da pool. Use caixa-preta quando o processo do outro participante não é relevante.",
    example: "A pool 'Cliente' aparece em caixa-preta, apenas enviando e recebendo mensagens.",
    commonErrors: [
      "Deixar a pool sem nome de participante.",
      "Detalhar o processo de um participante externo sem necessidade.",
    ],
    keywords: ["participante", "black box", "organização", "cliente", "nome"],
    render: { kind: "structure", structure: "participant" },
    miniExample: {
      caption: "O participante 'Cliente' aparece em caixa-preta: só troca mensagens.",
      diagram: d(
        [
          box("p1", "pool", 40, 20, 780, 120, { poolName: "Cliente (caixa-preta)" }),
          box("p2", "pool", 40, 160, 780, 140, { poolName: "Processo de Vendas" }),
          n("t1", "task", 300, 85, { label: "Solicitar orçamento", taskType: "send" }, { poolId: "p1" }),
          n("s", "start", 140, 235, { label: "Orçamento solicitado" }, { poolId: "p2" }),
          n("t2", "task", 360, 235, { label: "Preparar a proposta" }, { poolId: "p2" }),
          n("e1", "end", 620, 235, { label: "Proposta enviada" }, { poolId: "p2" }),
        ],
        [
          e("m1", "t1", "s", undefined, "message"),
          e("f1", "s", "t2"),
          e("f2", "t2", "e1"),
        ]
      ),
      highlightNodeIds: ["p1"],
    },
  },
  {
    id: "milestone",
    category: "structure",
    namePt: "Marco (Milestone)",
    nameEn: "Milestone",
    summary:
      "Ponto relevante do cronograma. Atenção: o BPMN 2.0 não define um símbolo próprio para marcos no núcleo da notação.",
    purpose: "Marcar conclusões importantes do processo, como entregas e aprovações finais.",
    whenToUse:
      "Na prática, represente marcos com um evento de fim, um evento intermediário com rótulo ou uma anotação de texto. Use o símbolo convencional abaixo apenas quando a ferramenta da equipe adotá-lo.",
    example: "Marco 'Contrato assinado' entre a aprovação e o início da execução.",
    commonErrors: [
      "Inventar símbolos que a equipe não reconhece — prefira a notação oficial.",
      "Tratar marco como atividade que executa trabalho (marco não tem duração).",
    ],
    keywords: ["marco", "milestone", "entrega", "cronograma", "hito"],
    render: { kind: "structure", structure: "milestone" },
    miniExample: {
      caption: "Na notação oficial, o marco é representado por um evento rotulado.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Projeto iniciado" }),
          n("t1", "task", 280, ROW_MAIN, { label: "Executar a implantação" }),
          n("m1", "intermediate", 500, ROW_MAIN, { label: "Contrato assinado" }),
          n("t2", "task", 720, ROW_MAIN, { label: "Iniciar a operação" }),
          n("e1", "end", 940, ROW_MAIN, { label: "Projeto entregue" }),
        ],
        [e("f1", "s", "t1"), e("f2", "t1", "m1"), e("f3", "m1", "t2"), e("f4", "t2", "e1")]
      ),
      highlightNodeIds: ["m1"],
    },
  },

  /* ================================================================ */
  /* F. ARTEFATOS                                                     */
  /* ================================================================ */
  {
    id: "artifact-data-object",
    category: "artifact",
    namePt: "Objeto de dados",
    nameEn: "Data Object",
    summary:
      "Retângulo com a dobra no canto superior direito que representa informação usada ou produzida pelo processo.",
    purpose: "Mostrar quais dados entram e saem das atividades, sem alterar o fluxo.",
    whenToUse:
      "Use para ligar documentos e registros às tarefas que os criam ou consomem.",
    example: "O objeto 'Nota fiscal' associado à tarefa 'Emitir nota'.",
    commonErrors: [
      "Usar objeto de dados como se fosse uma atividade que processa algo.",
      "Ligar objeto de dados com fluxo de sequência (use associação).",
      "Confundir com armazenamento de dados (que é persistente).",
    ],
    keywords: ["dados", "documento", "nota", "objeto", "informação"],
    render: { kind: "artifact", artifact: "dataObject" },
    miniExample: {
      caption: "O objeto de dados fica ligado à atividade por associação.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Venda concluída" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Emitir a nota fiscal", taskType: "service" }),
          n("d1", "dataObject", 300, 240, { label: "Nota fiscal" }),
          n("e1", "end", 560, ROW_MAIN, { label: "Venda faturada" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "e1"),
          e("a", "d1", "t1", undefined, "association"),
        ]
      ),
      highlightNodeIds: ["d1"],
    },
  },
  {
    id: "artifact-data-store",
    category: "artifact",
    namePt: "Armazenamento de dados",
    nameEn: "Data Store",
    summary:
      "Cilindro que representa um banco de arquivo ou repositório persistente que sobrevive ao processo.",
    purpose: "Indicar onde dados são armazenados e recuperados pelo processo.",
    whenToUse:
      "Use para bases de dados, arquivos compartilhados, ERPs e repositórios consultados por várias atividades.",
    example: "A base de clientes consultada na tarefa 'Validar o cadastro'.",
    commonErrors: [
      "Usar armazenamento para dados que existem apenas durante o processo (use objeto de dados).",
      "Conectar armazenamento com fluxo de sequência (use associação).",
    ],
    keywords: ["banco", "data store", "repositório", "persistência", "arquivo"],
    render: { kind: "artifact", artifact: "dataStore" },
    miniExample: {
      caption: "O cilindro representa a base consultada pelas atividades.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Consulta solicitada" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Consultar o cadastro", taskType: "service" }),
          n("ds", "dataStore", 300, 245, {}),
          n("e1", "end", 560, ROW_MAIN, { label: "Dados apresentados" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "e1"),
          e("a", "ds", "t1", undefined, "association"),
        ]
      ),
      highlightNodeIds: ["ds"],
    },
  },
  {
    id: "artifact-group",
    category: "artifact",
    namePt: "Grupo",
    nameEn: "Group",
    summary:
      "Retângulo de borda tracejada que agrupa elementos por categoria sem alterar o comportamento do fluxo.",
    purpose: "Organizar visualmente partes do processo por fase, fase de projeto ou critério analítico.",
    whenToUse:
      "Use para destacar blocos como 'Fase 1', 'Controles internos' ou 'Etapa de aprovação'.",
    example: "Agrupar todas as etapas de compliance em um bloco tracejado.",
    commonErrors: [
      "Achar que o grupo altera a execução — ele é apenas visual.",
      "Agrupar elementos que não têm critério comum.",
    ],
    keywords: ["grupo", "group", "fase", "agrupar", "tracejado"],
    render: { kind: "artifact", artifact: "group" },
    miniExample: {
      caption: "O grupo organiza etapas por fase sem mudar a execução.",
      diagram: d(
        [
          box("g1", "group", 190, 60, 480, 180, { label: "Fase de aprovação" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Revisar a solicitação" }),
          n("gw", "gateway", 520, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
          n("e1", "end", 780, ROW_MAIN, { label: "Solicitação aprovada" }),
        ],
        [e("f1", "t1", "gw"), e("f2", "gw", "e1", "Sim")]
      ),
      highlightNodeIds: ["g1"],
    },
  },
  {
    id: "artifact-text-annotation",
    category: "artifact",
    namePt: "Anotação de texto",
    nameEn: "Text Annotation",
    summary:
      "Colchete aberto com texto livre usado para explicar ou comentar um elemento do diagrama.",
    purpose: "Documentar regras, exceções e observações sem poluir os rótulos do fluxo.",
    whenToUse:
      "Use quando o detalhe é necessário para leitura mas não deve virar uma atividade ou condição.",
    example: "'Prazo de 2 dias úteis' anotado ao lado do evento de temporizador.",
    commonErrors: [
      "Transformar a anotação em parte do fluxo (ela não executa nem condiciona).",
      "Usar anotação para o que deveria ser rótulo de condição de um gateway.",
    ],
    keywords: ["anotação", "nota", "comentário", "texto", "observação"],
    render: { kind: "artifact", artifact: "textAnnotation" },
    miniExample: {
      caption: "A anotação explica a regra sem alterar o fluxo.",
      diagram: d(
        [
          n("s", "start", 80, ROW_MAIN, { label: "Cobrança emitida" }),
          n("t1", "task", 300, ROW_MAIN, { label: "Aguardar o pagamento" }),
          n("a1", "annotation", 300, 245, { label: "Prazo de 5 dias úteis" }),
          n("e1", "end", 560, ROW_MAIN, { label: "Pagamento confirmado" }),
        ],
        [
          e("f1", "s", "t1"),
          e("f2", "t1", "e1"),
          e("a", "a1", "t1", undefined, "association"),
        ]
      ),
      highlightNodeIds: ["a1"],
    },
  },
];

