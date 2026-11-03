import type {
  BpmnDiagram,
  BpmnEdge,
  BpmnNode,
  BpmnNodeData,
  EdgeKind,
  NodeKind,
} from "@/types";

/**
 * Helpers para construir diagramas BPMN de forma compacta e consistente.
 * As coordenadas são do canto superior esquerdo; os helpers convertem
 * centros (cx, cy) em x/y conforme o tamanho oficial de cada elemento.
 */

export const ROW_MAIN = 140;
export const ROW_TOP = 60;
export const ROW_BOTTOM = 220;
export const ROW_EXTRA = 300;

const SIZE: Partial<Record<NodeKind, { w: number; h: number }>> = {
  start: { w: 40, h: 40 },
  intermediate: { w: 40, h: 40 },
  end: { w: 40, h: 40 },
  gateway: { w: 52, h: 52 },
  task: { w: 160, h: 64 },
  subProcess: { w: 160, h: 64 },
  expandedSubProcess: { w: 220, h: 120 },
  callActivity: { w: 160, h: 64 },
  dataObject: { w: 48, h: 40 },
  dataStore: { w: 48, h: 48 },
  annotation: { w: 170, h: 46 },
  group: { w: 320, h: 200 },
};

/** Cria um nó de fluxo posicionado pelo centro. */
export function n(
  id: string,
  kind: NodeKind,
  cx: number,
  cy: number = ROW_MAIN,
  data: BpmnNodeData = {},
  extra: Partial<BpmnNode> = {}
): BpmnNode {
  const size = SIZE[kind] ?? { w: 40, h: 40 };
  return {
    id,
    kind,
    x: Math.round(cx - size.w / 2),
    y: Math.round(cy - size.h / 2),
    data: withPhase(kind, data),
    ...extra,
  };
}

/** Cria um nó caixa (pool, lane, artefatos) posicionado pelo canto. */
export function box(
  id: string,
  kind: NodeKind,
  x: number,
  y: number,
  width: number,
  height: number,
  data: BpmnNodeData = {},
  extra: Partial<BpmnNode> = {}
): BpmnNode {
  return { id, kind, x, y, width, height, data: withPhase(kind, data), ...extra };
}

function withPhase(kind: NodeKind, data: BpmnNodeData): BpmnNodeData {
  if (kind === "start" || kind === "intermediate" || kind === "end") {
    return { phase: kind, ...data };
  }
  return data;
}

/** Cria uma aresta. */
export function e(
  id: string,
  source: string,
  target: string,
  label?: string,
  type: EdgeKind = "sequence"
): BpmnEdge {
  return label
    ? { id, source, target, type, label }
    : { id, source, target, type };
}

export function d(nodes: BpmnNode[], edges: BpmnEdge[]): BpmnDiagram {
  return { nodes, edges };
}
