"use client";

import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { ContentBlock } from "@/types";
import { bpmnSymbols } from "@/data/symbols";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { DiagramView } from "@/components/bpmn/DiagramView";
import { cn } from "@/lib/utils";

/**
 * Renderiza os blocos de conteúdo das lições da trilha.
 * Tipado de forma exaustiva conforme ContentBlock.
 */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-[15px] leading-relaxed text-ink-muted">{block.text}</p>
      );

    case "callout":
      return <Callout block={block} />;

    case "bullets":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-muted">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "symbolCards":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.symbolIds.map((id) => {
            const symbol = bpmnSymbols.find((s) => s.id === id);
            if (!symbol) return null;
            return (
              <div
                key={id}
                className="rounded-xl border border-line bg-surface-sunk p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-surface-raised">
                    <BpmnSymbolGlyph
                      render={symbol.render}
                      label={symbol.namePt}
                      fit={SYMBOL_BOX.chip}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{symbol.namePt}</p>
                    <p className="text-xs text-ink-subtle">{symbol.nameEn}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
                  {symbol.summary}
                </p>
              </div>
            );
          })}
        </div>
      );

    case "diagram":
      return (
        <figure className="space-y-2">
          <DiagramView
            diagram={block.diagram}
            highlightNodeIds={block.highlightNodeIds}
            height={340}
            fitViewPadding={0.2}
          />
          <figcaption className="text-xs leading-relaxed text-ink-subtle">
            {block.caption}
          </figcaption>
        </figure>
      );

    case "comparison":
      return (
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface-sunk">
                <th className="w-1/4 px-4 py-2.5 text-left font-semibold text-ink">
                  &nbsp;
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-ink">
                  {block.header[0]}
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-ink">
                  {block.header[1]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface-raised">
              {block.rows.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-ink-muted">{row.a}</td>
                  <td className="px-4 py-3 text-ink-muted">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-line bg-surface-raised p-4"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

const CALLOUT_TONES = {
  info: {
    icon: Info,
    className:
      "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-100",
    iconClass: "text-sky-600 dark:text-sky-300",
  },
  tip: {
    icon: Lightbulb,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100",
    iconClass: "text-emerald-600 dark:text-emerald-300",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100",
    iconClass: "text-amber-600 dark:text-amber-300",
  },
} as const;

function Callout({
  block,
}: {
  block: Extract<ContentBlock, { type: "callout" }>;
}) {
  const tone = CALLOUT_TONES[block.tone];
  const Icon = tone.icon;
  return (
    <div className={cn("rounded-xl border p-4", tone.className)}>
      <div className="flex gap-3">
        <span className={cn("mt-0.5 flex-shrink-0", tone.iconClass)}>
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{block.title}</p>
          <p className="mt-1 text-sm leading-relaxed opacity-90">{block.text}</p>
        </div>
      </div>
    </div>
  );
}
