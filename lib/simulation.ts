import type { BpmnDiagram, SimulationConfig, SimulationDecision } from "@/types";

/**
 * Motor de simulação de processos (token game).
 * Executa o fluxo e destaca o caminho percorrido, pausando nas decisões.
 */

export interface SimulationState {
  currentNodeId: string | null;
  visitedNodes: string[];
  visitedEdges: string[];
  pendingDecision: SimulationDecision | null;
  finished: boolean;
  outcome: string | null;
  error: string | null;
  log: string[];
}

function emptyState(): SimulationState {
  return {
    currentNodeId: null,
    visitedNodes: [],
    visitedEdges: [],
    pendingDecision: null,
    finished: false,
    outcome: null,
    error: null,
    log: [],
  };
}

function nodeLabel(diagram: BpmnDiagram, id: string): string {
  const node = diagram.nodes.find((n) => n.id === id);
  return node?.data.label ?? node?.data.poolName ?? id;
}

function outgoing(diagram: BpmnDiagram, id: string) {
  return diagram.edges.filter((e) => e.source === id && e.type !== "association");
}

function incomingCount(diagram: BpmnDiagram, id: string): number {
  return diagram.edges.filter((e) => e.target === id && e.type !== "association")
    .length;
}

/** Inicia a simulação a partir do evento de início configurado. */
export function startSimulation(
  diagram: BpmnDiagram,
  config: SimulationConfig
): SimulationState {
  const state = emptyState();
  const exists = diagram.nodes.some((n) => n.id === config.startNodeId);
  if (!exists) {
    state.error = "Evento de início da simulação não foi encontrado no diagrama.";
    return state;
  }
  return advance(diagram, config, state, config.startNodeId, true);
}

/** Responde à decisão pendente escolhendo uma das saídas. */
export function answerSimulation(
  diagram: BpmnDiagram,
  config: SimulationConfig,
  state: SimulationState,
  edgeId: string
): SimulationState {
  if (!state.pendingDecision || !state.currentNodeId) return state;
  const valid = outgoing(diagram, state.currentNodeId).some(
    (e) => e.id === edgeId
  );
  if (!valid) {
    return { ...state, error: "Opção inválida para esta decisão." };
  }

  const option = state.pendingDecision.options.find((o) => o.edgeId === edgeId);
  const next: SimulationState = {
    ...state,
    pendingDecision: null,
    visitedEdges: [...state.visitedEdges, edgeId],
    log: [
      ...state.log,
      `${nodeLabel(diagram, state.currentNodeId)} → ${option?.label ?? "selecionado"}`,
    ],
  };
  const target = diagram.edges.find((e) => e.id === edgeId)?.target;
  if (!target) return { ...next, error: "Conexão da decisão inválida." };
  return advance(diagram, config, next, target, false);
}

function advance(
  diagram: BpmnDiagram,
  config: SimulationConfig,
  startState: SimulationState,
  startNodeId: string,
  isNewRun: boolean
): SimulationState {
  const state: SimulationState = { ...startState };
  let current = startNodeId;
  const guard = new Set<string>();

  while (true) {
    if (guard.has(current)) {
      state.error = "A simulação entrou em um loop e foi interrompida.";
      state.currentNodeId = current;
      return state;
    }
    guard.add(current);

    const node = diagram.nodes.find((n) => n.id === current);
    if (!node) {
      state.error = `Elemento "${current}" não existe no diagrama.`;
      return state;
    }

    if (!state.visitedNodes.includes(current)) {
      state.visitedNodes.push(current);
    }
    state.currentNodeId = current;
    state.log = [...state.log, nodeLabel(diagram, current)];

    if (isNewRun) {
      state.log = [`Início: ${nodeLabel(diagram, current)}`];
      isNewRun = false;
    }

    if (node.kind === "end") {
      state.finished = true;
      state.pendingDecision = null;
      state.outcome =
        config.endings[current] ?? `Processo encerrado em "${nodeLabel(diagram, current)}".`;
      return state;
    }

    const decision = config.decisions.find((d) => d.nodeId === current);
    if (decision) {
      state.pendingDecision = decision;
      return state;
    }

    const outs = outgoing(diagram, current);

    if (outs.length === 0) {
      state.error = `O elemento "${nodeLabel(diagram, current)}" não tem saída — o fluxo parou.`;
      return state;
    }

    if (node.kind === "gateway" && node.data.gateway === "parallel" && outs.length > 1) {
      // Percorre todos os ramos e retoma na junção.
      const joinNode = diagram.nodes.find(
        (n) => n.kind === "gateway" && incomingCount(diagram, n.id) >= outs.length && n.id !== current
      );
      for (const edge of outs) {
        if (!state.visitedEdges.includes(edge.id)) state.visitedEdges.push(edge.id);
        const branch = exploreBranch(diagram, config, state, edge.target, current);
        if (branch) {
          state.visitedNodes.push(...branch.nodes.filter((id) => !state.visitedNodes.includes(id)));
          state.visitedEdges.push(...branch.edges.filter((id) => !state.visitedEdges.includes(id)));
        }
      }
      if (joinNode && !state.visitedNodes.includes(joinNode.id)) {
        state.visitedNodes.push(joinNode.id);
      }
      const nextEdge = diagram.edges.find(
        (e) => e.source === (joinNode?.id ?? current) && e.type !== "association"
      );
      if (!joinNode || !nextEdge) {
        state.finished = true;
        state.outcome = "Todos os caminhos paralelos foram concluídos.";
        state.currentNodeId = joinNode?.id ?? current;
        return state;
      }
      if (!state.visitedEdges.includes(nextEdge.id)) state.visitedEdges.push(nextEdge.id);
      current = nextEdge.target;
      continue;
    }

    if (outs.length > 1) {
      state.error =
        "Este ponto tem mais de uma saída e nenhuma decisão configurada para a simulação.";
      return state;
    }

    if (!state.visitedEdges.includes(outs[0].id)) state.visitedEdges.push(outs[0].id);
    current = outs[0].target;
  }
}

/** Percorre um ramo paralelo até encontrar um ponto de junção. */
function exploreBranch(
  diagram: BpmnDiagram,
  config: SimulationConfig,
  state: SimulationState,
  from: string,
  splitId: string
): { nodes: string[]; edges: string[] } | null {
  const nodes: string[] = [];
  const edges: string[] = [];
  let current = from;
  const guard = new Set<string>();

  while (current && !guard.has(current)) {
    guard.add(current);
    if (diagram.nodes.some((n) => n.id === current && n.kind === "end")) {
      nodes.push(current);
      const outcome = config.endings[current];
      if (outcome && !state.outcome) state.outcome = outcome;
      return { nodes, edges };
    }
    nodes.push(current);
    const outs = outgoing(diagram, current);
    if (outs.length === 0) return { nodes, edges };
    const nextEdge = outs[0];
    edges.push(nextEdge.id);
    const nextNode = diagram.nodes.find((n) => n.id === nextEdge.target);
    if (!nextNode) return { nodes, edges };
    if (
      nextNode.kind === "gateway" &&
      incomingCount(diagram, nextNode.id) > 1 &&
      nextNode.id !== splitId
    ) {
      nodes.push(nextNode.id);
      return { nodes, edges };
    }
    current = nextEdge.target;
  }
  return { nodes, edges };
}

/** Resultado textual do percurso para exibição. */
export function simulationSummary(state: SimulationState): string {
  if (state.error) return state.error;
  if (state.finished) return state.outcome ?? "Processo concluído.";
  if (state.pendingDecision) return state.pendingDecision.question;
  return "Executando o fluxo…";
}
