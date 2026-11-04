"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Eraser,
  Info,
  MousePointerClick,
  Play,
  RotateCcw,
  Shapes,
  Target,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import type { Edge } from "@xyflow/react";
import { Badge, Button, Card, EmptyState, Modal, SectionHeader, Tabs } from "@/components/ui";
import { DiagramView, flowToDiagram, type BpmnFlowNode } from "@/components/bpmn/DiagramView";
import { SymbolPalette } from "@/components/game/SymbolPalette";
import { ValidationPanel } from "@/components/game/ValidationPanel";
import { challenges } from "@/data/challenges";
import { CHALLENGE_MODES } from "@/data/config";
import { modules } from "@/data/modules";
import { validateDiagram } from "@/lib/validate";
import {
  answerSimulation,
  simulationSummary,
  startSimulation,
  type SimulationState,
} from "@/lib/simulation";
import { useProgressStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type {
  BpmnDiagram,
  BpmnEdge,
  BpmnNode,
  BpmnSymbol,
  Challenge,
  EdgeKind,
  NodeKind,
  ValidationResult,
} from "@/types";

const ROW_Y = [140, 60, 220, 300, 380];

export default function DesafioPage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = use(params);
  const challenge = challenges.find((c) => c.id === challengeId);
  const { progress, completeChallenge } = useProgressStore();

  if (!challenge) {
    return (
      <div className="mx-auto max-w-3xl animate-fade-up">
        <Card className="p-8 text-center">
          <h1 className="text-lg font-semibold text-ink">Desafio não encontrado</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Este desafio não existe ou foi removido.
          </p>
          <Button href="/laboratorio" className="mt-4" icon={<ArrowLeft size={16} />}>
            Voltar ao laboratório
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <DesafioRunner
      key={challenge.id}
      challenge={challenge}
      onComplete={completeChallenge}
      priorProgress={progress.challenges[challenge.id]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Runner                                                              */
/* ------------------------------------------------------------------ */

type CompleteFn = (
  challengeId: string,
  title: string,
  score: number,
  attempts: number,
  xp: number
) => { progress: unknown; xpGained: number; newAchievements: string[] };

function DesafioRunner({
  challenge,
  onComplete,
  priorProgress,
}: {
  challenge: Challenge;
  onComplete: CompleteFn;
  priorProgress?: { score: number; attempts: number };
}) {
  const isEditable = challenge.mode === "build" || challenge.mode === "fix";

  const [diagram, setDiagram] = useState<BpmnDiagram>(() => {
    if (challenge.mode === "fix" && challenge.initialDiagram) {
      return clone(challenge.initialDiagram);
    }
    return { nodes: [], edges: [] };
  });
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [edgeType, setEdgeType] = useState<EdgeKind>("sequence");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [toast, setToast] = useState<{ xp: number; score: number } | null>(null);
  const [mobileTab, setMobileTab] = useState<"palette" | "canvas" | "panel">("canvas");

  // Modo identificação
  const [identifyAnswers, setIdentifyAnswers] = useState<Record<string, string>>({});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  // Modo simulação
  const [simState, setSimState] = useState<SimulationState | null>(null);

  const module = modules.find((m) => m.id === challenge.moduleId);

  /* ---------------- validação ---------------- */
  const runValidation = useCallback(() => {
    const options = {
      requiredSymbols: challenge.requiredSymbols,
      minTasks: challenge.minTasks,
      minEndEvents: challenge.minEndEvents,
      requireDecision: challenge.requireDecision,
    };
    const r = validateDiagram(diagram, options);
    setResult(r);
    setAttempts((a) => a + 1);

    const errors = r.issues.filter((i) => i.severity === "error");
    const expected = new Set(challenge.expectedIssueCodes ?? []);

    let passed = false;
    if (challenge.mode === "build") {
      passed = r.valid;
    } else if (challenge.mode === "fix") {
      const expectedPersisting = errors.filter((i) => expected.has(i.code));
      const newErrors = errors.filter((i) => !expected.has(i.code));
      passed = expectedPersisting.length === 0 && newErrors.length === 0;
    }

    if (passed && !success) {
      finish(r.score);
    }
    return r;
  }, [diagram, challenge, success]);

  const finish = useCallback(
    (score: number) => {
      setSuccess(true);
      const res = onComplete(
        challenge.id,
        challenge.title,
        score,
        1,
        challenge.xp
      );
      setToast({ xp: res.xpGained, score });
      window.setTimeout(() => setToast(null), 4500);
    },
    [challenge, onComplete]
  );

  /* ---------------- edição do diagrama ---------------- */
  const handleNodesChange = useCallback(
    (nodes: BpmnFlowNode[]) => {
      setDiagram((current) => flowToDiagram(nodes, toFlowEdges(current)));
      setSelectedNodeId((id) => (nodes.some((n) => n.id === id) ? id : null));
    },
    []
  );

  const handleEdgesChange = useCallback((edges: Edge[]) => {
    setDiagram((current) => ({
      nodes: current.nodes,
      edges: edges.map((e) => edgeFromFlow(e)),
    }));
    setSelectedEdgeId((id) => (edges.some((e) => e.id === id) ? id : null));
  }, []);

  const handleConnect = useCallback(
    ({ source, target }: { source: string; target: string }) => {
      if (source === target) return;
      setDiagram((current) => {
        if (
          current.edges.some(
            (e) => e.source === source && e.target === target
          )
        ) {
          return current;
        }
        const id = `e-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 6)}`;
        const edge: BpmnEdge =
          edgeType === "sequence"
            ? { id, source, target, type: "sequence" }
            : { id, source, target, type: edgeType };
        return { ...current, edges: [...current.edges, edge] };
      });
    },
    [edgeType]
  );

  const handlePickSymbol = useCallback(
    (symbol: BpmnSymbol) => {
      const node = nodeFromSymbol(symbol, diagram);
      setDiagram((current) => ({
        ...current,
        nodes: [...current.nodes, node],
      }));
      setSelectedNodeId(node.id);
      setSelectedEdgeId(null);
      setMobileTab("canvas");
    },
    [diagram]
  );

  const handleNodeClick = useCallback(
    (node: BpmnNode) => {
      if (challenge.mode === "identify") {
        const q = challenge.identifyQuestions?.find((x) => x.nodeId === node.id);
        if (q) setActiveQuestion(q.nodeId);
        return;
      }
      if (isEditable) {
        setSelectedNodeId((id) => (id === node.id ? null : node.id));
        setSelectedEdgeId(null);
      }
    },
    [challenge, isEditable]
  );

  const updateNodeLabel = useCallback(
    (label: string) => {
      if (!selectedNodeId) return;
      setDiagram((current) => ({
        ...current,
        nodes: current.nodes.map((n) =>
          n.id === selectedNodeId ? { ...n, data: { ...n.data, label } } : n
        ),
      }));
    },
    [selectedNodeId]
  );

  const deleteSelected = useCallback(() => {
    if (selectedNodeId) {
      setDiagram((current) => ({
        nodes: current.nodes.filter((n) => n.id !== selectedNodeId),
        edges: current.edges.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
        ),
      }));
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setDiagram((current) => ({
        ...current,
        edges: current.edges.filter((e) => e.id !== selectedEdgeId),
      }));
      setSelectedEdgeId(null);
    }
  }, [selectedNodeId, selectedEdgeId]);

  const changeEdgeType = useCallback(
    (type: EdgeKind) => {
      if (!selectedEdgeId) return;
      setEdgeType(type);
      setDiagram((current) => ({
        ...current,
        edges: current.edges.map((e) =>
          e.id === selectedEdgeId ? { ...e, type } : e
        ),
      }));
    },
    [selectedEdgeId]
  );

  const updateEdgeLabel = useCallback(
    (label: string) => {
      if (!selectedEdgeId) return;
      setDiagram((current) => ({
        ...current,
        edges: current.edges.map((e) => {
          if (e.id !== selectedEdgeId) return e;
          return label.trim()
            ? { ...e, label }
            : { id: e.id, source: e.source, target: e.target, type: e.type };
        }),
      }));
    },
    [selectedEdgeId]
  );

  const resetDiagram = useCallback(() => {
    setDiagram(
      challenge.mode === "fix" && challenge.initialDiagram
        ? clone(challenge.initialDiagram)
        : { nodes: [], edges: [] }
    );
    setResult(null);
    setSuccess(false);
    setSelectedEdgeId(null);
    setSelectedNodeId(null);
  }, [challenge]);

  /* ---------------- identificação ---------------- */
  const identifyQuestions = challenge.identifyQuestions ?? [];
  const answeredCount = identifyQuestions.filter(
    (q) => identifyAnswers[q.nodeId]
  ).length;

  useEffect(() => {
    if (
      challenge.mode === "identify" &&
      identifyQuestions.length > 0 &&
      answeredCount === identifyQuestions.length &&
      !success
    ) {
      const correct = identifyQuestions.filter(
        (q) => identifyAnswers[q.nodeId] === q.correctOptionId
      ).length;
      const score = Math.round((correct / identifyQuestions.length) * 100);
      finish(score);
    }
  }, [
    answeredCount,
    identifyAnswers,
    identifyQuestions,
    challenge.mode,
    success,
    finish,
  ]);

  /* ---------------- simulação ---------------- */
  const runSimulation = useCallback(() => {
    if (!challenge.simulation) return;
    setResult(null);
    setSimState(startSimulation(challenge.solution!, challenge.simulation));
  }, [challenge]);

  const answerSim = useCallback(
    (edgeId: string) => {
      if (!simState || !challenge.simulation) return;
      setSimState(
        answerSimulation(
          challenge.solution!,
          challenge.simulation,
          simState,
          edgeId
        )
      );
    },
    [simState, challenge]
  );

  useEffect(() => {
    if (challenge.mode === "simulate" && simState?.finished && !success) {
      finish(100);
    }
  }, [simState, challenge.mode, success, finish]);

  const info = CHALLENGE_MODES[challenge.mode];

  /* ---------------- render ---------------- */
  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <Link
        href="/laboratorio"
        className="mb-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} />
        Laboratório BPMN
      </Link>

      {/* ---------- Cabeçalho ---------- */}
      <div className="rounded-2xl border border-line bg-surface-raised p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{info.label}</Badge>
              <Badge tone="neutral">{CHALLENGE_MODES[challenge.mode].short}</Badge>
              <Badge tone="warning">+{challenge.xp} XP</Badge>
              {success && (
                <Badge tone="success">
                  <Check size={11} className="mr-1" /> Concluído
                </Badge>
              )}
              {priorProgress && (
                <span className="text-xs text-ink-subtle">
                  melhor: {priorProgress.score}/100
                </span>
              )}
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {challenge.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
              {challenge.situation}
            </p>
            {module && (
              <Link
                href={`/trilha/${module.id}`}
                className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                Vinculado ao módulo: {module.title}
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditable && (
              <>
                <Button size="sm" variant="secondary" onClick={resetDiagram} icon={<RotateCcw size={14} />}>
                  Reiniciar
                </Button>
                <Button size="sm" onClick={runValidation} icon={<Target size={14} />}>
                  Verificar
                </Button>
              </>
            )}
            {challenge.mode === "simulate" && (
              <Button size="sm" onClick={runSimulation} icon={<Play size={14} />}>
                {simState ? "Reiniciar simulação" : "Iniciar simulação"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Abas mobile ---------- */}
      {isEditable && (
        <div className="mt-4 lg:hidden">
          <Tabs
            active={mobileTab}
            onChange={(id) => setMobileTab(id as typeof mobileTab)}
            tabs={[
              { id: "palette", label: "Símbolos", icon: <Shapes size={14} /> },
              { id: "canvas", label: "Canvas", icon: <MousePointerClick size={14} /> },
              { id: "panel", label: "Validação", icon: <Target size={14} /> },
            ]}
          />
        </div>
      )}

      {/* ---------- Corpo ---------- */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_320px]">
        {/* Paleta */}
        {isEditable && (
          <aside
            className={cn(
              "min-h-[420px] rounded-xl border border-line bg-surface-raised p-3",
              mobileTab !== "palette" && "hidden lg:flex lg:flex-col"
            )}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Paleta de símbolos
            </p>
            <SymbolPalette
              onPick={handlePickSymbol}
              edgeType={edgeType}
              onPickConnection={(type) => setEdgeType(type)}
              className="min-h-[380px]"
            />
          </aside>
        )}

        {/* Canvas */}
        <div
          className={cn(
            "min-w-0",
            isEditable && mobileTab !== "canvas" && "hidden lg:block"
          )}
        >
          {challenge.mode === "identify" ? (
            <IdentifyCanvas
              challenge={challenge}
              answers={identifyAnswers}
              onNodeClick={handleNodeClick}
            />
          ) : challenge.mode === "simulate" ? (
            <SimulateCanvas
              challenge={challenge}
              state={simState}
              onAnswer={answerSim}
            />
          ) : (
            <div className="relative">
              <DiagramView
                diagram={diagram}
                interactive
                height={560}
                showMiniMap
                selectedEdgeId={selectedEdgeId ?? undefined}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={handleConnect}
                onNodeClick={handleNodeClick}
                onEdgeClick={(id) => {
                  setSelectedEdgeId(id);
                  setSelectedNodeId(null);
                  const edge = diagram.edges.find((e) => e.id === id);
                  if (edge) setEdgeType(edge.type);
                }}
              />

              {/* Barra de elemento selecionado */}
              {(selectedNodeId || selectedEdgeId) && (
                <div className="absolute left-3 top-3 z-10 w-72 rounded-xl border border-line bg-surface-raised/95 p-3.5 shadow-pop backdrop-blur">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                      {selectedNodeId ? "Elemento" : "Conexão"}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedNodeId(null);
                        setSelectedEdgeId(null);
                      }}
                      aria-label="Fechar"
                      className="rounded p-1 text-ink-subtle hover:text-ink"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {selectedNodeId &&
                    (() => {
                      const node = diagram.nodes.find(
                        (n) => n.id === selectedNodeId
                      );
                      if (!node) return null;
                      return (
                        <div className="mt-2 space-y-2.5">
                          <div>
                            <label className="mb-1 block text-xs text-ink-muted">
                              Rótulo
                            </label>
                            <input
                              value={node.data.label ?? ""}
                              onChange={(e) => updateNodeLabel(e.target.value)}
                              placeholder="Descreva a etapa…"
                              className="h-9 w-full rounded-lg border border-line bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-400 focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-surface-sunk px-3 py-2">
                            <span className="text-xs text-ink-muted">
                              Tipo: <span className="font-medium text-ink">{node.kind}</span>
                            </span>
                            <button
                              onClick={deleteSelected}
                              className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                            >
                              <Trash2 size={13} /> Remover
                            </button>
                          </div>
                          <p className="text-[11px] leading-snug text-ink-subtle">
                            Arraste o elemento para reposicionar. Para conectar,
                            arraste do ponto à direita até o ponto à esquerda do
                            próximo elemento.
                          </p>
                        </div>
                      );
                    })()}

                  {selectedEdgeId &&
                    (() => {
                      const edge = diagram.edges.find(
                        (e) => e.id === selectedEdgeId
                      );
                      if (!edge) return null;
                      return (
                        <div className="mt-2 space-y-2.5">
                          <div>
                            <label className="mb-1 block text-xs text-ink-muted">
                              Tipo de conexão
                            </label>
                            <div className="flex gap-1.5">
                              {(
                                [
                                  ["sequence", "Sequência"],
                                  ["message", "Mensagem"],
                                  ["association", "Associação"],
                                ] as const
                              ).map(([type, label]) => (
                                <button
                                  key={type}
                                  onClick={() => changeEdgeType(type)}
                                  className={cn(
                                    "flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition",
                                    edge.type === type
                                      ? "border-brand-400 bg-brand-600 text-white"
                                      : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
                                  )}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-ink-muted">
                              Rótulo da condição
                            </label>
                            <input
                              value={edge.label ?? ""}
                              onChange={(e) => updateEdgeLabel(e.target.value)}
                              placeholder="Ex.: Sim, Não, Valor alto…"
                              className="h-9 w-full rounded-lg border border-line bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-400 focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-surface-sunk px-3 py-2">
                            <span className="text-xs text-ink-muted">
                              Origem → destino
                            </span>
                            <button
                              onClick={deleteSelected}
                              className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                            >
                              <Trash2 size={13} /> Remover
                            </button>
                          </div>
                          <p className="text-[11px] leading-snug text-ink-subtle">
                            Sequência só dentro da mesma pool. Entre pools
                            diferentes, use fluxo de mensagem.
                          </p>
                        </div>
                      );
                    })()}
                </div>
              )}
            </div>
          )}

          {/* Dica de canvas vazio */}
          {isEditable && diagram.nodes.length === 0 && (
            <div className="mt-3 rounded-xl border border-dashed border-line bg-surface-raised px-4 py-3 text-center text-xs leading-relaxed text-ink-subtle">
              {challenge.mode === "build"
                ? "Comece escolhendo símbolos na paleta. Adicione um evento de início, as atividades e os eventos de fim — depois conecte-os arrastando entre os pontos."
                : "Use a paleta para adicionar os elementos que faltam ao diagrama."}
            </div>
          )}
        </div>

        {/* Painel lateral */}
        <aside
          className={cn(
            "min-w-0 space-y-4",
            isEditable && mobileTab !== "panel" && "hidden lg:block"
          )}
        >
          {isEditable ? (
            <Card className="p-4">
              <ValidationPanel
                result={result}
                onValidate={runValidation}
                success={success}
                successMessage={challenge.feedback.success}
                hints={challenge.feedback.hints}
                showHints={showHints}
                onToggleHints={() => setShowHints((v) => !v)}
                expectedIssueCodes={challenge.expectedIssueCodes}
              />
            </Card>
          ) : null}

          {/* Objetivo do desafio */}
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Info size={15} className="text-brand-600 dark:text-brand-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Objetivo
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {CHALLENGE_MODES[challenge.mode].description}
            </p>
            {challenge.requiredSymbols && challenge.mode === "build" && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-xs font-semibold text-ink">
                  Símbolos esperados
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {challenge.requiredSymbols.map((id) => (
                    <span
                      key={id}
                      className="rounded-full bg-surface-sunk px-2 py-0.5 text-[11px] text-ink-muted"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {challenge.knownIssues && challenge.mode === "fix" && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-xs font-semibold text-ink">
                  Problemas relatados ({challenge.knownIssues.length})
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {challenge.knownIssues.map((issue) => (
                    <li
                      key={issue.id}
                      className="rounded-lg bg-surface-sunk px-3 py-2 text-xs leading-relaxed text-ink-muted"
                    >
                      <span className="font-medium text-ink">{issue.title}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] leading-snug text-ink-subtle">
                  O desafio é considerado resolvido quando nenhum desses problemas
                  persiste e nenhum novo erro aparece.
                </p>
              </div>
            )}
          </Card>

          {/* Progresso da identificação */}
          {challenge.mode === "identify" && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  Progresso
                </p>
                <span className="text-sm font-semibold text-ink">
                  {answeredCount}/{identifyQuestions.length}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-sunk">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{
                    width: `${
                      identifyQuestions.length
                        ? (answeredCount / identifyQuestions.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Clique nos elementos destacados do diagrama e escolha o símbolo
                correto.
              </p>
            </Card>
          )}

          {/* Resumo da simulação */}
          {challenge.mode === "simulate" && simState && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  Percurso
                </p>
                <span className="text-xs text-ink-subtle">
                  {simState.visitedNodes.length} elementos
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {simulationSummary(simState)}
              </p>
              {simState.log.length > 0 && (
                <div className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-surface-sunk p-3">
                  <ol className="space-y-1">
                    {simState.log.map((line, i) => (
                      <li key={i} className="text-xs text-ink-muted">
                        <span className="mr-1.5 font-semibold text-ink-subtle">
                          {i + 1}.
                        </span>
                        {line}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {simState.finished && (
                <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <Trophy size={13} className="mr-1 inline align-[-2px]" />
                  {simState.outcome}
                </div>
              )}
            </Card>
          )}
        </aside>
      </div>

      {/* ---------- Modal de identificação ---------- */}
      <IdentifyModal
        challenge={challenge}
        nodeId={activeQuestion}
        answer={activeQuestion ? identifyAnswers[activeQuestion] : undefined}
        onClose={() => setActiveQuestion(null)}
        onAnswer={(nodeId, optionId) => {
          setIdentifyAnswers((prev) => ({ ...prev, [nodeId]: optionId }));
          setActiveQuestion(null);
        }}
      />

      {/* ---------- Toast ---------- */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-raised px-5 py-3.5 shadow-pop">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Trophy size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Desafio concluído · {toast.score}/100
              </p>
              <p className="text-xs text-ink-muted">
                {toast.xp > 0
                  ? `+${toast.xp} XP adicionado ao seu progresso`
                  : "XP já contabilizado anteriormente"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modo: identificação                                                  */
/* ------------------------------------------------------------------ */

function IdentifyCanvas({
  challenge,
  answers,
  onNodeClick,
}: {
  challenge: Challenge;
  answers: Record<string, string>;
  onNodeClick: (node: BpmnNode) => void;
}) {
  const badges: Record<string, string> = {};
  const highlight: string[] = [];
  (challenge.identifyQuestions ?? []).forEach((q, i) => {
    badges[q.nodeId] = String(i + 1);
    highlight.push(q.nodeId);
  });

  return (
    <div>
      <DiagramView
        diagram={challenge.identifyDiagram ?? { nodes: [], edges: [] }}
        highlightNodeIds={highlight}
        badges={badges}
        height={560}
        showMiniMap
        onNodeClick={onNodeClick}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(challenge.identifyQuestions ?? []).map((q, i) => {
          const answered = answers[q.nodeId];
          const correct = answered === q.correctOptionId;
          return (
            <button
              key={q.nodeId}
              onClick={() => onNodeClick({ id: q.nodeId } as BpmnNode)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                answered
                  ? correct
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                  : "border-line bg-surface-raised text-ink-muted hover:border-brand-400"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  answered
                    ? correct
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                    : "bg-surface-sunk text-ink-subtle"
                )}
              >
                {answered && correct ? <Check size={11} /> : i + 1}
              </span>
              {answered ? (correct ? "Correto" : "Rever") : "Responder"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IdentifyModal({
  challenge,
  nodeId,
  answer,
  onClose,
  onAnswer,
}: {
  challenge: Challenge;
  nodeId: string | null;
  answer?: string;
  onClose: () => void;
  onAnswer: (nodeId: string, optionId: string) => void;
}) {
  const question = challenge.identifyQuestions?.find((q) => q.nodeId === nodeId);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(answer ?? null);
    setRevealed(!!answer);
  }, [nodeId, answer]);

  if (!question || !nodeId) return null;

  const node = challenge.identifyDiagram?.nodes.find((n) => n.id === nodeId);

  const confirm = () => {
    if (!selected) return;
    setRevealed(true);
    onAnswer(nodeId, selected);
  };

  return (
    <Modal open onClose={onClose} title={question.question}>
      <div className="space-y-4">
        {node && (
          <div className="rounded-xl border border-line bg-surface-sunk p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Elemento selecionado
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {node.data.label ?? node.id}
            </p>
            <div className="mt-3 flex justify-center">
              <span className="flex h-20 w-24 items-center justify-center rounded-lg bg-surface-raised">
                <ElementPreview kind={node.kind} data={node.data} />
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const optionId = String.fromCharCode(97 + i);
            const isSelected = selected === optionId;
            const isCorrect = optionId === question.correctOptionId;
            return (
              <button
                key={optionId}
                onClick={() => {
                  if (revealed) return;
                  setSelected(optionId);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  revealed
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                      : isSelected
                        ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30"
                        : "border-line bg-surface-raised"
                    : isSelected
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30"
                      : "border-line bg-surface-raised hover:border-brand-300"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    revealed && isCorrect
                      ? "bg-emerald-500 text-white"
                      : revealed && isSelected
                        ? "bg-rose-500 text-white"
                        : isSelected
                          ? "bg-brand-600 text-white"
                          : "bg-surface-sunk text-ink-subtle"
                  )}
                >
                  {revealed && isCorrect ? (
                    <Check size={13} />
                  ) : (
                    optionId.toUpperCase()
                  )}
                </span>
                <span className="flex-1 text-ink">{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div
            className={cn(
              "rounded-xl border p-4 text-sm leading-relaxed",
              selected === question.correctOptionId
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
            )}
          >
            <p className="font-semibold">
              {selected === question.correctOptionId
                ? "Resposta correta!"
                : "Resposta incorreta."}
            </p>
            <p className="mt-1 opacity-90">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          {!revealed && (
            <Button onClick={confirm} disabled={!selected} icon={<Check size={16} />}>
              Confirmar resposta
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function ElementPreview({
  kind,
  data,
}: {
  kind: string;
  data: { label?: string; gateway?: string; marker?: string; taskType?: string; phase?: string };
}) {
  const color =
    kind === "start" || kind === "end" || kind === "intermediate"
      ? "#0284c7"
      : kind === "gateway"
        ? "#d97706"
        : "#059669";

  if (kind === "gateway") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <path
          d="M22 4 40 22 22 40 4 22Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        {data.gateway === "parallel" && (
          <path d="M22 13v18M13 22h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
        )}
        {data.gateway === "exclusive" && (
          <path
            d="M16 16l12 12M28 16L16 28"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {data.gateway === "inclusive" && (
          <circle cx="22" cy="22" r="7" fill="none" stroke={color} strokeWidth="2" />
        )}
        {data.gateway === "eventBased" && (
          <>
            <circle cx="22" cy="22" r="7" fill="none" stroke={color} strokeWidth="2" />
            <path
              d="M22 15l6 5-2 7h-8l-2-7z"
              fill="none"
              stroke={color}
              strokeWidth="1.6"
            />
          </>
        )}
        {(!data.gateway || data.gateway === "complex") && (
          <path
            d="M22 15v14M15 22h14M17 17l10 10M27 17L17 27"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

  if (kind === "task" || kind === "subProcess" || kind === "callActivity") {
    return (
      <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden>
        <rect
          x="2"
          y="4"
          width="60"
          height="32"
          rx="5"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        {data.taskType === "user" && (
          <>
            <circle cx="13" cy="15" r="3.2" fill="none" stroke={color} strokeWidth="1.6" />
            <path d="M8.5 24c1-3 2.6-4.4 4.5-4.4S16.5 21 17.5 24" fill="none" stroke={color} strokeWidth="1.6" />
          </>
        )}
        {data.taskType === "service" && (
          <path
            d="M13 12.5l1.4 1.4 2.4-.6.6 2.4 1.9 1.1-1.1 1.9 1.1 1.9-1.9 1.1-.6 2.4-2.4-.6L13 24.8l-1.4-1.4-2.4.6-.6-2.4-1.9-1.1 1.1-1.9L6.5 16.7l1.9-1.1.6-2.4 2.4.6z"
            fill="none"
            stroke={color}
            strokeWidth="1.4"
          />
        )}
        {data.taskType === "manual" && (
          <path
            d="M9 24v-6a1.6 1.6 0 013.2 0v-5a1.6 1.6 0 013.2 0v4a1.6 1.6 0 013.2 0v6.5c0 2-1.6 3.5-4 3.5H12c-1.8 0-3-1.2-3-3z"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        )}
        {data.taskType === "send" && (
          <>
            <rect x="7" y="14" width="13" height="9" rx="1.5" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M21 16l6-3v13l-6-3" fill="none" stroke={color} strokeWidth="1.5" />
          </>
        )}
        {data.taskType === "receive" && (
          <>
            <rect x="14" y="14" width="13" height="9" rx="1.5" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M12 16l6-3v13l-6-3" fill="none" stroke={color} strokeWidth="1.5" />
          </>
        )}
        {data.taskType === "script" && (
          <>
            <path d="M8 11h9l4 4v14H8z" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M17 11v4h4M11 20h6M11 23.5h6" fill="none" stroke={color} strokeWidth="1.3" />
          </>
        )}
        {kind === "subProcess" && (
          <rect x="27" y="31" width="10" height="6" rx="1" fill="none" stroke={color} strokeWidth="1.3" />
        )}
      </svg>
    );
  }

  if (kind === "pool" || kind === "lane") {
    return (
      <svg width="70" height="40" viewBox="0 0 70 40" aria-hidden>
        <rect x="3" y="4" width="64" height="32" fill="none" stroke={color} strokeWidth="2" />
        <path d="M17 4v32" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "dataObject") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <path d="M8 6h20l8 8v24H8z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M28 6v8h8" fill="none" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "dataStore") {
    return (
      <svg width="48" height="44" viewBox="0 0 48 44" aria-hidden>
        <ellipse cx="24" cy="10" rx="15" ry="5" fill="none" stroke={color} strokeWidth="2" />
        <path d="M9 10v24c0 2.8 6.7 5 15 5s15-2.2 15-5V10" fill="none" stroke={color} strokeWidth="2" />
        <path d="M9 22c0 2.8 6.7 5 15 5s15-2.2 15-5" fill="none" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (kind === "annotation") {
    return (
      <svg width="70" height="44" viewBox="0 0 70 44" aria-hidden>
        <path d="M14 6H6v32h8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M20 14h42M20 22h42M20 30h30" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  const isEnd = kind === "end";
  const isInter = kind === "intermediate";
  const marker = data.marker;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth={isEnd ? 6 : isInter ? 2.5 : 2.5}
      />
      {isInter && (
        <circle cx="24" cy="24" r="14" fill="none" stroke={color} strokeWidth="1.5" />
      )}
      {marker === "message" && (
        <>
          <rect x="16" y="19" width="16" height="11" rx="1" fill="none" stroke={color} strokeWidth="1.6" />
          <path d="M16 20l8 6 8-6" fill="none" stroke={color} strokeWidth="1.6" />
        </>
      )}
      {marker === "timer" && (
        <>
          <circle cx="24" cy="24" r="9" fill="none" stroke={color} strokeWidth="1.6" />
          <path d="M24 18v6l4 3" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {marker === "signal" && (
        <path d="M24 15l10 17H14z" fill="none" stroke={color} strokeWidth="1.8" />
      )}
      {marker === "error" && (
        <path
          d="M27 15l-9 12h6l-3 8 9-12h-6z"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
        />
      )}
      {marker === "terminate" && <circle cx="24" cy="24" r="9" fill={color} />}
      {marker === "escalation" && (
        <path d="M17 30l7-14 3 7 4-4" fill="none" stroke={color} strokeWidth="1.8" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Modo: simulação                                                      */
/* ------------------------------------------------------------------ */

function SimulateCanvas({
  challenge,
  state,
  onAnswer,
}: {
  challenge: Challenge;
  state: SimulationState | null;
  onAnswer: (edgeId: string) => void;
}) {
  const highlight = state?.visitedNodes ?? [];
  const current = state?.currentNodeId;

  return (
    <div>
      <DiagramView
        diagram={challenge.solution ?? { nodes: [], edges: [] }}
        highlightNodeIds={current ? [...highlight, current] : highlight}
        badges={
          state?.currentNodeId ? { [state.currentNodeId]: "▶" } : undefined
        }
        height={520}
        showMiniMap
      />

      <div className="mt-3 rounded-xl border border-line bg-surface-raised p-4">
        {!state && (
          <p className="text-sm text-ink-muted">
            Clique em <span className="font-medium text-ink">Iniciar simulação</span>{" "}
            para executar o fluxo. O token percorrerá as atividades e pausará nas
            decisões para você escolher o caminho.
          </p>
        )}

        {state && state.error && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{state.error}</p>
        )}

        {state && state.pendingDecision && (
          <div>
            <p className="text-sm font-semibold text-ink">
              {state.pendingDecision.question}
            </p>
            <div className="mt-2.5 space-y-2">
              {state.pendingDecision.options.map((opt) => (
                <button
                  key={opt.edgeId}
                  onClick={() => onAnswer(opt.edgeId)}
                  className="w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 text-left text-sm font-medium text-ink transition hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30"
                >
                  {opt.label}
                  {opt.outcome && (
                    <span className="mt-0.5 block text-xs font-normal text-ink-subtle">
                      {opt.outcome}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {state && state.finished && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Simulação concluída</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                {state.outcome}
              </p>
            </div>
          </div>
        )}

        {state && !state.finished && !state.pendingDecision && !state.error && (
          <p className="text-sm text-ink-muted">Executando o fluxo…</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auxiliares                                                          */
/* ------------------------------------------------------------------ */

function clone(diagram: BpmnDiagram): BpmnDiagram {
  return JSON.parse(JSON.stringify(diagram)) as BpmnDiagram;
}

function toFlowEdges(diagram: BpmnDiagram): Edge[] {
  return diagram.edges.map((e) => {
    const dashed =
      e.type === "message"
        ? "edge-message"
        : e.type === "association"
          ? "edge-association"
          : "edge-sequence";
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      label: e.label,
      className: dashed,
    } satisfies Edge;
  });
}

function edgeFromFlow(edge: Edge): BpmnEdge {
  const className = edge.className ?? "";
  const type: EdgeKind = className.includes("message")
    ? "message"
    : className.includes("association")
      ? "association"
      : "sequence";
  const label = typeof edge.label === "string" ? edge.label : undefined;
  return label
    ? { id: edge.id, source: edge.source, target: edge.target, type, label }
    : { id: edge.id, source: edge.source, target: edge.target, type };
}

/** Converte um símbolo da paleta em um nó do diagrama. */
function nodeFromSymbol(symbol: BpmnSymbol, diagram: BpmnDiagram): BpmnNode {
  const count = diagram.nodes.length;
  const col = count % 4;
  const row = Math.floor(count / 4) % ROW_Y.length;
  const rightEdge = diagram.nodes.reduce(
    (max, n) => Math.max(max, n.x + (n.width ?? 60)),
    0
  );
  const x = count < 4 ? 80 + col * 240 : Math.max(80, rightEdge + 120);
  const y = count < 4 ? ROW_Y[0] - 32 : ROW_Y[row] - 32;

  const id = `n-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  const render = symbol.render;

  switch (render.kind) {
    case "event":
      return {
        id,
        kind: render.phase,
        x,
        y,
        data: {
          phase: render.phase,
          ...(render.marker ? { marker: render.marker } : {}),
        },
      };
    case "task":
      return {
        id,
        kind: "task",
        x,
        y,
        width: 160,
        height: 64,
        data: { taskType: render.taskType ?? "none" },
      };
    case "activity": {
      const kind: NodeKind =
        render.activity === "subProcess"
          ? "subProcess"
          : render.activity === "expandedSubProcess"
            ? "expandedSubProcess"
            : render.activity === "callActivity"
              ? "callActivity"
              : "task";
      return {
        id,
        kind,
        x,
        y,
        width: kind === "expandedSubProcess" ? 220 : 160,
        height: kind === "expandedSubProcess" ? 120 : 64,
        data: {
          activity: render.activity,
          ...(render.taskType ? { taskType: render.taskType } : {}),
        },
      };
    }
    case "gateway":
      return {
        id,
        kind: "gateway",
        x,
        y,
        width: 52,
        height: 52,
        data: { gateway: render.gateway },
      };
    case "structure": {
      if (render.structure === "pool") {
        return {
          id,
          kind: "pool",
          x,
          y,
          width: 760,
          height: 240,
          data: { poolName: "Nova pool" },
        };
      }
      if (render.structure === "lane") {
        return {
          id,
          kind: "lane",
          x,
          y,
          width: 700,
          height: 120,
          data: { laneName: "Nova raia" },
        };
      }
      if (render.structure === "milestone") {
        return {
          id,
          kind: "intermediate",
          x,
          y,
          data: { phase: "intermediate" },
        };
      }
      return {
        id,
        kind: "pool",
        x,
        y,
        width: 500,
        height: 140,
        data: { poolName: "Participante" },
      };
    }
    case "artifact": {
      const kind: NodeKind =
        render.artifact === "dataObject"
          ? "dataObject"
          : render.artifact === "dataStore"
            ? "dataStore"
            : render.artifact === "group"
              ? "group"
              : "annotation";
      const sizes: Partial<Record<NodeKind, { w: number; h: number }>> = {
        dataObject: { w: 48, h: 40 },
        dataStore: { w: 48, h: 48 },
        group: { w: 320, h: 200 },
        annotation: { w: 170, h: 46 },
      };
      const size = sizes[kind] ?? { w: 60, h: 60 };
      return {
        id,
        kind,
        x,
        y,
        width: size.w,
        height: size.h,
        data: {
          artifactKind: render.artifact,
          ...(render.artifact === "group"
            ? { label: "Novo grupo" }
            : render.artifact === "textAnnotation"
              ? { label: "Anotação" }
              : {}),
        },
      };
    }
    case "connection":
    default:
      return {
        id,
        kind: "task",
        x,
        y,
        width: 160,
        height: 64,
        data: { taskType: "none" },
      };
  }
}
