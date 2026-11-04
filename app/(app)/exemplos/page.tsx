"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Workflow } from "lucide-react";
import { Badge, Card, EmptyState, SectionHeader } from "@/components/ui";
import { processExamples } from "@/data/examples";
import { bpmnSymbols } from "@/data/symbols";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { cn } from "@/lib/utils";
import type { ProcessExample } from "@/types";

const DIFFICULTY_LABEL: Record<ProcessExample["difficulty"], string> = {
  facil: "Fácil",
  medio: "Médio",
  avancado: "Avançado",
};

const DIFFICULTY_TONE: Record<
  ProcessExample["difficulty"],
  "success" | "warning" | "danger"
> = {
  facil: "success",
  medio: "warning",
  avancado: "danger",
};

export default function ExemplosPage() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<
    ProcessExample["difficulty"] | "all"
  >("all");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(
    () => [...new Set(processExamples.map((ex) => ex.category))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return processExamples.filter((ex) => {
      if (difficulty !== "all" && ex.difficulty !== difficulty) return false;
      if (category !== "all" && ex.category !== category) return false;
      if (!q) return true;
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.problem.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q)
      );
    });
  }, [query, difficulty, category]);

  return (
    <div className="mx-auto max-w-6xl animate-fade-up">
      <SectionHeader
        eyebrow="Conteúdo"
        title="Exemplos de processos"
        description={`${processExamples.length} processos completos, cada um com situação-problema, diagrama, passo a passo comentado, justificativa das decisões e simulação.`}
      />

      {/* ---------- Filtros ---------- */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por título, problema ou área…"
            className="h-11 w-full rounded-xl border border-line bg-surface-raised pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
          <Chip active={difficulty === "all"} onClick={() => setDifficulty("all")}>
            Todas as dificuldades
          </Chip>
          {(["facil", "medio", "avancado"] as const).map((d) => (
            <Chip
              key={d}
              active={difficulty === d}
              onClick={() => setDifficulty(d)}
            >
              {DIFFICULTY_LABEL[d]}
            </Chip>
          ))}
          <span className="mx-1 w-px flex-shrink-0 bg-line" />
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            Todas as áreas
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* ---------- Grade ---------- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="Nenhum exemplo encontrado"
          description="Ajuste a pesquisa ou remova os filtros aplicados."
          action={
            <button
              onClick={() => {
                setQuery("");
                setDifficulty("all");
                setCategory("all");
              }}
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Limpar filtros
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((ex) => {
            const previewNodes = ex.diagram.nodes
              .filter((n) =>
                ["start", "task", "gateway", "end"].includes(n.kind)
              )
              .slice(0, 7);
            const symbolSet = [...new Set(ex.symbolsUsed)].slice(0, 8);

            return (
              <Link key={ex.id} href={`/exemplos/${ex.id}`}>
                <Card hover className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">{ex.category}</Badge>
                        <Badge tone={DIFFICULTY_TONE[ex.difficulty]}>
                          {DIFFICULTY_LABEL[ex.difficulty]}
                        </Badge>
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-ink">
                        {ex.title}
                      </h2>
                    </div>
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-sunk text-brand-600 dark:text-brand-400">
                      <Workflow size={18} />
                    </span>
                  </div>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {ex.problem}
                  </p>

                  {/* Mini pré-visualização */}
                  <div className="mt-3 flex gap-1.5 overflow-hidden rounded-lg bg-surface-sunk px-3 py-2">
                    {previewNodes.map((node) => (
                      <span
                        key={node.id}
                        className="flex h-7 w-8 flex-shrink-0 items-center justify-center"
                        title={node.data.label ?? node.kind}
                      >
                        <MiniGlyph kind={node.kind} data={node.data} />
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                    <div className="flex min-w-0 gap-1.5">
                      {symbolSet.map((id) => {
                        const symbol = bpmnSymbols.find((s) => s.id === id);
                        if (!symbol) return null;
                        return (
                          <span
                            key={id}
                            title={symbol.namePt}
                            className="flex h-9 w-11 min-w-0 items-center justify-center rounded bg-surface-raised"
                          >
                            <BpmnSymbolGlyph
                              render={symbol.render}
                              label={symbol.namePt}
                              fit={SYMBOL_BOX.micro}
                            />
                          </span>
                        );
                      })}
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                      Ver processo <ArrowRight size={15} />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 flex-shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition",
        active
          ? "border-brand-400 bg-brand-600 text-white"
          : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
      )}
    >
      {children}
    </button>
  );
}

function MiniGlyph({
  kind,
  data,
}: {
  kind: string;
  data: { label?: string; gateway?: string; marker?: string; taskType?: string };
}) {
  const color =
    kind === "start" || kind === "end" || kind === "intermediate"
      ? "#0284c7"
      : kind === "gateway"
        ? "#d97706"
        : "#059669";

  if (kind === "gateway") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 2 22 12 12 22 2 12Z"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
        />
        {data.gateway === "parallel" && (
          <path
            d="M12 7v10M7 12h10"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
        {data.gateway === "exclusive" && (
          <path
            d="M8.5 8.5l7 7M15.5 8.5l-7 7"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
        {(!data.gateway || data.gateway === "inclusive") && (
          <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.8" />
        )}
      </svg>
    );
  }

  if (kind === "task") {
    return (
      <svg width="26" height="18" viewBox="0 0 26 18" aria-hidden>
        <rect
          x="1"
          y="1"
          width="24"
          height="16"
          rx="3"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  const isEnd = kind === "end";
  const isInter = kind === "intermediate";
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke={color}
        strokeWidth={isEnd ? 3.4 : isInter ? 1.4 : 1.8}
      />
      {isInter && (
        <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="1.4" />
      )}
    </svg>
  );
}
