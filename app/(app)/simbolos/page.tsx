"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Info,
  Layers,
  Search,
  Shapes,
  X,
} from "lucide-react";
import { Button, EmptyState, Modal, SectionHeader } from "@/components/ui";
import { bpmnSymbols, symbolCategories } from "@/data/symbols";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { DiagramView } from "@/components/bpmn/DiagramView";
import { useProgressStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { BpmnSymbol, SymbolCategory } from "@/types";

type Filter = SymbolCategory | "all";

export default function SimbolosPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [onlyUnseen, setOnlyUnseen] = useState(false);
  const [selected, setSelected] = useState<BpmnSymbol | null>(null);
  const { progress, visitSymbol } = useProgressStore();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bpmnSymbols.filter((symbol) => {
      if (filter !== "all" && symbol.category !== filter) return false;
      if (onlyUnseen && progress.visitedSymbols.includes(symbol.id)) return false;
      if (!q) return true;
      return (
        symbol.namePt.toLowerCase().includes(q) ||
        symbol.nameEn.toLowerCase().includes(q) ||
        symbol.summary.toLowerCase().includes(q) ||
        symbol.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, filter, onlyUnseen, progress.visitedSymbols]);

  // Registrar visita quando um detalhe é aberto
  useEffect(() => {
    if (selected) visitSymbol(selected.id, selected.namePt);
  }, [selected, visitSymbol]);

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <SectionHeader
        eyebrow="Referência"
        title="Biblioteca de símbolos"
        description={`${bpmnSymbols.length} símbolos da notação BPMN 2.0, cada um com finalidade, quando usar, erros comuns e um mini-diagrama de exemplo.`}
        action={
          <div className="rounded-xl border border-line bg-surface-raised px-4 py-3 text-right">
            <p className="text-xs text-ink-subtle">Explorados</p>
            <p className="text-lg font-semibold text-ink">
              {progress.visitedSymbols.length}/{bpmnSymbols.length}
            </p>
          </div>
        }
      />

      {/* ---------- Barra de filtros ---------- */}
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
            placeholder="Pesquisar por nome, termo ou descrição…"
            className="h-11 w-full rounded-xl border border-line bg-surface-raised pl-10 pr-10 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Limpar pesquisa"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-subtle hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
          {/* ---------- Abas por categoria ---------- */}
          <div
            role="tablist"
            aria-label="Categorias de símbolos BPMN"
            className="scrollbar-thin no-scrollbar -mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-x-visible"
          >
            <SymbolTab
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="Todos"
              count={bpmnSymbols.length}
            />
            {symbolCategories.map((cat) => (
              <SymbolTab
                key={cat.id}
                active={filter === cat.id}
                onClick={() => setFilter(cat.id)}
                label={cat.name}
                count={bpmnSymbols.filter((s) => s.category === cat.id).length}
                color={cat.color}
              />
            ))}
          </div>

          <button
            onClick={() => setOnlyUnseen((v) => !v)}
            aria-pressed={onlyUnseen}
            className={cn(
              "flex h-9 flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition",
              onlyUnseen
                ? "border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
            )}
          >
            <Shapes size={14} />
            Só não vistos
          </button>
        </div>
      </div>

      {/* ---------- Descrição da categoria ---------- */}
      {filter !== "all" && (
        <div className="mb-4 rounded-xl border border-line bg-surface-raised p-4">
          <p className="text-sm font-semibold text-ink">
            {symbolCategories.find((c) => c.id === filter)?.name}
          </p>
          <p className="mt-0.5 text-sm text-ink-muted">
            {symbolCategories.find((c) => c.id === filter)?.description}
          </p>
        </div>
      )}

      {/* ---------- Grade ---------- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="Nenhum símbolo encontrado"
          description="Tente outro termo de pesquisa ou remova os filtros aplicados."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setFilter("all");
                setOnlyUnseen(false);
              }}
            >
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((symbol) => {
            const seen = progress.visitedSymbols.includes(symbol.id);
            const category = symbolCategories.find(
              (c) => c.id === symbol.category
            );
            return (
              <button
                key={symbol.id}
                onClick={() => setSelected(symbol)}
                className="group flex flex-col rounded-xl border border-line bg-surface-raised p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-card-hover"
              >
                {/* Palco de enquadramento: símbolo escalado proporcionalmente, nunca cortado */}
                <span className="mb-3 flex h-24 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-sunk transition group-hover:bg-white dark:group-hover:bg-slate-800">
                  <BpmnSymbolGlyph
                    render={symbol.render}
                    label={symbol.namePt}
                    fit={SYMBOL_BOX.stage}
                  />
                </span>
                <div className="flex items-start justify-between gap-1">
                  <p className="text-sm font-semibold leading-snug text-ink">
                    {symbol.namePt}
                  </p>
                  {seen && (
                    <span
                      className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                      title="Você já visitou este símbolo"
                    >
                      <Check size={10} />
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-subtle">
                  {symbol.nameEn}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {symbol.summary}
                </p>
                <span
                  className="mt-2.5 inline-block w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                  style={{
                    color: category?.color,
                    backgroundColor: `${category?.color}1a`,
                  }}
                >
                  {category?.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ---------- Modal de detalhe ---------- */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.namePt ?? ""}
        size="lg"
      >
        {selected && <SymbolDetail symbol={selected} />}
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aba de categoria                                                    */
/* ------------------------------------------------------------------ */

function SymbolTab({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex h-9 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition",
        active
          ? "border-brand-400 bg-brand-600 text-white shadow-sm"
          : "border-line bg-surface-raised text-ink-muted hover:border-brand-300 hover:text-ink"
      )}
    >
      {color && !active && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-[11px] font-semibold leading-4",
          active ? "bg-white/20 text-white" : "bg-surface-sunk text-ink-subtle"
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Detalhe do símbolo                                                  */
/* ------------------------------------------------------------------ */

function SymbolDetail({ symbol }: { symbol: BpmnSymbol }) {
  const category = symbolCategories.find((c) => c.id === symbol.category);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start gap-4 rounded-xl border border-line bg-surface-sunk p-4">
        <span className="flex h-24 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-raised">
          <BpmnSymbolGlyph
            render={symbol.render}
            label={symbol.namePt}
            fit={SYMBOL_BOX.detail}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                color: category?.color,
                backgroundColor: `${category?.color}1a`,
                borderColor: `${category?.color}40`,
              }}
            >
              {category?.name ?? symbol.category}
            </span>
            <span className="font-mono text-xs text-ink-subtle">{symbol.id}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {symbol.summary}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {symbol.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full bg-surface-raised px-2 py-0.5 text-[11px] text-ink-muted"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <DetailSection icon={<Info size={15} />} title="Nome em inglês">
        <p className="text-sm text-ink-muted">{symbol.nameEn}</p>
      </DetailSection>

      <DetailSection icon={<Info size={15} />} title="Finalidade">
        <p className="text-sm leading-relaxed text-ink-muted">{symbol.purpose}</p>
      </DetailSection>

      <DetailSection icon={<Check size={15} />} title="Quando usar">
        <p className="text-sm leading-relaxed text-ink-muted">{symbol.whenToUse}</p>
        <p className="mt-2 rounded-lg bg-surface-sunk p-3 text-sm leading-relaxed text-ink-muted">
          <span className="font-medium text-ink">Exemplo: </span>
          {symbol.example}
        </p>
      </DetailSection>

      <DetailSection
        icon={<AlertTriangle size={15} />}
        title="Erros comuns"
        tone="warning"
      >
        <ul className="space-y-1.5">
          {symbol.commonErrors.map((err, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              <span>{err}</span>
            </li>
          ))}
        </ul>
      </DetailSection>

      {symbol.miniExample && (
        <DetailSection icon={<Layers size={15} />} title="Mini-exemplo">
          <DiagramView
            diagram={symbol.miniExample.diagram}
            highlightNodeIds={symbol.miniExample.highlightNodeIds}
            height={280}
            fitViewPadding={0.2}
          />
          <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
            {symbol.miniExample.caption}
          </p>
        </DetailSection>
      )}
    </div>
  );
}

function DetailSection({
  icon,
  title,
  children,
  tone = "brand",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "brand" | "warning";
}) {
  return (
    <div>
      <p
        className={cn(
          "mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide",
          tone === "warning"
            ? "text-amber-600 dark:text-amber-400"
            : "text-brand-600 dark:text-brand-400"
        )}
      >
        {icon}
        {title}
      </p>
      {children}
    </div>
  );
}
