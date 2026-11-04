"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { bpmnSymbols, symbolCategories } from "@/data/symbols";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { cn } from "@/lib/utils";
import type { BpmnSymbol, SymbolCategory } from "@/types";

/**
 * Paleta de símbolos do laboratório.
 * Clicar num símbolo emite o evento `onPick` para inserção no diagrama.
 * Símbolos de conexão emitem `onPickConnection`.
 */
export function SymbolPalette({
  onPick,
  onPickConnection,
  edgeType,
  className,
}: {
  onPick: (symbol: BpmnSymbol) => void;
  onPickConnection?: (type: "sequence" | "message" | "association") => void;
  edgeType?: "sequence" | "message" | "association";
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SymbolCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bpmnSymbols.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (!q) return true;
      return (
        s.namePt.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  const nodes = filtered.filter((s) => s.render.kind !== "connection");
  const connections = filtered.filter((s) => s.render.kind === "connection");

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar símbolo…"
          className="h-9 w-full rounded-lg border border-line bg-surface-raised pl-8 pr-8 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-400 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Limpar"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-subtle hover:text-ink"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="scrollbar-thin mt-2 flex gap-1.5 overflow-x-auto pb-1">
        <PalChip active={category === "all"} onClick={() => setCategory("all")}>
          Todos
        </PalChip>
        {symbolCategories.map((cat) => (
          <PalChip
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {cat.name}
          </PalChip>
        ))}
      </div>

      <div className="scrollbar-thin mt-2 flex-1 overflow-y-auto pr-1">
        {connections.length > 0 && onPickConnection && (
          <div className="mb-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
              Tipo de conexão
            </p>
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
                  onClick={() => onPickConnection(type)}
                  title={`Criar conexão do tipo ${label}`}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition",
                    edgeType === type
                      ? "border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                      : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-ink-subtle">
              Escolha o tipo e arraste de um elemento a outro para conectar.
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-3">
          {nodes.map((symbol) => {
            const categoryInfo = symbolCategories.find(
              (c) => c.id === symbol.category
            );
            return (
              <button
                key={symbol.id}
                onClick={() => onPick(symbol)}
                title={`${symbol.namePt} — clique para adicionar`}
                className="group flex flex-col items-center gap-1 rounded-lg border border-line bg-surface-raised px-1.5 py-2 transition hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30"
              >
                <span className="flex h-11 w-16 items-center justify-center">
                  <BpmnSymbolGlyph
                    render={symbol.render}
                    label={symbol.namePt}
                    fit={SYMBOL_BOX.tiny}
                  />
                </span>
                <span className="w-full truncate text-center text-[10px] leading-tight text-ink-muted group-hover:text-ink">
                  {symbol.namePt}
                </span>
                <span
                  className="h-1 w-6 rounded-full"
                  style={{ backgroundColor: categoryInfo?.color }}
                />
              </button>
            );
          })}
        </div>

        {nodes.length === 0 && (
          <p className="py-6 text-center text-xs text-ink-subtle">
            Nenhum símbolo corresponde à pesquisa.
          </p>
        )}
      </div>
    </div>
  );
}

function PalChip({
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
        "flex h-7 flex-shrink-0 items-center rounded-full border px-2.5 text-[11px] font-medium transition",
        active
          ? "border-brand-400 bg-brand-600 text-white"
          : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
      )}
    >
      {children}
    </button>
  );
}
