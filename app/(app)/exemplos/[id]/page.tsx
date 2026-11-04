"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  MessageSquare,
  Play,
  RotateCcw,
  Square,
  Target,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, SectionHeader } from "@/components/ui";
import { DiagramView } from "@/components/bpmn/DiagramView";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { processExamples } from "@/data/examples";
import { bpmnSymbols } from "@/data/symbols";
import { startSimulation, answerSimulation, simulationSummary } from "@/lib/simulation";
import type { SimulationState } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import type { BpmnDiagram } from "@/types";

const DIFFICULTY_LABEL = {
  facil: "Fácil",
  medio: "Médio",
  avancado: "Avançado",
} as const;

const DIFFICULTY_TONE = {
  facil: "success",
  medio: "warning",
  avancado: "danger",
} as const;

export default function ExemploDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const example = processExamples.find((ex) => ex.id === id);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [simState, setSimState] = useState<SimulationState | null>(null);

  const activeHighlight = useMemo(() => {
    if (simState && (simState.visitedNodes.length > 0 || simState.currentNodeId)) {
      return {
        highlight: [
          ...(simState.currentNodeId ? [simState.currentNodeId] : []),
          ...simState.visitedNodes,
        ],
        diagram: example?.diagram as BpmnDiagram,
      };
    }
    if (stepIndex !== null && example) {
      const step = example.steps[stepIndex];
      return { highlight: step?.nodeIds ?? [], diagram: example.diagram };
    }
    return { highlight: [] as string[], diagram: example?.diagram as BpmnDiagram };
  }, [stepIndex, simState, example]);

  if (!example) {
    return (
      <div className="mx-auto max-w-3xl animate-fade-up">
        <Card className="p-8 text-center">
          <h1 className="text-lg font-semibold text-ink">Exemplo não encontrado</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Este processo não existe ou foi removido.
          </p>
          <Button href="/exemplos" className="mt-4" icon={<ArrowLeft size={16} />}>
            Voltar para os exemplos
          </Button>
        </Card>
      </div>
    );
  }

  const startSim = () => {
    if (!example.simulation) return;
    setStepIndex(null);
    setSimState(startSimulation(example.diagram, example.simulation));
  };

  const resetSim = () => setSimState(null);

  const answer = (edgeId: string) => {
    if (!simState || !example.simulation) return;
    setSimState(answerSimulation(example.diagram, example.simulation, simState, edgeId));
  };

  const symbols = example.symbolsUsed
    .map((sid) => bpmnSymbols.find((s) => s.id === sid))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl animate-fade-up">
      <Link
        href="/exemplos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} />
        Exemplos de processos
      </Link>

      {/* ---------- Cabeçalho ---------- */}
      <div className="rounded-2xl border border-line bg-surface-raised p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{example.category}</Badge>
          <Badge tone={DIFFICULTY_TONE[example.difficulty]}>
            {DIFFICULTY_LABEL[example.difficulty]}
          </Badge>
          <span className="text-xs text-ink-subtle">
            {example.steps.length} etapas · {example.diagram.nodes.length} elementos
          </span>
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {example.title}
        </h1>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-surface-sunk p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Problema
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {example.problem}
            </p>
          </div>
          <div className="rounded-xl bg-surface-sunk p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Cenário
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {example.scenario}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* ---------- Diagrama ---------- */}
        <div className="min-w-0 space-y-4">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <ListOrdered size={16} className="text-brand-600 dark:text-brand-400" />
                <span className="text-sm font-semibold text-ink">
                  {simState
                    ? "Simulação em execução"
                    : stepIndex !== null
                      ? `Etapa ${stepIndex + 1} de ${example.steps.length}`
                      : "Diagrama completo"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {example.simulation && !simState && (
                  <Button size="sm" onClick={startSim} icon={<Play size={14} />}>
                    Simular
                  </Button>
                )}
                {simState && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={resetSim}
                    icon={<RotateCcw size={14} />}
                  >
                    Reiniciar
                  </Button>
                )}
                {!simState && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={stepIndex === null || stepIndex === 0}
                      onClick={() => setStepIndex((i) => (i ?? 0) - 1)}
                      icon={<ChevronLeft size={14} />}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant={stepIndex === null ? "secondary" : "primary"}
                      disabled={stepIndex !== null && stepIndex >= example.steps.length - 1}
                      onClick={() =>
                        setStepIndex((i) =>
                          i === null ? 0 : Math.min(i + 1, example.steps.length - 1)
                        )
                      }
                      icon={<ArrowRight size={14} />}
                    >
                      {stepIndex === null ? "Passo a passo" : "Próxima etapa"}
                    </Button>
                    {stepIndex !== null && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setStepIndex(null)}
                        icon={<Square size={14} />}
                      >
                        Ver tudo
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-3">
              <DiagramView
                diagram={activeHighlight.diagram}
                highlightNodeIds={activeHighlight.highlight}
                height={460}
                showMiniMap
                fitViewPadding={0.18}
              />
            </div>

            {/* Barra de simulação */}
            {simState && (
              <div className="border-t border-line bg-surface-sunk px-4 py-3">
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      simState.finished
                        ? "bg-emerald-500 text-white"
                        : simState.error
                          ? "bg-rose-500 text-white"
                          : simState.pendingDecision
                            ? "bg-amber-500 text-white"
                            : "bg-brand-600 text-white"
                    )}
                  >
                    {simState.finished ? (
                      <Check size={16} />
                    ) : simState.error ? (
                      <Square size={16} />
                    ) : (
                      <Play size={14} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {simulationSummary(simState)}
                    </p>
                    {simState.log.length > 0 && (
                      <p className="mt-1 truncate text-xs text-ink-subtle">
                        {simState.log.join(" → ")}
                      </p>
                    )}
                  </div>
                </div>

                {simState.pendingDecision && (
                  <div className="mt-3 space-y-2">
                    {simState.pendingDecision.options.map((opt) => (
                      <button
                        key={opt.edgeId}
                        onClick={() => answer(opt.edgeId)}
                        className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-left text-sm font-medium text-ink transition hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Passo a passo atual */}
          {stepIndex !== null && !simState && (
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  Etapa {stepIndex + 1} de {example.steps.length}
                </p>
                <div className="flex gap-1">
                  {example.steps.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === stepIndex
                          ? "w-5 bg-brand-600"
                          : i < stepIndex
                            ? "w-1.5 bg-brand-400"
                            : "w-1.5 bg-surface-sunk"
                      )}
                    />
                  ))}
                </div>
              </div>
              <h2 className="mt-2 text-base font-semibold text-ink">
                {example.steps[stepIndex].title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {example.steps[stepIndex].text}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={stepIndex === 0}
                  onClick={() => setStepIndex((i) => (i ?? 0) - 1)}
                  icon={<ChevronLeft size={14} />}
                >
                  Etapa anterior
                </Button>
                <Button
                  size="sm"
                  disabled={stepIndex >= example.steps.length - 1}
                  onClick={() =>
                    setStepIndex((i) =>
                      Math.min((i ?? 0) + 1, example.steps.length - 1)
                    )
                  }
                  icon={<ChevronRight size={14} />}
                >
                  Próxima etapa
                </Button>
              </div>
            </Card>
          )}

          {/* ---------- Passos (lista completa) ---------- */}
          <Card className="p-5">
            <h2 className="text-base font-semibold text-ink">
              Passo a passo do processo
            </h2>
            <ol className="mt-3 space-y-3">
              {example.steps.map((step, i) => (
                <li key={step.index}>
                  <button
                    onClick={() => {
                      setSimState(null);
                      setStepIndex(i);
                    }}
                    className={cn(
                      "flex w-full gap-3 rounded-xl border p-4 text-left transition",
                      stepIndex === i
                        ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30"
                        : "border-line bg-surface-raised hover:border-brand-300"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        stepIndex === i
                          ? "bg-brand-600 text-white"
                          : "bg-surface-sunk text-ink-subtle"
                      )}
                    >
                      {step.index}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">
                        {step.text}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* ---------- Coluna lateral ---------- */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Decisões */}
          {example.decisions.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-semibold text-ink">
                  Por que este gateway?
                </h2>
              </div>
              <div className="mt-3 space-y-3">
                {example.decisions.map((dec) => (
                  <div
                    key={dec.node}
                    className="rounded-lg border border-line bg-surface-sunk p-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                      Elemento: {dec.node}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {dec.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Símbolos usados */}
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-brand-600 dark:text-brand-400" />
              <h2 className="text-sm font-semibold text-ink">
                Símbolos utilizados
              </h2>
            </div>
            <div className="mt-3 space-y-2">
              {symbols.map(
                (symbol) =>
                  symbol && (
                    <div
                      key={symbol.id}
                      className="flex items-center gap-3 rounded-lg border border-line bg-surface-raised px-3 py-2"
                    >
                      <span className="flex h-9 w-11 flex-shrink-0 items-center justify-center rounded bg-surface-sunk">
                        <BpmnSymbolGlyph
                          render={symbol.render}
                          label={symbol.namePt}
                          fit={SYMBOL_BOX.micro}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">
                          {symbol.namePt}
                        </span>
                        <span className="block truncate text-xs text-ink-subtle">
                          {symbol.nameEn}
                        </span>
                      </span>
                      <Link
                        href="/simbolos"
                        className="flex-shrink-0 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                      >
                        Ver
                      </Link>
                    </div>
                  )
              )}
            </div>
          </Card>

          {/* CTA laboratório */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink">Pratique agora</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Monte um processo similar no laboratório e valide com o motor de
              checagem da plataforma.
            </p>
            <Button href="/laboratorio" className="mt-3 w-full" size="sm">
              Abrir laboratório
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
