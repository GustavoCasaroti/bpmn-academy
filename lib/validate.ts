import type {
  BpmnDiagram,
  BpmnEdge,
  BpmnNode,
  NodeKind,
  ValidationIssue,
  ValidationResult,
} from "@/types";

/**
 * Motor de validação de diagramas BPMN.
 * Regras baseadas na notação BPMN 2.0 — independente da interface gráfica.
 */

export interface ValidateOptions {
  /** IDs de símbolos que precisam aparecer no diagrama. */
  requiredSymbols?: string[];
  minTasks?: number;
  minEndEvents?: number;
  /** Exige ao menos um gateway divergente com condições rotuladas. */
  requireDecision?: boolean;
}

const FLOW_KINDS: NodeKind[] = [
  "start",
  "intermediate",
  "end",
  "task",
  "subProcess",
  "expandedSubProcess",
  "callActivity",
  "gateway",
];

const ACTIVITY_KINDS: NodeKind[] = [
  "task",
  "subProcess",
  "expandedSubProcess",
  "callActivity",
];

const CONTAINER_KINDS: NodeKind[] = ["pool", "lane", "group"];

function isFlowNode(node: BpmnNode): boolean {
  return FLOW_KINDS.includes(node.kind);
}

function isActivity(node: BpmnNode): boolean {
  return ACTIVITY_KINDS.includes(node.kind);
}

/* ------------------------------------------------------------------ */
/* Inventário de símbolos do diagrama                                  */
/* ------------------------------------------------------------------ */

const MARKER_SUFFIX: Record<string, string> = {
  message: "-message",
  timer: "-timer",
  error: "-error",
  escalation: "-escalation",
  signal: "-signal",
  cancel: "-cancel",
  terminate: "-terminate",
  conditional: "",
  link: "",
  compensation: "",
  multiple: "",
  parallelMultiple: "",
};

const TASK_SUFFIX: Record<string, string> = {
  user: "-user",
  service: "-service",
  manual: "-manual",
  send: "-send",
  receive: "-receive",
  script: "-script",
  businessRule: "-business-rule",
};

const GATEWAY_SUFFIX: Record<string, string> = {
  exclusive: "-exclusive",
  parallel: "-parallel",
  inclusive: "-inclusive",
  eventBased: "-event-based",
  complex: "-complex",
};

/** Lista os IDs de símbolo BPMN presentes em um diagrama. */
export function diagramSymbolIds(diagram: BpmnDiagram): string[] {
  const ids = new Set<string>();

  for (const node of diagram.nodes) {
    switch (node.kind) {
      case "start":
        ids.add(`event-start${MARKER_SUFFIX[node.data.marker ?? "none"] ?? ""}`);
        break;
      case "intermediate":
        ids.add(
          `event-intermediate${MARKER_SUFFIX[node.data.marker ?? "none"] ?? ""}`
        );
        break;
      case "end":
        ids.add(`event-end${MARKER_SUFFIX[node.data.marker ?? "none"] ?? ""}`);
        break;
      case "task":
        ids.add(`task${TASK_SUFFIX[node.data.taskType ?? "none"] ?? ""}`);
        break;
      case "subProcess":
        ids.add("subprocess");
        break;
      case "expandedSubProcess":
        ids.add("subprocess-expanded");
        break;
      case "callActivity":
        ids.add("call-activity");
        break;
      case "gateway":
        ids.add(`gateway${GATEWAY_SUFFIX[node.data.gateway ?? "exclusive"] ?? "-exclusive"}`);
        break;
      case "pool":
        ids.add("pool");
        break;
      case "lane":
        ids.add("lane");
        break;
      case "dataObject":
        ids.add("artifact-data-object");
        break;
      case "dataStore":
        ids.add("artifact-data-store");
        break;
      case "group":
        ids.add("artifact-group");
        break;
      case "annotation":
        ids.add("artifact-text-annotation");
        break;
      default:
        break;
    }
  }

  for (const edge of diagram.edges) {
    if (edge.type === "sequence") ids.add("flow-sequence");
    else if (edge.type === "message") ids.add("flow-message");
    else ids.add("flow-association");
  }

  return [...ids];
}

/* ------------------------------------------------------------------ */
/* Validação                                                           */
/* ------------------------------------------------------------------ */

export function validateDiagram(
  diagram: BpmnDiagram,
  options: ValidateOptions = {}
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const nodes = diagram.nodes;
  const edges = diagram.edges;
  const flowNodes = nodes.filter(isFlowNode);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  const push = (issue: ValidationIssue) => issues.push(issue);

  if (nodes.length === 0) {
    push({
      code: "empty-diagram",
      severity: "error",
      title: "Diagrama vazio",
      detail: "Nenhum elemento foi adicionado à área de construção.",
      hint: "Comece arrastando um evento de início e adicione as etapas do processo.",
      nodeIds: [],
    });
    return { valid: false, score: 0, issues };
  }

  const starts = flowNodes.filter((n) => n.kind === "start");
  const ends = flowNodes.filter((n) => n.kind === "end");

  /* ---------------- eventos de início e fim ---------------- */
  if (starts.length === 0) {
    push({
      code: "no-start",
      severity: "error",
      title: "Falta o evento de início",
      detail:
        "Todo processo precisa de exatamente um evento de início para indicar onde o fluxo começa.",
      hint: "Arraste um círculo de borda fina (evento de início) para a área e conecte-o à primeira etapa.",
      nodeIds: [],
    });
  } else if (starts.length > 1) {
    push({
      code: "multiple-starts",
      severity: "error",
      title: "Mais de um evento de início",
      detail: `Foram encontrados ${starts.length} eventos de início. Um processo simples deve ter apenas um.`,
      hint: "Mantenha um único início e remova ou converta os demais em eventos intermediários.",
      nodeIds: starts.map((n) => n.id),
    });
  }

  if (ends.length === 0) {
    push({
      code: "no-end",
      severity: "error",
      title: "Falta o evento de fim",
      detail:
        "O processo não tem nenhum evento de fim, ou seja, não há resultado definido.",
      hint: "Adicione ao menos um evento de fim com borda grossa e conecte-o ao último fluxo.",
      nodeIds: [],
    });
  }

  for (const start of starts) {
    if (!edges.some((e) => e.source === start.id)) {
      push({
        code: "start-without-outgoing",
        severity: "error",
        title: "Evento de início sem saída",
        detail: `O evento de início "${start.data.label ?? start.id}" não possui fluxo de saída.`,
        hint: "Conecte o início à primeira atividade do processo.",
        nodeIds: [start.id],
      });
    }
  }

  for (const end of ends) {
    const outgoing = edges.filter((e) => e.source === end.id);
    if (!edges.some((e) => e.target === end.id)) {
      push({
        code: "end-without-incoming",
        severity: "error",
        title: "Evento de fim sem entrada",
        detail: `O evento de fim "${end.data.label ?? end.id}" não recebe nenhum fluxo.`,
        hint: "Conecte a última etapa até este evento de fim.",
        nodeIds: [end.id],
      });
    }
    if (outgoing.length > 0) {
      push({
        code: "end-with-outgoing",
        severity: "error",
        title: "Evento de fim com saída",
        detail: "Eventos de fim encerram o fluxo e não podem ter fluxos de saída.",
        hint: "Remova o fluxo saindo do evento de fim ou substitua-o por um evento intermediário.",
        nodeIds: [end.id],
      });
    }
  }

  /* ---------------- atividades ---------------- */
  for (const node of flowNodes) {
    const incoming = edges.filter((e) => e.target === node.id);
    const outgoing = edges.filter((e) => e.source === node.id);

    if (
      node.kind !== "start" &&
      incoming.length === 0 &&
      outgoing.length === 0
    ) {
      push({
        code: "isolated-node",
        severity: "error",
        title: "Elemento desconectado",
        detail: `O elemento "${node.data.label ?? node.id}" não está ligado a nenhum outro.`,
        hint: "Conecte-o ao fluxo ou remova-o do diagrama.",
        nodeIds: [node.id],
      });
      continue;
    }

    if (isActivity(node)) {
      if (incoming.length === 0 && node.kind !== "start") {
        push({
          code: "task-without-incoming",
          severity: "error",
          title: "Atividade sem fluxo de entrada",
          detail: `A atividade "${node.data.label ?? node.id}" não é alcançada por nenhum fluxo.`,
          hint: "Conecte a etapa anterior até ela.",
          nodeIds: [node.id],
        });
      }
      if (outgoing.length === 0) {
        push({
          code: "task-without-outgoing",
          severity: "error",
          title: "Atividade sem fluxo de saída",
          detail: `A atividade "${node.data.label ?? node.id}" não leva a lugar nenhum.`,
          hint: "Conecte-a à próxima etapa ou a um evento de fim.",
          nodeIds: [node.id],
        });
      }
      if (outgoing.length > 2 && node.kind === "task") {
        push({
          code: "task-as-decision",
          severity: "warning",
          title: "Tarefa usada como decisão",
          detail: `A tarefa "${node.data.label ?? node.id}" tem ${outgoing.length} saídas diretas.`,
          hint: "Insira um gateway de decisão após a tarefa para separar os caminhos.",
          nodeIds: [node.id],
        });
      }
    }

    /* ---------------- gateways ---------------- */
    if (node.kind === "gateway") {
      if (incoming.length === 0) {
        push({
          code: "gateway-without-incoming",
          severity: "error",
          title: "Gateway sem entrada",
          detail: `O gateway "${node.data.label ?? node.id}" não recebe nenhum fluxo.`,
          hint: "Conecte a etapa anterior ao gateway.",
          nodeIds: [node.id],
        });
      }

      if (outgoing.length < 2) {
        push({
          code: "gateway-single-path",
          severity: "error",
          title: "Gateway com um único caminho",
          detail: `O gateway "${node.data.label ?? node.id}" tem apenas ${outgoing.length} saída; gateways devem dividir ou juntar fluxos.`,
          hint: "Adicione ao menos uma segunda saída ou substitua o gateway por uma conexão direta.",
          nodeIds: [node.id],
        });
      }

      const type = node.data.gateway ?? "exclusive";
      const diverging = outgoing.length >= 2;
      const unlabeled = outgoing.filter((e) => !e.label || !e.label.trim());

      if (diverging && (type === "exclusive" || type === "inclusive")) {
        if (unlabeled.length > 0) {
          push({
            code:
              type === "exclusive"
                ? "exclusive-without-decision-labels"
                : "gateway-without-labels",
            severity: "error",
            title: "Saídas do gateway sem condição",
            detail: `O gateway ${type === "exclusive" ? "exclusivo" : "inclusivo"} "${node.data.label ?? node.id}" tem ${unlabeled.length} saída(s) sem rótulo de condição.`,
            hint: "Rotule cada saída com a condição que a ativa (ex.: 'Sim', 'Não', 'Valor acima de 10 mil').",
            nodeIds: [node.id],
          });
        }
      }

      if (type === "parallel" && diverging && unlabeled.length < outgoing.length) {
        push({
          code: "parallel-with-decision",
          severity: "warning",
          title: "Gateway paralelo com condições",
          detail:
            "O gateway paralelo não avalia condições: todos os caminhos são executados.",
          hint: "Remova os rótulos de condição ou troque o gateway por um exclusivo, se houver escolha.",
          nodeIds: [node.id],
        });
      }

      if (type === "eventBased") {
        const invalid = outgoing.filter((e) => {
          const target = nodeById.get(e.target);
          if (!target) return true;
          return !(
            target.kind === "intermediate" ||
            target.kind === "task" ||
            target.kind === "end"
          );
        });
        if (invalid.length > 0) {
          push({
            code: "gateway-without-labels",
            severity: "warning",
            title: "Saídas incomuns no gateway de eventos",
            detail:
              "As saídas de um gateway baseado em eventos devem apontar para eventos intermediários (mensagem, temporizador etc.).",
            hint: "Insira eventos intermediários após o gateway antes das atividades.",
            nodeIds: [node.id],
          });
        }
      }
    }
  }

  /* ---------------- conexões ---------------- */
  for (const edge of edges) {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);

    if (!source || !target) {
      push({
        code: "orphan-message-flow",
        severity: "error",
        title: "Conexão apontando para elemento inexistente",
        detail: `A conexão "${edge.id}" referencia um elemento que não existe.`,
        hint: "Remova a conexão inválida e ligue os elementos corretos.",
        nodeIds: [edge.source, edge.target].filter((id) => nodeById.has(id)),
      });
      continue;
    }

    if (edge.source === edge.target) {
      push({
        code: "message-flow-to-self",
        severity: "error",
        title: "Conexão para o próprio elemento",
        detail: `A conexão "${edge.id}" liga o elemento a ele mesmo.`,
        hint: "Remova a conexão ou aponte-a para outro elemento.",
        nodeIds: [edge.source],
      });
      continue;
    }

    if (edge.type === "sequence") {
      const samePool = (source.poolId ?? null) === (target.poolId ?? null);
      if (!samePool) {
        push({
          code: "sequence-between-pools",
          severity: "error",
          title: "Fluxo de sequência entre pools",
          detail: `A conexão de sequência liga "${source.data.label ?? source.id}" a "${target.data.label ?? target.id}", que pertencem a pools diferentes.`,
          hint: "Fluxo de sequência só existe dentro da mesma pool. Entre pools, use fluxo de mensagem.",
          nodeIds: [source.id, target.id],
        });
      }
    }

    if (edge.type === "message") {
      const samePool =
        source.poolId != null &&
        target.poolId != null &&
        source.poolId === target.poolId;
      if (samePool) {
        push({
          code: "orphan-message-flow",
          severity: "warning",
          title: "Fluxo de mensagem dentro da mesma pool",
          detail:
            "Fluxos de mensagem comunicam participantes diferentes; dentro de uma pool use fluxo de sequência.",
          hint: "Troque para fluxo de sequência ou mova um dos elementos para outra pool.",
          nodeIds: [source.id, target.id],
        });
      }
    }

    if (
      edge.type === "association" &&
      isFlowNode(source) &&
      isFlowNode(target) &&
      CONTAINER_KINDS.includes(source.kind) === false
    ) {
      // Associação entre dois elementos de fluxo é um erro comum.
      if (isFlowNode(target) && source.kind !== "annotation" && source.kind !== "group") {
        const bothFlow =
          (isActivity(source) || source.kind === "gateway") &&
          (isActivity(target) || target.kind === "gateway");
        if (bothFlow) {
          push({
            code: "task-as-decision",
            severity: "warning",
            title: "Associação entre elementos de fluxo",
            detail:
              "Associações ligam artefatos (anotações, dados) a etapas, não duas etapas entre si.",
            hint: "Substitua por fluxo de sequência ou remova a associação.",
            nodeIds: [source.id, target.id],
          });
        }
      }
    }
  }

  /* ---------------- alcançabilidade ---------------- */
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.type === "association") continue;
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const reachable = new Set<string>();
  const stack = starts.map((s) => s.id);
  while (stack.length) {
    const id = stack.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const next of adjacency.get(id) ?? []) stack.push(next);
  }

  const unreachable = flowNodes.filter(
    (n) => !reachable.has(n.id) && n.kind !== "start" && starts.length > 0
  );
  if (unreachable.length > 0 && starts.length > 0) {
    push({
      code: "disconnected-path",
      severity: "error",
      title: "Caminho sem continuidade",
      detail: `${unreachable.length} elemento(s) não são alcançáveis a partir do evento de início: ${unreachable
        .slice(0, 4)
        .map((n) => `"${n.data.label ?? n.id}"`)
        .join(", ")}.`,
      hint: "Conecte esses elementos ao fluxo principal ou remova-os.",
      nodeIds: unreachable.map((n) => n.id),
    });
  }

  // Elementos alcançáveis que não chegam a nenhum fim
  if (ends.length > 0) {
    const reverse = new Map<string, string[]>();
    for (const edge of edges) {
      if (edge.type === "association") continue;
      const list = reverse.get(edge.target) ?? [];
      list.push(edge.source);
      reverse.set(edge.target, list);
    }
    const canReachEnd = new Set<string>();
    const back = ends.map((e) => e.id);
    while (back.length) {
      const id = back.pop()!;
      if (canReachEnd.has(id)) continue;
      canReachEnd.add(id);
      for (const prev of reverse.get(id) ?? []) back.push(prev);
    }
    const deadEnds = flowNodes.filter(
      (n) => reachable.has(n.id) && !canReachEnd.has(n.id)
    );
    if (deadEnds.length > 0) {
      push({
        code: "disconnected-path",
        severity: "error",
        title: "Caminho sem saída para o fim",
        detail: `${deadEnds.length} elemento(s) são alcançados, mas não levam a nenhum evento de fim: ${deadEnds
          .slice(0, 4)
          .map((n) => `"${n.data.label ?? n.id}"`)
          .join(", ")}.`,
        hint: "Conecte o fim dessas rotas a um evento de fim.",
        nodeIds: deadEnds.map((n) => n.id),
      });
    }
  }

  // Retorno indevido ao evento de início
  if (starts.length > 0) {
    const backToStart = edges.filter((e) =>
      starts.some((s) => s.id === e.target)
    );
    if (backToStart.length > 0) {
      push({
        code: "cycle-back-to-start",
        severity: "error",
        title: "Fluxo retornando ao início",
        detail: "Não é possível voltar ao evento de início com um fluxo de sequência.",
        hint: "Use um loop para uma atividade específica ou crie um evento intermediário de retorno.",
        nodeIds: backToStart.map((e) => e.source),
      });
    }
  }

  /* ---------------- requisitos do desafio ---------------- */
  if (options.requiredSymbols && options.requiredSymbols.length > 0) {
    const present = new Set(diagramSymbolIds(diagram));
    const missing = options.requiredSymbols.filter((id) => !present.has(id));
    if (missing.length > 0) {
      push({
        code: "missing-required-symbol",
        severity: "error",
        title: "Símbolos obrigatórios ausentes",
        detail: `Faltam ${missing.length} símbolo(s) exigido(s): ${missing.join(", ")}.`,
        hint: "Verifique a paleta de símbolos e adicione os elementos que faltam ao processo.",
        nodeIds: [],
      });
    }
  }

  if (options.minTasks && options.minTasks > 0) {
    const count = flowNodes.filter(isActivity).length;
    if (count < options.minTasks) {
      push({
        code: "missing-required-symbol",
        severity: "error",
        title: "Poucas atividades no processo",
        detail: `O processo tem ${count} atividade(s), mas o desafio exige ao menos ${options.minTasks}.`,
        hint: "Revise a situação-problema e identifique as etapas que faltaram.",
        nodeIds: [],
      });
    }
  }

  if (options.minEndEvents && options.minEndEvents > 0) {
    if (ends.length < options.minEndEvents) {
      push({
        code: "no-end",
        severity: "error",
        title: "Poucos eventos de fim",
        detail: `O processo tem ${ends.length} evento(s) de fim, mas o desafio exige ao menos ${options.minEndEvents}.`,
        hint: "Cada desfecho possível do processo deve terminar em um evento de fim.",
        nodeIds: ends.map((n) => n.id),
      });
    }
  }

  if (options.requireDecision) {
    const hasDecision = flowNodes.some(
      (n) =>
        n.kind === "gateway" &&
        edges.filter((e) => e.source === n.id).length >= 2 &&
        edges.filter((e) => e.source === n.id).every((e) => !!e.label?.trim())
    );
    if (!hasDecision) {
      push({
        code: "exclusive-without-decision-labels",
        severity: "error",
        title: "Falta uma decisão modelada",
        detail:
          "O desafio exige um gateway com pelo menos dois caminhos rotulados por condições.",
        hint: "Insira um gateway exclusivo e rotule cada saída com a condição correspondente.",
        nodeIds: [],
      });
    }
  }

  /* ---------------- pontuação ---------------- */
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const score = Math.max(0, Math.min(100, 100 - errors * 12 - warnings * 4));

  return { valid: errors === 0, score, issues };
}

/** Retorna um resumo legível dos problemas agrupados por severidade. */
export function summarizeIssues(result: ValidationResult) {
  return {
    errors: result.issues.filter((i) => i.severity === "error"),
    warnings: result.issues.filter((i) => i.severity === "warning"),
    success: result.issues.filter((i) => i.severity === "success"),
  };
}

export function issueExists(
  result: ValidationResult,
  code: ValidationIssue["code"]
): boolean {
  return result.issues.some((i) => i.code === code && i.severity === "error");
}
