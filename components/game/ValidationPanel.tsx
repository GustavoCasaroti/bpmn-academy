"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { Badge, Button, ProgressBar } from "@/components/ui";
import type { ValidationIssue, ValidationResult } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Painel de validação do laboratório.
 * Mostra pontuação, problemas por severidade e feedback do desafio.
 */
export function ValidationPanel({
  result,
  onValidate,
  validating,
  success,
  successMessage,
  hints,
  showHints,
  onToggleHints,
  expectedIssueCodes = [],
  className,
}: {
  result: ValidationResult | null;
  onValidate: () => void;
  validating?: boolean;
  success?: boolean;
  successMessage?: string;
  hints?: string[];
  showHints?: boolean;
  onToggleHints?: () => void;
  expectedIssueCodes?: string[];
  className?: string;
}) {
  const errors =
    result?.issues.filter((i) => i.severity === "error") ?? [];
  const warnings =
    result?.issues.filter((i) => i.severity === "warning") ?? [];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          Validação
        </p>
        <Button
          size="sm"
          onClick={onValidate}
          disabled={validating}
          icon={<RefreshCw size={14} className={cn(validating && "animate-spin")} />}
        >
          Verificar
        </Button>
      </div>

      {/* Pontuação */}
      {result && (
        <div className="mt-3 rounded-xl border border-line bg-surface-sunk p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Pontuação</span>
            <span
              className={cn(
                "text-lg font-semibold",
                result.score >= 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : result.score >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400"
              )}
            >
              {result.score}
              <span className="text-sm font-normal text-ink-subtle">/100</span>
            </span>
          </div>
          <ProgressBar
            value={result.score}
            tone={result.score >= 80 ? "success" : result.score >= 50 ? "warning" : "brand"}
            className="mt-2"
          />
          <div className="mt-2.5 flex gap-3 text-xs">
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={12} />
              {errors.length} erro{errors.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Info size={12} />
              {warnings.length} aviso{warnings.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {success && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/30">
          <div className="flex gap-2.5">
            <span className="mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-300">
              <Trophy size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                Desafio concluído!
              </p>
              <p className="mt-1 text-sm leading-relaxed text-emerald-700 dark:text-emerald-300">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de problemas */}
      {result && result.issues.length > 0 && !success && (
        <div className="mt-3 space-y-2">
          {result.issues.map((issue, i) => (
            <IssueCard key={`${issue.code}-${i}`} issue={issue} expected={expectedIssueCodes.includes(issue.code)} />
          ))}
        </div>
      )}

      {result && result.issues.length === 0 && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          <CheckCircle2 size={16} className="mr-1.5 inline align-[-3px]" />
          Nenhum problema encontrado — diagrama conforme a notação.
        </div>
      )}

      {!result && (
        <p className="mt-3 rounded-xl border border-dashed border-line p-4 text-xs leading-relaxed text-ink-subtle">
          Clique em <span className="font-medium text-ink">Verificar</span> para
          analisar o diagrama contra as regras da notação BPMN 2.0.
        </p>
      )}

      {/* Dicas */}
      {hints && hints.length > 0 && (
        <div className="mt-4">
          <button
            onClick={onToggleHints}
            className="flex w-full items-center justify-between rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-left text-sm font-medium text-ink transition hover:border-brand-300"
          >
            <span className="flex items-center gap-2">
              <Info size={15} className="text-brand-600 dark:text-brand-400" />
              Preciso de ajuda ({hints.length} dicas)
            </span>
            <span className="text-xs text-ink-subtle">
              {showHints ? "Ocultar" : "Mostrar"}
            </span>
          </button>
          {showHints && (
            <ol className="mt-2 space-y-2">
              {hints.map((hint, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-line bg-surface-sunk px-3.5 py-2.5 text-sm leading-relaxed text-ink-muted"
                >
                  <span className="mr-1.5 font-semibold text-ink">
                    {i + 1}.
                  </span>
                  {hint}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

function IssueCard({
  issue,
  expected,
}: {
  issue: ValidationIssue;
  expected?: boolean;
}) {
  const isError = issue.severity === "error";
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5",
        isError
          ? "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/25"
          : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/25"
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex-shrink-0",
            isError
              ? "text-rose-600 dark:text-rose-400"
              : "text-amber-600 dark:text-amber-400"
          )}
        >
          <AlertTriangle size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p
              className={cn(
                "text-sm font-semibold",
                isError
                  ? "text-rose-800 dark:text-rose-200"
                  : "text-amber-800 dark:text-amber-200"
              )}
            >
              {issue.title}
            </p>
            {expected && (
              <Badge tone="warning">problema intencional</Badge>
            )}
          </div>
          <p
            className={cn(
              "mt-1 text-sm leading-relaxed",
              isError
                ? "text-rose-700 dark:text-rose-300"
                : "text-amber-700 dark:text-amber-300"
            )}
          >
            {issue.detail}
          </p>
          {issue.hint && (
            <p className="mt-1.5 text-xs leading-relaxed opacity-80">
              <span className="font-semibold">Como corrigir: </span>
              {issue.hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
