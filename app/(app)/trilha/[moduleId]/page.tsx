"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Lock,
  Target,
} from "lucide-react";
import { Badge, Button, Card, ProgressBar, SectionHeader } from "@/components/ui";
import { ContentBlocks } from "@/components/dashboard/ContentBlocks";
import { moduleById, modules } from "@/data/modules";
import { challenges } from "@/data/challenges";
import { useProgressStore } from "@/lib/store";
import { XP_RULES } from "@/lib/progress";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const module = moduleById(moduleId);

  const { progress, completeLesson, completeModule } = useProgressStore();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ xp: number; achievement?: string } | null>(
    null
  );

  useEffect(() => {
    if (module && !activeLessonId) setActiveLessonId(module.lessons[0]?.id ?? null);
  }, [module, activeLessonId]);

  const locked = useMemo(
    () =>
      !!module &&
      module.unlockAfter.some((id) => !progress.completedModules.includes(id)),
    [module, progress.completedModules]
  );

  if (!module) {
    return (
      <div className="mx-auto max-w-3xl animate-fade-up">
        <Card className="p-8 text-center">
          <h1 className="text-lg font-semibold text-ink">Módulo não encontrado</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Este módulo não existe ou foi removido.
          </p>
          <Button href="/trilha" className="mt-4" icon={<ArrowLeft size={16} />}>
            Voltar para a trilha
          </Button>
        </Card>
      </div>
    );
  }

  const activeLesson =
    module.lessons.find((l) => l.id === activeLessonId) ?? module.lessons[0];
  const completedInModule = module.lessons.filter((l) =>
    progress.completedLessons.includes(`${module.id}::${l.id}`)
  ).length;
  const allLessonsDone = completedInModule >= module.lessons.length;
  const moduleDone = progress.completedModules.includes(module.id);

  const lessonIndex = activeLesson
    ? module.lessons.findIndex((l) => l.id === activeLesson.id)
    : 0;
  const prevLesson = module.lessons[lessonIndex - 1];
  const nextLesson = module.lessons[lessonIndex + 1];

  const handleComplete = () => {
    if (!activeLesson) return;
    const result = completeLesson(module.id, activeLesson.id, activeLesson.title);
    if (result.xpGained > 0 || result.newAchievements.length > 0) {
      setToast({
        xp: result.xpGained,
        achievement: result.newAchievements[0],
      });
      window.setTimeout(() => setToast(null), 3200);
    }
    if (nextLesson) setActiveLessonId(nextLesson.id);
    else if (module.challengeIds.length === 0) {
      // última lição sem desafio: conclui o módulo automaticamente
      completeModule(module.id, module.title);
    }
  };

  const handleFinishModule = () => {
    const result = completeModule(module.id, module.title);
    setToast({ xp: result.xpGained, achievement: result.newAchievements[0] });
    window.setTimeout(() => setToast(null), 3200);
  };

  const moduleChallenges = challenges.filter((c) =>
    module.challengeIds.includes(c.id)
  );

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      {/* ---------- Cabeçalho ---------- */}
      <Link
        href="/trilha"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} />
        Trilha de aprendizado
      </Link>

      <div className="rounded-2xl border border-line bg-surface-raised p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            {(() => {
              const Icon = getIcon(module.icon);
              return <Icon size={22} />;
            })()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Módulo {module.order} de {modules.length}
              </span>
              {moduleDone && <Badge tone="success">Concluído</Badge>}
              {locked && (
                <Badge tone="neutral">
                  <Lock size={11} className="mr-1" /> Bloqueado
                </Badge>
              )}
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {module.title}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{module.summary}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ProgressBar
            value={module.lessons.length ? (completedInModule / module.lessons.length) * 100 : 0}
            className="max-w-64 flex-1"
          />
          <span className="text-xs text-ink-subtle">
            {completedInModule}/{module.lessons.length} lições
          </span>
          <span className="text-xs text-ink-subtle">
            +{XP_RULES.lesson} XP por lição · +{XP_RULES.module} XP pelo módulo
          </span>
        </div>
      </div>

      {locked && (
        <Card className="mt-4 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/30">
          <div className="flex gap-3">
            <Lock size={17} className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-300" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold">Módulo bloqueado</p>
              <p className="mt-0.5 opacity-90">
                Conclua primeiro:{" "}
                {module.unlockAfter
                  .map((id) => moduleById(id)?.title ?? id)
                  .join(", ")}
                .
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ---------- Conteúdo ---------- */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* Lista de lições */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Lições
          </p>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {module.lessons.map((lesson, i) => {
              const done = progress.completedLessons.includes(
                `${module.id}::${lesson.id}`
              );
              const active = lesson.id === activeLesson?.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  disabled={locked}
                  className={cn(
                    "flex min-w-56 flex-shrink-0 items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left transition lg:min-w-0",
                    active
                      ? "border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/30"
                      : "border-line bg-surface-raised hover:border-brand-300",
                    locked && "cursor-not-allowed opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-brand-600 text-white"
                          : "bg-surface-sunk text-ink-subtle"
                    )}
                  >
                    {done ? <Check size={12} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm leading-snug",
                      active ? "font-semibold text-ink" : "text-ink-muted"
                    )}
                  >
                    {lesson.title}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Desafios do módulo */}
          {moduleChallenges.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Desafios
              </p>
              <div className="space-y-2">
                {moduleChallenges.map((c) => {
                  const done = !!progress.challenges[c.id];
                  return (
                    <Link key={c.id} href={`/laboratorio/${c.id}`}>
                      <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-raised px-3 py-2.5 transition hover:border-brand-400">
                        <span
                          className={cn(
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
                            done
                              ? "bg-emerald-500 text-white"
                              : "bg-surface-sunk text-ink-subtle"
                          )}
                        >
                          {done ? <Check size={13} /> : <Target size={13} />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-ink-muted">
                          {c.title}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Lição ativa */}
        <main className="min-w-0">
          {activeLesson && (
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    Lição {lessonIndex + 1} de {module.lessons.length}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-ink sm:text-xl">
                    {activeLesson.title}
                  </h2>
                </div>
                {progress.completedLessons.includes(
                  `${module.id}::${activeLesson.id}`
                ) && (
                  <Badge tone="success">
                    <CheckCircle2 size={12} className="mr-1" />
                    Concluída
                  </Badge>
                )}
              </div>

              <div className="mt-5">
                <ContentBlocks blocks={activeLesson.blocks} />
              </div>

              {/* Navegação */}
              <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                  icon={<ArrowLeft size={15} />}
                >
                  Anterior
                </Button>

                <div className="flex-1" />

                {!progress.completedLessons.includes(
                  `${module.id}::${activeLesson.id}`
                ) && (
                  <Button
                    variant="success"
                    onClick={handleComplete}
                    icon={<Check size={16} />}
                    disabled={locked}
                  >
                    Concluir lição (+{XP_RULES.lesson} XP)
                  </Button>
                )}

                {nextLesson ? (
                  <Button
                    onClick={() => setActiveLessonId(nextLesson.id)}
                    icon={<ArrowRight size={16} />}
                  >
                    Próxima lição
                  </Button>
                ) : allLessonsDone && !moduleDone ? (
                  <Button
                    variant="success"
                    onClick={handleFinishModule}
                    icon={<Check size={16} />}
                  >
                    Concluir módulo (+{XP_RULES.module} XP)
                  </Button>
                ) : null}
              </div>
            </Card>
          )}

          {/* Próximo módulo / conclusão */}
          {allLessonsDone && (
            <Card className="mt-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-ink">
                    {moduleDone
                      ? "Módulo concluído"
                      : "Todas as lições concluídas"}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {moduleDone
                      ? "Você já dominou este conteúdo. Pratique nos desafios ou siga para o próximo módulo."
                      : "Conclua o módulo para desbloquear o próximo e ganhar XP."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!moduleDone && (
                    <Button
                      variant="success"
                      onClick={handleFinishModule}
                      icon={<Check size={16} />}
                    >
                      Concluir módulo (+{XP_RULES.module} XP)
                    </Button>
                  )}
                  {modules[module.order] && (
                    <Button
                      href={`/trilha/${modules[module.order].id}`}
                      icon={<ArrowRight size={16} />}
                    >
                      Próximo módulo
                    </Button>
                  )}
                  {moduleChallenges.length > 0 && (
                    <Button
                      href={`/laboratorio/${moduleChallenges[0].id}`}
                      variant="secondary"
                      icon={<Target size={16} />}
                    >
                      Praticar
                    </Button>
                  )}
                  {module.quizCategories.length > 0 && (
                    <Button href="/quiz" variant="ghost" icon={<HelpCircle size={16} />}>
                      Fazer o quiz
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* ---------- Toast de XP ---------- */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-raised px-5 py-3 shadow-pop">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                {toast.xp > 0 ? `+${toast.xp} XP` : "Progresso salvo"}
              </p>
              {toast.achievement && (
                <p className="text-xs text-ink-muted">
                  Conquista desbloqueada: {toast.achievement}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
