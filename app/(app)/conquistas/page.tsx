"use client";

import { useState } from "react";
import {
  Award,
  Flame,
  HelpCircle,
  Lock,
  RotateCcw,
  Route,
  Shapes,
  Target,
  Trophy,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, ProgressBar, SectionHeader, Stat } from "@/components/ui";
import { ACHIEVEMENTS, LEVELS, computeStats, levelFromXp } from "@/lib/progress";
import { useProgressStore } from "@/lib/store";
import { relativeTime, formatDateTime } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { modules, totalLessons } from "@/data/modules";
import { challenges } from "@/data/challenges";
import { bpmnSymbols } from "@/data/symbols";
import { cn } from "@/lib/utils";

const ACTIVITY_ICONS: Record<string, string> = {
  lesson: "BookOpen",
  module: "Route",
  challenge: "Target",
  quiz: "HelpCircle",
  symbol: "Shapes",
  page: "Workflow",
};

export default function ConquistasPage() {
  const { progress, ready, resetProgress } = useProgressStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = computeStats(progress, {
    lessons: totalLessons,
    modules: modules.length,
    challenges: challenges.length,
    achievements: ACHIEVEMENTS.length,
  });
  const level = levelFromXp(progress.xp);
  const unlocked = new Set(progress.achievements);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <SectionHeader
        eyebrow="Gamificação"
        title="Conquistas e progresso"
        description="Medalhas desbloqueadas, nível atual e histórico de atividades. Nada aqui é aleatório: cada conquista reflete uma ação real na plataforma."
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw size={14} />}
            className={cn(confirmReset && "text-rose-600 hover:text-rose-700")}
          >
            {confirmReset ? "Confirmar reset?" : "Resetar progresso"}
          </Button>
        }
      />

      {/* ---------- Nível e XP ---------- */}
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="relative flex flex-wrap items-start gap-5">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white shadow-card">
            {level.level}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-ink">{level.name}</h2>
              {level.level === LEVELS[LEVELS.length - 1].level && (
                <Badge tone="warning">
                  <Award size={12} className="mr-1" /> Nível máximo
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-ink-muted">{level.description}</p>
            <ProgressBar value={stats.levelPct} className="mt-3 max-w-lg" />
            <div className="mt-1.5 flex max-w-lg justify-between text-xs text-ink-subtle">
              <span>{progress.xp} XP</span>
              <span>
                {stats.next
                  ? `${Math.max(0, stats.next.minXp - progress.xp)} XP para ${stats.next.name}`
                  : "Nível máximo atingido"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-4">
          <MiniMetric label="Lições" value={`${stats.lessonsDone}/${stats.lessonsTotal}`} />
          <MiniMetric label="Módulos" value={`${stats.modulesDone}/${stats.modulesTotal}`} />
          <MiniMetric label="Desafios" value={`${stats.challengesDone}/${stats.challengesTotal}`} />
          <MiniMetric
            label="Conquistas"
            value={`${progress.achievements.length}/${ACHIEVEMENTS.length}`}
          />
        </div>
      </Card>

      {/* ---------- Estatísticas ---------- */}
      <section className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Progresso geral"
          value={`${stats.overallPct}%`}
          hint="lições, módulos e desafios"
          icon={<Route size={16} />}
        />
        <Stat
          label="Sequência"
          value={
            <>
              {ready ? progress.streak : 0}
              <Flame size={17} className="ml-1.5 inline align-[-3px] text-amber-500" />
            </>
          }
          hint="dias seguidos de estudo"
          icon={<Flame size={16} />}
        />
        <Stat
          label="Símbolos explorados"
          value={`${progress.visitedSymbols.length}/${bpmnSymbols.length}`}
          hint="biblioteca de símbolos"
          icon={<Shapes size={16} />}
        />
        <Stat
          label="Desempenho no quiz"
          value={stats.quizPerformance > 0 ? `${stats.quizPerformance}%` : "—"}
          hint={`${progress.quizAttempts.length} tentativa${progress.quizAttempts.length !== 1 ? "s" : ""}`}
          icon={<HelpCircle size={16} />}
        />
      </section>

      {/* ---------- Conquistas ---------- */}
      <section className="mt-8">
        <SectionHeader
          eyebrow="Medalhas"
          title={`Conquistas (${progress.achievements.length}/${ACHIEVEMENTS.length})`}
          description="Desbloqueadas automaticamente conforme seu avanço."
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);
            const Icon = getIcon(achievement.icon);
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-start gap-4 rounded-xl border p-4 transition",
                  isUnlocked
                    ? "border-amber-300 bg-amber-50/70 dark:border-amber-700 dark:bg-amber-900/20"
                    : "border-line bg-surface-raised opacity-75"
                )}
              >
                <span
                  className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
                    isUnlocked
                      ? "bg-amber-500 text-white shadow-card"
                      : "bg-surface-sunk text-ink-subtle"
                  )}
                >
                  {isUnlocked ? <Icon size={22} /> : <Lock size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {achievement.name}
                    </p>
                    <Badge tone={isUnlocked ? "warning" : "neutral"}>
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {achievement.description}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-ink-subtle">
                    {isUnlocked ? "Desbloqueada" : "Bloqueada"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Níveis ---------- */}
      <section className="mt-8">
        <SectionHeader eyebrow="Progressão" title="Níveis" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LEVELS.map((lvl) => {
            const reached = progress.xp >= lvl.minXp;
            const current = lvl.level === level.level;
            return (
              <div
                key={lvl.level}
                className={cn(
                  "rounded-xl border p-4",
                  current
                    ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30"
                    : reached
                      ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-line bg-surface-raised"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                      current
                        ? "bg-brand-600 text-white"
                        : reached
                          ? "bg-emerald-500 text-white"
                          : "bg-surface-sunk text-ink-subtle"
                    )}
                  >
                    {lvl.level}
                  </span>
                  {current && <Badge tone="brand">Atual</Badge>}
                </div>
                <p className="mt-2.5 text-sm font-semibold text-ink">{lvl.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                  {lvl.description}
                </p>
                <p className="mt-2 text-xs font-medium text-ink-subtle">
                  {lvl.minXp} XP mínimo
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Histórico ---------- */}
      <section className="mt-8">
        <SectionHeader
          eyebrow="Atividade"
          title="Histórico recente"
          description={`${progress.activity.length} registro${progress.activity.length !== 1 ? "s" : ""} no total.`}
        />

        {progress.activity.length === 0 ? (
          <EmptyState
            icon={<Zap size={28} />}
            title="Nenhuma atividade ainda"
            description="Conclua uma lição, um desafio ou um quiz para começar seu histórico."
            action={
              <div className="flex gap-2">
                <Button href="/trilha" size="sm">
                  Começar a trilha
                </Button>
                <Button href="/quiz" size="sm" variant="secondary">
                  Fazer um quiz
                </Button>
              </div>
            }
          />
        ) : (
          <Card className="divide-y divide-line">
            {progress.activity.slice(0, 20).map((entry) => {
              const Icon = getIcon(ACTIVITY_ICONS[entry.type] ?? "Workflow");
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-4 py-3"
                  title={formatDateTime(entry.at)}
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface-sunk text-ink-muted">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {entry.label}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {relativeTime(entry.at)}
                    </p>
                  </div>
                  {entry.xp > 0 && <Badge tone="success">+{entry.xp} XP</Badge>}
                </div>
              );
            })}
          </Card>
        )}
      </section>

      {/* ---------- Ações ---------- */}
      <section className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Button href="/trilha" variant="secondary" icon={<Route size={16} />}>
          Continuar na trilha
        </Button>
        <Button href="/laboratorio" variant="secondary" icon={<Target size={16} />}>
          Praticar no laboratório
        </Button>
        <Button href="/quiz" variant="secondary" icon={<Trophy size={16} />}>
          Melhorar no quiz
        </Button>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-subtle">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
