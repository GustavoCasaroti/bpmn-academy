"use client";

import Link from "next/link";
import { ArrowRight, Check, Lock, Route } from "lucide-react";
import { Badge, Card, EmptyState, ProgressBar, SectionHeader } from "@/components/ui";
import { modules, totalLessons } from "@/data/modules";
import { useProgressStore } from "@/lib/store";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function TrilhaPage() {
  const { progress, ready } = useProgressStore();

  const lessonsDone = progress.completedLessons.length;
  const overallPct = totalLessons
    ? Math.round((lessonsDone / totalLessons) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <SectionHeader
        eyebrow="Trilha de aprendizado"
        title="Do básico à aplicação prática"
        description={`${modules.length} módulos e ${totalLessons} lições. Cada módulo desbloqueia o seguinte — siga a sequência para construir a base antes de praticar.`}
        action={
          <div className="rounded-xl border border-line bg-surface-raised px-4 py-3 text-right">
            <p className="text-xs text-ink-subtle">Progresso geral</p>
            <p className="text-lg font-semibold text-ink">{overallPct}%</p>
          </div>
        }
      />

      <div className="mb-6">
        <ProgressBar value={overallPct} />
        <p className="mt-1.5 text-xs text-ink-subtle">
          {lessonsDone} de {totalLessons} lições concluídas
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const completedLessons = module.lessons.filter((l) =>
            progress.completedLessons.includes(`${module.id}::${l.id}`)
          ).length;
          const isDone = progress.completedModules.includes(module.id);
          const locked =
            ready &&
            module.unlockAfter.some(
              (id) => !progress.completedModules.includes(id)
            );
          const pct = module.lessons.length
            ? Math.round((completedLessons / module.lessons.length) * 100)
            : 0;
          const Icon = getIcon(module.icon);

          return (
            <Link
              key={module.id}
              href={`/trilha/${module.id}`}
              className={cn(
                "block",
                locked && "pointer-events-none opacity-70"
              )}
            >
              <Card hover={!locked} className="p-5">
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-600 text-white"
                    )}
                  >
                    {isDone ? <Check size={22} /> : <Icon size={22} />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                        Módulo {module.order}
                      </span>
                      {isDone && <Badge tone="success">Concluído</Badge>}
                      {locked && (
                        <Badge tone="neutral">
                          <Lock size={11} className="mr-1" />
                          Bloqueado
                        </Badge>
                      )}
                    </div>

                    <h2 className="mt-1 text-base font-semibold text-ink sm:text-lg">
                      {module.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {module.subtitle}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {module.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <ProgressBar value={pct} className="h-1.5 max-w-48" />
                      <span className="text-xs text-ink-subtle">
                        {completedLessons}/{module.lessons.length} lições
                      </span>
                      {module.challengeIds.length > 0 && (
                        <span className="text-xs text-ink-subtle">
                          {module.challengeIds.length} desafio
                          {module.challengeIds.length > 1 ? "s" : ""} vinculado
                          {module.challengeIds.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="mt-1 hidden flex-shrink-0 text-ink-subtle sm:block">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {modules.length === 0 && (
        <EmptyState
          icon={<Route size={28} />}
          title="Nenhum módulo disponível"
          description="Os módulos da trilha serão carregados em breve."
        />
      )}
    </div>
  );
}
