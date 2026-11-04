import type {
  BpmnNodeData,
  BpmnSymbolRender,
  EventMarker,
  GatewayType,
  NodeKind,
  TaskType,
} from "@/types";
import { cn, wrapLabel } from "@/lib/utils";

/**
 * Renderizador vetorial dos símbolos BPMN 2.0.
 * A geometria segue a notação oficial:
 *  - Eventos: círculo. Início = borda fina; intermediário = borda dupla; fim = borda grossa.
 *  - Atividades: retângulo de cantos arredondados (+ marcadores).
 *  - Gateways: losango com marcador interno (X, +, O, pentágono, asterisco).
 */

export const BPMN_COLORS = {
  event: "#0284c7",
  activity: "#047857",
  gateway: "#b45309",
  connection: "#4338ca",
  structure: "#be123c",
  artifact: "#6d28d9",
} as const;

const SURFACE: React.CSSProperties = {
  fill: "rgb(var(--surface-raised))",
};
const INK: React.CSSProperties = { fill: "rgb(var(--ink))" };
const INK_SOFT: React.CSSProperties = { fill: "rgb(var(--ink-muted))" };

export function colorForKind(kind: NodeKind): string {
  switch (kind) {
    case "start":
    case "intermediate":
    case "end":
      return BPMN_COLORS.event;
    case "task":
    case "subProcess":
    case "expandedSubProcess":
    case "callActivity":
      return BPMN_COLORS.activity;
    case "gateway":
      return BPMN_COLORS.gateway;
    case "pool":
    case "lane":
      return BPMN_COLORS.structure;
    default:
      return BPMN_COLORS.artifact;
  }
}

export function defaultSize(kind: NodeKind): { w: number; h: number } {
  switch (kind) {
    case "start":
    case "intermediate":
    case "end":
      return { w: 40, h: 40 };
    case "gateway":
      return { w: 52, h: 52 };
    case "task":
    case "subProcess":
    case "callActivity":
      return { w: 160, h: 64 };
    case "expandedSubProcess":
      return { w: 220, h: 120 };
    case "dataObject":
      return { w: 48, h: 40 };
    case "dataStore":
      return { w: 48, h: 48 };
    case "annotation":
      return { w: 170, h: 46 };
    case "group":
      return { w: 320, h: 200 };
    default:
      return { w: 120, h: 60 };
  }
}

interface GlyphProps {
  kind: NodeKind;
  data: BpmnNodeData;
  width: number;
  height: number;
  showLabel?: boolean;
  highlight?: boolean;
  className?: string;
}

/** Desenha um elemento BPMN completo (forma + rótulo). */
export function BpmnGlyph({
  kind,
  data,
  width,
  height,
  showLabel = true,
  highlight = false,
  className,
}: GlyphProps) {
  const isEvent = kind === "start" || kind === "intermediate" || kind === "end";
  const isGateway = kind === "gateway";
  const label = (data.label ?? "").trim();
  const labelBelow = (isEvent || isGateway) && showLabel && label.length > 0;
  const belowSpace = labelBelow ? 28 : 0;

  const color = colorForKind(kind);
  const totalH = height + belowSpace;

  return (
    <svg
      width={width}
      height={totalH}
      viewBox={`0 0 ${width} ${totalH}`}
      className={cn("overflow-visible select-none", className)}
      role="img"
      aria-label={label || kind}
    >
      {renderShape(kind, data, width, height, color)}

      {highlight && (
        <rect
          x={-6}
          y={-6}
          width={width + 12}
          height={height + 12}
          rx={10}
          fill="none"
          stroke="#6366f1"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
      )}

      {labelBelow && (
        <text
          x={width / 2}
          y={height + 16}
          textAnchor="middle"
          style={INK}
          fontSize={11.5}
          fontWeight={500}
          className="fill-ink"
        >
          {wrapLabel(label, 22, 2).map((line, i) => (
            <tspan key={i} x={width / 2} dy={i === 0 ? 0 : 13}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </svg>
  );
}

function renderShape(
  kind: NodeKind,
  data: BpmnNodeData,
  w: number,
  h: number,
  color: string
) {
  switch (kind) {
    case "start":
    case "intermediate":
    case "end":
      return <EventShape w={w} h={h} phase={kind} marker={data.marker} color={color} />;
    case "gateway":
      return <GatewayShape w={w} h={h} type={data.gateway ?? "exclusive"} color={color} />;
    case "task":
    case "subProcess":
    case "callActivity":
    case "expandedSubProcess":
      return (
        <TaskShape
          w={w}
          h={h}
          kind={kind}
          taskType={data.taskType}
          label={data.label ?? ""}
          color={color}
        />
      );
    case "pool":
      return <PoolShape w={w} h={h} name={data.poolName ?? ""} color={color} />;
    case "lane":
      return <LaneShape w={w} h={h} name={data.laneName ?? ""} color={color} />;
    case "dataObject":
      return <DataObjectShape w={w} h={h} color={color} />;
    case "dataStore":
      return <DataStoreShape w={w} h={h} color={color} />;
    case "group":
      return <GroupShape w={w} h={h} name={data.label ?? ""} color={color} />;
    case "annotation":
      return <AnnotationShape w={w} h={h} text={data.label ?? ""} color={color} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Eventos                                                             */
/* ------------------------------------------------------------------ */

function EventShape({
  w,
  h,
  phase,
  marker,
  color,
}: {
  w: number;
  h: number;
  phase: "start" | "intermediate" | "end";
  marker?: EventMarker;
  color: string;
}) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 2;
  const stroke: React.CSSProperties = {
    fill: "rgb(var(--surface-raised))",
    stroke: color,
  };

  return (
    <g>
      {phase === "intermediate" ? (
        <>
          <circle cx={cx} cy={cy} r={r} style={stroke} strokeWidth={1.6} />
          <circle cx={cx} cy={cy} r={r - 3.6} style={SURFACE} stroke={color} strokeWidth={1.6} />
        </>
      ) : phase === "end" ? (
        <circle cx={cx} cy={cy} r={r - 1.8} style={stroke} strokeWidth={3.6} />
      ) : (
        <circle cx={cx} cy={cy} r={r} style={stroke} strokeWidth={1.6} />
      )}
      <g transform={`translate(${cx} ${cy})`}>
        <EventMarker marker={marker} color={color} />
      </g>
    </g>
  );
}

function EventMarker({
  marker,
  color,
}: {
  marker?: EventMarker;
  color: string;
}) {
  const base: React.SVGProps<any> = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (marker) {
    case "message":
      return (
        <g>
          <rect x={-8} y={-5.5} width={16} height={11} rx={1} {...base} />
          <path d="M-8 -5.5 L0 1.2 L8 -5.5" {...base} />
        </g>
      );
    case "timer":
      return (
        <g>
          <circle cx={0} cy={0} r={8.4} {...base} />
          <path d="M0 -4.6 L0 0.4 L4.2 2.6" {...base} />
        </g>
      );
    case "error":
      return <path d="M1.8 -9.2 L-6.4 1.2 L-1.2 1.2 L-2.6 9.2 L6.4 -1.2 L1.2 -1.2 Z" {...base} />;
    case "escalation":
      return (
        <g>
          <path d="M-6 8.4 L-1.4 3 L2.6 7.2 L6 -1.4" {...base} />
          <path d="M6 -7 L9.6 0.6 L2.6 0.4 Z" fill={color} stroke="none" />
        </g>
      );
    case "signal":
      return <path d="M0 -8.6 L8.6 6.2 L-8.6 6.2 Z" {...base} />;
    case "cancel":
      return (
        <g>
          <path d="M-6 -6 L6 6 M6 -6 L-6 6" {...base} />
        </g>
      );
    case "terminate":
      return <circle cx={0} cy={0} r={6.6} fill={color} stroke="none" />;
    case "compensation":
      return (
        <g>
          <path d="M-1 -7 L-8 0 L-1 7 Z" {...base} />
          <path d="M7 -7 L0 0 L7 7 Z" {...base} />
        </g>
      );
    case "link":
      return (
        <g>
          <path d="M-8.6 -6 L-8.6 6 L-1.4 0 Z" {...base} />
          <path d="M8.6 -6 L8.6 6 L1.4 0 Z" {...base} />
        </g>
      );
    case "conditional":
      return (
        <g>
          <rect x={-8} y={-6} width={16} height={12} rx={1.5} {...base} />
          <path d="M-5 -2 H5 M-5 2 H2" {...base} />
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Gateways                                                            */
/* ------------------------------------------------------------------ */

function GatewayShape({
  w,
  h,
  type,
  color,
}: {
  w: number;
  h: number;
  type: GatewayType;
  color: string;
}) {
  const cx = w / 2;
  const cy = h / 2;
  const s = Math.min(w, h) / 2 - 2;

  const base: React.SVGProps<any> = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <g>
      <path
        d={`M${cx} ${cy - s} L${cx + s} ${cy} L${cx} ${cy + s} L${cx - s} ${cy} Z`}
        style={{ fill: "rgb(var(--surface-raised))", stroke: color }}
        strokeWidth={2}
        strokeLinejoin="miter"
      />
      <g transform={`translate(${cx} ${cy})`}>
        {type === "exclusive" && (
          <path d="M-7.6 -7.6 L7.6 7.6 M7.6 -7.6 L-7.6 7.6" {...base} strokeWidth={2} />
        )}
        {type === "parallel" && (
          <path d="M-9 0 H9 M0 -9 V9" {...base} strokeWidth={2} />
        )}
        {type === "inclusive" && <circle cx={0} cy={0} r={7.8} {...base} strokeWidth={2} />}
        {type === "eventBased" && (
          <g>
            <circle cx={0} cy={0} r={9} {...base} />
            <path
              d="M0 -4.8 L4.6 -1.5 L2.8 3.9 L-2.8 3.9 L-4.6 -1.5 Z"
              {...base}
              strokeWidth={1.3}
            />
          </g>
        )}
        {type === "complex" && (
          <path
            d="M-8.4 0 H8.4 M-4.2 -7.3 L4.2 7.3 M-4.2 7.3 L4.2 -7.3"
            {...base}
            strokeWidth={1.8}
          />
        )}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Atividades                                                          */
/* ------------------------------------------------------------------ */

function TaskShape({
  w,
  h,
  kind,
  taskType,
  label,
  color,
}: {
  w: number;
  h: number;
  kind: NodeKind;
  taskType?: TaskType;
  label: string;
  color: string;
}) {
  const strokeWidth = kind === "callActivity" ? 3.2 : 1.6;
  const rx = 8;
  const maxChars = Math.max(10, Math.floor((w - 26) / 6.4));
  const lines = wrapLabel(label, maxChars, kind === "expandedSubProcess" ? 2 : 3);
  const startY = h / 2 - ((lines.length - 1) * 13) / 2;

  return (
    <g>
      {kind === "expandedSubProcess" ? (
        <>
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={h - 2}
            rx={rx}
            style={{ fill: "rgb(var(--surface-raised))", stroke: color }}
            strokeWidth={strokeWidth}
          />
          <rect
            x={5}
            y={5}
            width={w - 10}
            height={h - 10}
            rx={5}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={0.5}
          />
          <MiniFlow w={w} h={h} color={color} />
        </>
      ) : (
        <rect
          x={1}
          y={1}
          width={w - 2}
          height={h - 2}
          rx={rx}
          style={{ fill: "rgb(var(--surface-raised))", stroke: color }}
          strokeWidth={strokeWidth}
        />
      )}

      {/* Marcador de subprocesso colapsado */}
      {kind === "subProcess" && (
        <g stroke={color} strokeWidth={1.8} strokeLinecap="round">
          <path d={`M${w / 2 - 5.5} ${h - 9} H${w / 2 + 5.5}`} />
          <path d={`M${w / 2} ${h - 14.5} V${h - 3.5}`} />
        </g>
      )}

      {taskType && taskType !== "none" && <TaskIcon type={taskType} color={color} />}

      {lines.length > 0 && (
        <text
          x={w / 2}
          y={startY}
          textAnchor="middle"
          fontSize={12}
          fontWeight={500}
          style={INK}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={w / 2} dy={i === 0 ? 0 : 13}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  );
}

/** Fluxo interno esquemático do subprocesso expandido. */
function MiniFlow({ w, h, color }: { w: number; h: number; color: string }) {
  const cy = h - 22;
  const x0 = 26;
  const x1 = w - 26;
  const mid = (x0 + x1) / 2;
  return (
    <g>
      <circle cx={x0} cy={cy} r={6} style={SURFACE} stroke={color} strokeWidth={1.4} />
      <path
        d={`M${x0 + 7} ${cy} H${mid - 30}`}
        stroke={color}
        strokeWidth={1.3}
        fill="none"
        markerEnd="url(#bpmn-mini-arrow)"
      />
      <path
        d={`M${mid - 26} ${cy - 8} h44 a5 5 0 0 1 5 5 v6 a5 5 0 0 1 -5 5 h-44 a5 5 0 0 1 -5 -5 v-6 a5 5 0 0 1 5 -5 z`}
        style={SURFACE}
        stroke={color}
        strokeWidth={1.3}
      />
      <path
        d={`M${mid + 28} ${cy} H${x1 - 7}`}
        stroke={color}
        strokeWidth={1.3}
        fill="none"
        markerEnd="url(#bpmn-mini-arrow)"
      />
      <circle cx={x1} cy={cy} r={6} style={SURFACE} stroke={color} strokeWidth={2.4} />
      <defs>
        <marker
          id="bpmn-mini-arrow"
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M0 1 L9 5 L0 9 z" fill={color} />
        </marker>
      </defs>
    </g>
  );
}

function TaskIcon({ type, color }: { type: TaskType; color: string }) {
  const ox = 11;
  const oy = 10;
  const base: React.SVGProps<any> = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "user":
      return (
        <g transform={`translate(${ox} ${oy})`}>
          <circle cx={7} cy={4} r={2.8} {...base} />
          <path d="M1.8 13 a5.2 5.2 0 0 1 10.4 0" {...base} />
        </g>
      );
    case "service":
      return (
        <g transform={`translate(${ox} ${oy})`}>
          <circle cx={7} cy={7} r={3} {...base} />
          <circle cx={7} cy={7} r={0.9} fill={color} stroke="none" />
          <path
            d="M7 0.6 V2.4 M7 11.6 V13.4 M0.6 7 H2.4 M11.6 7 H13.4 M2.5 2.5 L3.8 3.8 M10.2 10.2 L11.5 11.5 M11.5 2.5 L10.2 3.8 M3.8 10.2 L2.5 11.5"
            {...base}
          />
        </g>
      );
    case "manual":
      return (
        <g transform={`translate(${ox} ${oy})`} fill={color}>
          <rect x={2.4} y={4} width={2.3} height={6} rx={1.15} />
          <rect x={5.5} y={1.6} width={2.3} height={8.4} rx={1.15} />
          <rect x={8.6} y={3.2} width={2.3} height={6.8} rx={1.15} />
          <path d="M2.4 8.6 h8.5 v1.6 a3.4 3.4 0 0 1 -3.4 3.4 h-1.7 a3.4 3.4 0 0 1 -3.4 -3.4 z" />
        </g>
      );
    case "send":
      return (
        <g transform={`translate(${ox} ${oy})`}>
          <rect x={0.5} y={3.5} width={7.5} height={7} rx={1.2} {...base} />
          <path d="M9.5 7 H13.8 M11.6 4.8 L13.9 7 L11.6 9.2" {...base} />
        </g>
      );
    case "receive":
      return (
        <g transform={`translate(${ox} ${oy})`}>
          <rect x={6} y={3.5} width={7.5} height={7} rx={1.2} {...base} />
          <path d="M0.5 7 H4.4 M2.4 4.8 L0.1 7 L2.4 9.2" {...base} />
        </g>
      );
    case "script":
      return (
        <g transform={`translate(${ox} ${oy})`}>
          <path d="M1.5 0.8 H9.6 L12.5 3.8 V13.2 H1.5 Z" {...base} />
          <path d="M9.4 1 V4 H12.3" {...base} />
          <path d="M3.6 6.4 H10.2 M3.6 8.8 H10.2 M3.6 11.2 H8" {...base} strokeWidth={1.1} />
        </g>
      );
    case "businessRule":
      return (
        <g transform={`translate(${ox} ${oy})`}>
          <rect x={0.8} y={1.4} width={12.4} height={11.2} rx={1.4} {...base} />
          <path d="M0.8 5 H13.2 M0.8 9 H13.2 M5 1.4 V12.6" {...base} strokeWidth={1.1} />
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Pools e lanes                                                       */
/* ------------------------------------------------------------------ */

function PoolShape({
  w,
  h,
  name,
  color,
}: {
  w: number;
  h: number;
  name: string;
  color: string;
}) {
  const band = 30;
  return (
    <g>
      <rect
        x={1}
        y={1}
        width={w - 2}
        height={h - 2}
        rx={6}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      <rect x={1} y={1} width={band} height={h - 2} fill="none" stroke={color} strokeWidth={2} />
      <text
        transform={`translate(${band / 2 + 1} ${h / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        style={INK}
      >
        {name.slice(0, Math.floor((h - 20) / 6.6))}
      </text>
    </g>
  );
}

function LaneShape({
  w,
  h,
  name,
  color,
}: {
  w: number;
  h: number;
  name: string;
  color: string;
}) {
  const band = 24;
  return (
    <g>
      <rect x={1} y={1} width={w - 2} height={h - 2} fill="rgb(var(--surface-sunk))" stroke={color} strokeWidth={1.2} />
      <rect x={1} y={1} width={band} height={h - 2} fill="none" stroke={color} strokeWidth={1.2} />
      <text
        transform={`translate(${band / 2 + 1} ${h / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        style={INK_SOFT}
      >
        {name.slice(0, Math.floor((h - 16) / 6))}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Artefatos                                                           */
/* ------------------------------------------------------------------ */

function DataObjectShape({ w, h, color }: { w: number; h: number; color: string }) {
  const fold = 8;
  return (
    <path
      d={`M1 1 H${w - fold - 1} L${w - 1} ${fold + 1} V${h - 1} H1 Z`}
      style={{ fill: "rgb(var(--surface-raised))", stroke: color }}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  );
}

function DataStoreShape({ w, h, color }: { w: number; h: number; color: string }) {
  const rx = w / 2 - 1;
  const ry = 5;
  const top = ry + 1;
  const bottom = h - ry - 1;
  return (
    <g>
      <path
        d={`M1 ${top} V${bottom} A${rx} ${ry} 0 0 0 ${w - 1} ${bottom} V${top}`}
        style={{ fill: "rgb(var(--surface-raised))", stroke: color }}
        strokeWidth={1.6}
      />
      <ellipse cx={w / 2} cy={top} rx={rx} ry={ry} style={SURFACE} stroke={color} strokeWidth={1.6} />
      <path d={`M1 ${(h - 3) / 2} A${rx} ${ry} 0 0 0 ${w - 1} ${(h - 3) / 2}`} fill="none" stroke={color} strokeWidth={1.6} />
    </g>
  );
}

function GroupShape({
  w,
  h,
  name,
  color,
}: {
  w: number;
  h: number;
  name: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={1}
        y={1}
        width={w - 2}
        height={h - 2}
        rx={10}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="7 5"
      />
      <text x={10} y={18} fontSize={11.5} fontWeight={600} style={INK_SOFT}>
        {name.slice(0, 28)}
      </text>
    </g>
  );
}

function AnnotationShape({
  w,
  h,
  text,
  color,
}: {
  w: number;
  h: number;
  text: string;
  color: string;
}) {
  const lines = wrapLabel(text, 22, 3);
  return (
    <g>
      <path
        d={`M${w - 2} 3 H10 V${h - 3} H${w - 2}`}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <text x={16} y={h / 2 - ((lines.length - 1) * 12) / 2 + 1} fontSize={11} style={INK_SOFT}>
        {lines.map((line, i) => (
          <tspan key={i} x={16} dy={i === 0 ? 0 : 12}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Glifo completo de um símbolo da biblioteca                          */
/* ------------------------------------------------------------------ */

/**
 * Dimensões intrínsecas de cada símbolo — fonte única de verdade.
 * Toda renderização isolada (biblioteca, cards, quiz, paleta) parte daqui;
 * o enquadramento é feito por escala proporcional, nunca por corte.
 */
export function symbolIntrinsic(render: BpmnSymbolRender): { w: number; h: number } {
  switch (render.kind) {
    case "connection":
      return { w: 180, h: 40 };
    case "structure": {
      // Pools e lanes são horizontalmente extensos.
      if (render.structure === "pool") return { w: 200, h: 78 };
      if (render.structure === "milestone") return { w: 60, h: 52 };
      return { w: 200, h: 64 }; // lane | participant
    }
    case "artifact": {
      if (render.artifact === "dataObject") return { w: 48, h: 40 };
      if (render.artifact === "dataStore") return { w: 48, h: 48 };
      if (render.artifact === "group") return { w: 180, h: 110 };
      return { w: 170, h: 46 }; // textAnnotation
    }
    case "event":
      return { w: 40, h: 40 };
    case "gateway":
      return { w: 52, h: 52 };
    case "task":
      return { w: 150, h: 58 };
    case "activity":
      return render.activity === "expandedSubProcess"
        ? { w: 200, h: 84 }
        : { w: 150, h: 58 };
  }
}

/**
 * Escala máxima de ampliação por tipo de símbolo.
 * Símbolos compactos (eventos, gateways, artefatos pequenos) podem ampliar
 * para ganhar legibilidade; os extensos (pools, conexões, anotações) apenas
 * reduzem, preservando sempre a proporção original.
 */
function fitMaxScale(render: BpmnSymbolRender): number {
  switch (render.kind) {
    case "event":
      return 1.7;
    case "gateway":
      return 1.5;
    case "task":
      return 1.2;
    case "activity":
      return render.activity === "expandedSubProcess" ? 1 : 1.1;
    case "artifact":
      return render.artifact === "dataObject" || render.artifact === "dataStore"
        ? 1.5
        : 1;
    case "connection":
    case "structure":
      return 1;
  }
}

/**
 * Caixas de enquadramento padrão por contexto de uso.
 * Cada contexto define a área disponível; o símbolo é escalado para caber.
 */
export const SYMBOL_BOX = {
  /** Palco dos cartões da biblioteca de símbolos. */
  stage: { width: 216, height: 96 },
  /** Visual de destaque (modal de detalhe). */
  detail: { width: 120, height: 88 },
  /** Miniatura em card de conteúdo (trilha, exemplos). */
  chip: { width: 88, height: 56 },
  /** Miniatura compacta em listas e paleta do laboratório. */
  tiny: { width: 56, height: 40 },
  /** Miniatura reduzida em listas de apoio (símbolos de um exemplo). */
  micro: { width: 40, height: 32 },
  /** Visual grande (questões de quiz e identificação). */
  hero: { width: 160, height: 128 },
} as const;

interface SymbolGlyphProps {
  render: BpmnSymbolRender;
  showLabel?: boolean;
  label?: string;
  className?: string;
  /**
   * Caixa de enquadramento: o símbolo é escalado proporcionalmente para
   * caber dentro dela — nunca cortado, nunca distorcido. Os marcadores
   * internos escalam junto e permanecem visíveis.
   */
  fit?: { width: number; height: number; maxScale?: number };
}

/** Renderiza o conteúdo vetorial do símbolo em suas dimensões intrínsecas. */
function renderSymbolContent(
  render: BpmnSymbolRender,
  showLabel: boolean,
  label: string | undefined,
  intrinsic: { w: number; h: number }
): React.ReactNode {
  if (render.kind === "connection") {
    const connection =
      render.connection === "dataInput" || render.connection === "dataOutput"
        ? "association"
        : render.connection;
    return <ConnectionGlyph connection={connection} />;
  }

  if (render.kind === "structure") {
    if (render.structure === "pool") {
      return (
        <BpmnGlyph
          kind="pool"
          data={{ poolName: label ?? "Pool" }}
          width={intrinsic.w}
          height={intrinsic.h}
        />
      );
    }
    if (render.structure === "lane") {
      return (
        <BpmnGlyph
          kind="lane"
          data={{ laneName: label ?? "Lane" }}
          width={intrinsic.w}
          height={intrinsic.h}
        />
      );
    }
    if (render.structure === "milestone") {
      return <MilestoneGlyph />;
    }
    return (
      <BpmnGlyph
        kind="pool"
        data={{ poolName: label ?? "Participante" }}
        width={intrinsic.w}
        height={intrinsic.h}
      />
    );
  }

  if (render.kind === "artifact") {
    const kind: NodeKind =
      render.artifact === "group"
        ? "group"
        : render.artifact === "textAnnotation"
          ? "annotation"
          : render.artifact === "dataStore"
            ? "dataStore"
            : "dataObject";
    const data =
      kind === "group"
        ? { label: label ?? "Grupo" }
        : kind === "annotation"
          ? { label: label ?? "Anotação de texto" }
          : {};
    return (
      <BpmnGlyph
        kind={kind}
        data={data}
        width={intrinsic.w}
        height={intrinsic.h}
        showLabel={showLabel}
      />
    );
  }

  if (render.kind === "event") {
    return (
      <BpmnGlyph
        kind={render.phase}
        data={{ phase: render.phase, marker: render.marker }}
        width={intrinsic.w}
        height={intrinsic.h}
        showLabel={showLabel}
      />
    );
  }

  if (render.kind === "gateway") {
    return (
      <BpmnGlyph
        kind="gateway"
        data={{ gateway: render.gateway }}
        width={intrinsic.w}
        height={intrinsic.h}
        showLabel={showLabel}
      />
    );
  }

  // task | activity
  const kind: NodeKind =
    render.kind === "activity"
      ? render.activity === "subProcess"
        ? "subProcess"
        : render.activity === "callActivity"
          ? "callActivity"
          : render.activity === "expandedSubProcess"
            ? "expandedSubProcess"
            : "task"
      : "task";
  return (
    <BpmnGlyph
      kind={kind}
      data={{ taskType: render.taskType }}
      width={intrinsic.w}
      height={intrinsic.h}
      showLabel={showLabel}
    />
  );
}

/**
 * Renderiza um símbolo BPMN isolado (biblioteca, cards, quiz, paleta).
 * Sem `fit`, usa as dimensões intrínsecas; com `fit`, enquadra o símbolo
 * dentro da caixa via escala proporcional (preserva a notação BPMN 2.0).
 */
export function BpmnSymbolGlyph({
  render,
  showLabel = false,
  label,
  className,
  fit,
}: SymbolGlyphProps) {
  const intrinsic = symbolIntrinsic(render);
  const content = renderSymbolContent(render, showLabel, label, intrinsic);

  if (!fit) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {content}
      </div>
    );
  }

  const maxScale = fit.maxScale ?? fitMaxScale(render);

  /**
   * Enquadramento fluido:
   *  - a caixa ocupa o espaço disponível (100%), limitada por `fit`
   *    e pela ampliação máxima do tipo de símbolo;
   *  - o SVG usa viewBox + preserveAspectRatio (meet) e escala para
   *    caber inteiro — proporção e marcadores sempre preservados,
   *    sem corte em nenhuma largura de container.
   */
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{
        width: Math.min(fit.width, intrinsic.w * maxScale),
        height: Math.min(fit.height, intrinsic.h * maxScale),
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full">
        {content}
      </div>
    </div>
  );
}

/** Glifo de conexão (linha com seta). */
export function ConnectionGlyph({
  connection,
  className,
}: {
  connection: "sequence" | "message" | "association";
  className?: string;
}) {
  const color = BPMN_COLORS.connection;
  const dashed = connection === "message" ? "7 4" : connection === "association" ? "3 4" : undefined;
  const open = connection === "message";

  return (
    <svg width={180} height={40} viewBox="0 0 180 40" className={cn("overflow-visible", className)}>
      <defs>
        <marker
          id={`arrow-${connection}`}
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto-start-reverse"
        >
          <path
            d="M0 1 L9 5 L0 9 z"
            fill={open ? "rgb(var(--surface-raised))" : color}
            stroke={color}
            strokeWidth={open ? 1.2 : 0}
          />
        </marker>
      </defs>
      <path
        d="M8 20 H168"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeDasharray={dashed}
        markerEnd={`url(#arrow-${connection})`}
      />
    </svg>
  );
}

/** Representação convencional de milestone (não é símbolo do núcleo BPMN 2.0). */
function MilestoneGlyph() {
  const color = BPMN_COLORS.structure;
  return (
    <svg width={60} height={52} viewBox="0 0 60 52" className="overflow-visible">
      <path d="M14 48 V6" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <path d="M14 8 H50 L41 18 L50 28 H14 Z" style={SURFACE} stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </svg>
  );
}
