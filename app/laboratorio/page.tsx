"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  FlaskConical,
  Lock,
  Pencil,
  Play,
  Shapes,
  Target,
} from "lucide-react";
import { Badge, Card, EmptyState, ProgressBar, SectionHeader } from "@/components/ui";
import { challenges } from "@/data/challenges";
import { CHALLENGE_MODES } from "@/data/config";
import { modules } from "@/data/modules";
import { useProgressStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeMode } from "@/types";

const MODE_ICON: Record<ChallengeMode, React.ComponentType<{ size?: number }>> = {
  build: Target,
  fix: Pencil,
  identify: Shapes,
  simulate: Play,
};

const DIFFICULTY_TONE = {
  facil: "success",
  medio: "warning",
  avancado: "danger",
} as const;

const DIFFICULTY_LABEL = {
  facil: "Fácil",
  medio: "Médio",
  avancado: "Avançado",
} as const;

type ModeFilter = ChallengeMode | "all";

export default function LaboratorioPage() {
  const { progress, ready } = useProgressStore();
  const [mode, setMode] = useState<ModeFilter>("all");

  const isUnlocked = (challenge: Challenge) =>
    !ready ||
    challenge.unlockAfter.every((id) =>
      progress.completedModules.includes(id)
    );

  const filtered = useMemo(
    () => (mode === "all" ? challenges : challenges.filter((c) => c.mode === mode)),
    [mode]
  );

  const doneCount = challenges.filter((c) => progress.challenges[c.id]).length;
  const totalXp = challenges.reduce((sum, c) => sum + c.xp, 0);
  const earnedXp = Object.values(progress.challenges).reduce(
    (sum, c) => sum + c.xp,
    0
  );

  return (
    <div className="mx-auto max-w-6xl animate-fade-up">
      <SectionHeader
        eyebrow="Laboratório BPMN"
        title="Pratique com 10 desafios"
        description="Monte processos do zero, corrija erros de notação, identifique símbolos em diagramas reais e simule fluxos com decisões."
        action={
          <div className="flex gap-3">
            <div className="rounded-xl border border-line bg-surface-raised px-4 py-3 text-right">
              <p className="text-xs text-ink-subtle">Concluídos</p>
              <p className="text-lg font-semibold text-ink">
                {doneCount}/{challenges.length}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface-raised px-4 py-3 text-right">
              <p className="text-xs text-ink-subtle">XP disponível</p>
              <p className="text-lg font-semibold text-ink">
                {earnedXp}/{totalXp}
              </p>
            </div>
          </div>
        }
      />

      <div className="mb-6">
        <ProgressBar
          value={challenges.length ? (doneCount / challenges.length) * 100 : 0}
        />
      </div>

      {/* ---------- Filtros por modo ---------- */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["build", "fix", "identify", "simulate"] as const).map((m) => {
          const info = CHALLENGE_MODES[m];
          const Icon = MODE_ICON[m];
          const count = challenges.filter((c) => c.mode === m).length;
          const done = challenges.filter(
            (c) => c.mode === m && progress.challenges[c.id]
          ).length;
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(active ? "all" : m)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all duration-200",
                active
                  ? "border-brand-400 bg-brand-50 shadow-card dark:bg-brand-900/30"
                  : "border-line bg-surface-raised hover:-translate-y-0.5 hover:shadow-card-hover"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    active ? "bg-brand-600 text-white" : "bg-surface-sunk text-ink-muted"
                  )}
                >
                  <Icon size={17} />
                </span>
                <span className="text-xs text-ink-subtle">
                  {done}/{count}
                </span>
              </div>
              <p className="mt-2.5 text-sm font-semibold text-ink">{info.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                {info.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* ---------- Lista de desafios ---------- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FlaskConical size={28} />}
          title="Nenhum desafio neste modo"
          description="Escolha outro modo de prática para continuar."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((challenge, index) => {
            const unlocked = isUnlocked(challenge);
            const done = progress.challenges[challenge.id];
            const info = CHALLENGE_MODES[challenge.mode];
            const Icon = MODE_ICON[challenge.mode];
            const module = modules.find((m) => m.id === challenge.moduleId);

            return (
              <Link
                key={challenge.id}
                href={unlocked ? `/laboratorio/${challenge.id}` : "/trilha"}
                className={cn(!unlocked && "pointer-events-none")}
              >
                <Card
                  hover={unlocked}
                  className={cn(
                    "flex h-full flex-col p-5",
                    !unlocked && "opacity-70"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                          done
                            ? "bg-emerald-600 text-white"
                            : unlocked
                              ? "bg-brand-600 text-white"
                              : "bg-surface-sunk text-ink-subtle"
                        )}
                      >
                        {done ? <Check size={19} /> : unlocked ? <Icon size={19} /> : <Lock size={17} />}
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                          Desafio {String(index + 1).padStart(2, "0")} · {info.short}
                        </p>
                        <div className="mt-0.5 flex flex-wrap gap-1.5">
                          <Badge tone={DIFFICULTY_TONE[challenge.difficulty]}>
                            {DIFFICULTY_LABEL[challenge.difficulty]}
                          </Badge>
                          <Badge tone="brand">+{challenge.xp} XP</Badge>
                          {done && <Badge tone="success">Concluído</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-3 text-base font-semibold text-ink">
                    {challenge.title}
                  </h2>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">
                    {challenge.situation}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                    <span className="text-xs text-ink-subtle">
                      {module ? `Vinculado a: ${module.title}` : "Sem módulo"}
                    </span>
                    {unlocked ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                        {done ? "Refazer" : "Começar"} <ArrowRight size={15} />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-ink-subtle">
                        <Lock size={12} />
                        Conclua a trilha
                      </span>
                    )}
                  </div>

                  {done && (
                    <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      Melhor pontuação: {done.score}/100 · {done.attempts} tentativa
                      {done.attempts > 1 ? "s" : ""}
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* ---------- Resumo dos modos ---------- */}
      <Card className="mt-8 p-5">
        <h2 className="text-base font-semibold text-ink">Como cada modo funciona</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(["build", "fix", "identify", "simulate"] as const).map((m) => {
            const info = CHALLENGE_MODES[m];
            const Icon = MODE_ICON[m];
            return (
              <div key={m} className="rounded-lg border border-line bg-surface-sunk p-3.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised text-brand-600 dark:text-brand-400">
                  <Icon size={15} />
                </span>
                <p className="mt-2 text-sm font-semibold text-ink">{info.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {info.description}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
