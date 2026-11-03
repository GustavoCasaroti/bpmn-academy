"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import type { BpmnDiagram, BpmnNode, NodeKind } from "@/types";
import { BpmnGlyph, defaultSize } from "@/components/bpmn/BpmnGlyph";
import { cn } from "@/lib/utils";

export interface BpmnFlowData {
  [key: string]: unknown;
  node: BpmnNode;
  highlight?: boolean;
  dimmed?: boolean;
  badge?: string;
}

export type BpmnFlowNode = Node<BpmnFlowData, "bpmn">;

const CONTAINER_KINDS: NodeKind[] = ["pool", "lane"];

function BpmnFlowNodeComponent({ data, selected }: NodeProps<BpmnFlowNode>) {
  const { node, highlight, dimmed, badge } = data;
  const size = defaultSize(node.kind);
  const width = node.width ?? size.w;
  const height = node.height ?? size.h;
  const isContainer = CONTAINER_KINDS.includes(node.kind);

  return (
    <div
      className={cn(
        "relative",
        dimmed && "opacity-35 transition-opacity duration-200",
        highlight && "animate-pulse-soft"
      )}
    >
      <BpmnGlyph
        kind={node.kind}
        data={node.data}
        width={width}
        height={height}
        highlight={!!highlight || selected}
      />
      {badge && (
        <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-semibold text-white shadow">
          {badge}
        </span>
      )}
      {!isContainer && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!h-3 !w-3 !border-2 !border-white !bg-brand-500"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!h-3 !w-3 !border-2 !border-white !bg-brand-500"
          />
        </>
      )}
    </div>
  );
}

const nodeTypes = { bpmn: BpmnFlowNodeComponent };

/* ------------------------------------------------------------------ */
/* Conversões                                                          */
/* ------------------------------------------------------------------ */

const EDGE_ORDER: Record<NodeKind, number> = {
  pool: 0,
  lane: 1,
  group: 2,
  dataObject: 3,
  dataStore: 3,
  annotation: 3,
  start: 5,
  intermediate: 5,
  end: 5,
  gateway: 5,
  task: 5,
  subProcess: 5,
  expandedSubProcess: 5,
  callActivity: 5,
};

export function diagramToFlow(
  diagram: BpmnDiagram,
  options: {
    highlightNodeIds?: string[];
    dimNodeIds?: string[];
    badges?: Record<string, string>;
    interactive?: boolean;
  } = {}
): { nodes: BpmnFlowNode[]; edges: Edge[] } {
  const highlight = new Set(options.highlightNodeIds ?? []);
  const dim = new Set(options.dimNodeIds ?? []);

  const nodes: BpmnFlowNode[] = [...diagram.nodes]
    .sort((a, b) => (EDGE_ORDER[a.kind] ?? 5) - (EDGE_ORDER[b.kind] ?? 5))
    .map((node) => ({
      id: node.id,
      type: "bpmn",
      position: { x: node.x, y: node.y },
      draggable: options.interactive && !CONTAINER_KINDS.includes(node.kind),
      deletable: options.interactive && !CONTAINER_KINDS.includes(node.kind),
      selectable: true,
      data: {
        node,
        highlight: highlight.has(node.id),
        dimmed: dim.has(node.id),
        badge: options.badges?.[node.id],
      },
    }));

  const edges: Edge[] = diagram.edges.map((edge) => {
    const dashed =
      edge.type === "message"
        ? "edge-message"
        : edge.type === "association"
          ? "edge-association"
          : "edge-sequence";
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      label: edge.label,
      deletable: options.interactive,
      selectable: options.interactive,
      className: dashed,
      markerEnd:
        edge.type === "association"
          ? undefined
          : { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      labelStyle: { fill: "#475569", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "rgb(var(--surface-raised))", fillOpacity: 0.9 },
      labelBgPadding: [6, 3],
      labelBgBorderRadius: 6,
    } satisfies Edge;
  });

  return { nodes, edges };
}

export function flowToDiagram(
  nodes: BpmnFlowNode[],
  edges: Edge[]
): BpmnDiagram {
  return {
    nodes: nodes.map((n) => {
      const source = n.data.node;
      return {
        ...source,
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
      };
    }),
    edges: edges.map((e) => {
      const original = e.className ?? "";
      const type = original.includes("message")
        ? "message"
        : original.includes("association")
          ? "association"
          : "sequence";
      const label =
        typeof e.label === "string" ? e.label : undefined;
      return label
        ? { id: e.id, source: e.source, target: e.target, type, label }
        : { id: e.id, source: e.source, target: e.target, type };
    }),
  };
}

/* ------------------------------------------------------------------ */
/* Diagrama                                                            */
/* ------------------------------------------------------------------ */

interface DiagramViewProps {
  diagram: BpmnDiagram;
  highlightNodeIds?: string[];
  dimNodeIds?: string[];
  badges?: Record<string, string>;
  interactive?: boolean;
  onNodesChange?: (nodes: BpmnFlowNode[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onNodeClick?: (node: BpmnNode) => void;
  onEdgeClick?: (edgeId: string) => void;
  /** Chamado quando o usuário arrasta uma conexão entre dois handles. */
  onConnect?: (connection: { source: string; target: string }) => void;
  selectedEdgeId?: string;
  height?: number | string;
  className?: string;
  showMiniMap?: boolean;
  fitViewPadding?: number;
}

export function DiagramView({
  diagram,
  highlightNodeIds,
  dimNodeIds,
  badges,
  interactive = false,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
  onConnect,
  selectedEdgeId,
  height = 520,
  className,
  showMiniMap = false,
  fitViewPadding = 0.15,
}: DiagramViewProps) {
  const { nodes, edges } = useMemo(
    () =>
      diagramToFlow(diagram, {
        highlightNodeIds,
        dimNodeIds,
        badges,
        interactive,
      }),
    [diagram, highlightNodeIds, dimNodeIds, badges, interactive]
  );

  const finalEdges = useMemo(
    () =>
      edges.map((e) =>
        selectedEdgeId && e.id === selectedEdgeId
          ? { ...e, className: cn(e.className, "edge-selected") }
          : e
      ),
    [edges, selectedEdgeId]
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line bg-surface-raised",
        className
      )}
      style={{ height }}
    >
      <ReactFlow
        nodes={nodes}
        edges={finalEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange ? (changes) => {
          const map = new Map(nodes.map((n) => [n.id, n]));
          const next = applyNodeChangesSafe(changes, map);
          onNodesChange(next);
        } : undefined}
        onEdgesChange={onEdgesChange ? (changes) => {
          const map = new Map(finalEdges.map((e) => [e.id, e]));
          const next = applyEdgeChangesSafe(changes, map);
          onEdgesChange(next);
        } : undefined}
        onNodeClick={
          onNodeClick
            ? (_, node) => onNodeClick((node.data as BpmnFlowData).node)
            : undefined
        }
        onEdgeClick={onEdgeClick ? (_, edge) => onEdgeClick(edge.id) : undefined}
        onConnect={
          onConnect
            ? (connection) => {
                if (connection.source && connection.target) {
                  onConnect({
                    source: connection.source,
                    target: connection.target,
                  });
                }
              }
            : undefined
        }
        fitView
        fitViewOptions={{ padding: fitViewPadding, maxZoom: 1.15 }}
        minZoom={0.15}
        maxZoom={2}
        nodesDraggable={interactive}
        nodesConnectable={interactive}
        elementsSelectable={interactive}
        deleteKeyCode={interactive ? ["Delete", "Backspace"] : null}
        proOptions={{ hideAttribution: true }}
        className="bg-surface-raised"
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        <Controls showInteractive={false} />
        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => {
              const kind = (n.data as BpmnFlowData)?.node?.kind;
              if (kind === "start" || kind === "end" || kind === "intermediate")
                return "#0284c7";
              if (kind === "gateway") return "#b45309";
              if (kind === "pool" || kind === "lane") return "#be123c";
              return "#047857";
            }}
            className="!bg-surface-sunk"
          />
        )}
      </ReactFlow>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auxiliares de mudança de estado (evitam dependência extra)          */
/* ------------------------------------------------------------------ */

function applyNodeChangesSafe(
  changes: import("@xyflow/react").NodeChange[],
  current: Map<string, BpmnFlowNode>
): BpmnFlowNode[] {
  const next = new Map(current);
  for (const change of changes) {
    if (change.type === "position" && change.position) {
      const node = next.get(change.id);
      if (node) next.set(change.id, { ...node, position: change.position });
    } else if (change.type === "remove") {
      next.delete(change.id);
    } else if (change.type === "select") {
      const node = next.get(change.id);
      if (node) next.set(change.id, { ...node, selected: change.selected });
    } else if (change.type === "dimensions" && change.dimensions) {
      const node = next.get(change.id);
      if (node) {
        next.set(change.id, {
          ...node,
          width: change.dimensions.width,
          height: change.dimensions.height,
        });
      }
    }
  }
  return [...next.values()];
}

function applyEdgeChangesSafe(
  changes: import("@xyflow/react").EdgeChange[],
  current: Map<string, Edge>
): Edge[] {
  const next = new Map(current);
  for (const change of changes) {
    if (change.type === "remove") {
      next.delete(change.id);
    } else if (change.type === "select") {
      const edge = next.get(change.id);
      if (edge) next.set(change.id, { ...edge, selected: change.selected });
    } else if (change.type === "add" && change.item) {
      next.set(change.item.id, change.item);
    }
  }
  return [...next.values()];
}
