"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  HelpCircle,
  Layers,
  Play,
  Route,
  Shapes,
  Target,
  Trophy,
  Workflow,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Badge, Button, Card, ProgressBar, SectionHeader, Stat } from "@/components/ui";
import { ACHIEVEMENTS, computeStats, levelFromXp } from "@/lib/progress";
import { useProgressStore } from "@/lib/store";
import { modules, totalLessons } from "@/data/modules";
import { challenges } from "@/data/challenges";
import { processExamples } from "@/data/examples";
import { bpmnSymbols } from "@/data/symbols";
import { quizQuestions } from "@/data/quiz";
import { relativeTime } from "@/lib/utils";
import { getIcon } from "@/lib/icons";

const ACTIVITY_ICONS: Record<string, string> = {
  lesson: "BookOpen",
  module: "Route",
  challenge: "Target",
  quiz: "HelpCircle",
  symbol: "Shapes",
  page: "Workflow",
};

export default function DashboardPage() {
  const { progress, ready } = useProgressStore();

  const stats = useMemo(
    () =>
      computeStats(progress, {
        lessons: totalLessons,
        modules: modules.length,
        challenges: challenges.length,
        achievements: ACHIEVEMENTS.length,
      }),
    [progress]
  );

  const level = levelFromXp(progress.xp);
  const nextModule =
    modules.find((m) => !progress.completedModules.includes(m.id)) ?? modules[0];
  const nextLessonId =
    nextModule.lessons.find(
      (l) => !progress.completedLessons.includes(`${nextModule.id}::${l.id}`)
    )?.id ?? nextModule.lessons[0]?.id;

  const pendingChallenges = challenges.filter(
    (c) => !progress.challenges[c.id]
  );
  const recommended =
    pendingChallenges.find((c) =>
      c.unlockAfter.every((id) => progress.completedModules.includes(id))
    ) ?? pendingChallenges[0] ?? challenges[0];

  const recentActivity = progress.activity.slice(0, 5);
  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    progress.achievements.includes(a.id)
  );

  return (
    <div className="mx-auto max-w-6xl animate-fade-up">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-sky-500/10 blur-2xl" />

        <div className="relative">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Plataforma interativa de BPMN 2.0
          </p>
          <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Aprenda BPMN na prática
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Estude a notação pela trilha, consulte a biblioteca de símbolos, analise
            processos reais e aplique o conhecimento no laboratório e no quiz.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button
              href={`/trilha/${nextModule.id}`}
              icon={<Play size={16} />}
              size="lg"
            >
              {ready && stats.lessonsDone > 0
                ? "Continuar na trilha"
                : "Começar a trilha"}
            </Button>
            <Button href="/laboratorio" variant="secondary" icon={<Target size={16} />}>
              Abrir laboratório
            </Button>
            <Button href="/quiz" variant="ghost" icon={<HelpCircle size={16} />}>
              Testar conhecimento
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- Estatísticas ---------- */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Progresso geral"
          value={`${stats.overallPct}%`}
          hint={`${stats.lessonsDone}/${stats.lessonsTotal} lições concluídas`}
          icon={<Route size={16} />}
        />
        <Stat
          label="Nível"
          value={ready ? `Nv ${level.level} · ${level.name}` : "Nv 1"}
          hint={ready ? `${progress.xp} XP acumulados` : "Carregando…"}
          icon={<Zap size={16} />}
        />
        <Stat
          label="Desafios"
          value={`${stats.challengesDone}/${stats.challengesTotal}`}
          hint="Laboratório BPMN"
          icon={<Target size={16} />}
        />
        <Stat
          label="Sequência"
          value={
            <>
              {ready ? stats.streak : 0}
              <span className="ml-1.5 inline-block align-middle text-amber-500">
                <Flame size={18} />
              </span>
            </>
          }
          hint="dias seguidos de estudo"
          icon={<Trophy size={16} />}
        />
      </section>

      {/* ---------- Nível + Conquistas ---------- */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Evolução
              </p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{level.name}</h2>
              <p className="text-sm text-ink-muted">{level.description}</p>
            </div>
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
              {level.level}
            </span>
          </div>

          <ProgressBar value={stats.levelPct} className="mt-4" />
          <div className="mt-2 flex justify-between text-xs text-ink-subtle">
            <span>{progress.xp} XP</span>
            <span>
              {stats.next
                ? `${Math.max(0, stats.next.minXp - progress.xp)} XP para ${stats.next.name}`
                : "Nível máximo"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-4">
            <MiniMetric label="Lições" value={`${stats.lessonsDone}/${stats.lessonsTotal}`} />
            <MiniMetric label="Módulos" value={`${stats.modulesDone}/${stats.modulesTotal}`} />
            <MiniMetric label="Símbolos vistos" value={`${progress.visitedSymbols.length}/${bpmnSymbols.length}`} />
            <MiniMetric
              label="Desempenho quiz"
              value={stats.quizPerformance > 0 ? `${stats.quizPerformance}%` : "—"}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Conquistas</h2>
            <Link
              href="/conquistas"
              className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Ver todas
            </Link>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            {unlockedAchievements.length} de {ACHIEVEMENTS.length} desbloqueadas
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {ACHIEVEMENTS.slice(0, 8).map((a) => {
              const unlocked = progress.achievements.includes(a.id);
              const Icon = getIcon(a.icon);
              return (
                <span
                  key={a.id}
                  title={`${a.name} — ${a.description}`}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    unlocked
                      ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "border-line bg-surface-sunk text-ink-subtle opacity-60"
                  }`}
                >
                  <Icon size={18} />
                </span>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg bg-surface-sunk p-3">
            <p className="text-xs leading-relaxed text-ink-muted">
              {unlockedAchievements.length === 0
                ? "Conclua lições e desafios para desbloquear suas primeiras medalhas."
                : `Última conquista: ${unlockedAchievements[unlockedAchievements.length - 1].name}.`}
            </p>
          </div>
        </Card>
      </section>

      {/* ---------- Próximos passos ---------- */}
      <section className="mt-8">
        <SectionHeader
          eyebrow="Continue de onde parou"
          title="Próximos passos"
          description="Sugestões com base no seu progresso atual."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <NextStepCard
            icon={<Route size={18} />}
            eyebrow="Trilha"
            title={nextModule.title}
            description={
              nextLessonId
                ? `Próxima lição: ${
                    nextModule.lessons.find((l) => l.id === nextLessonId)?.title
                  }`
                : nextModule.subtitle
            }
            href={`/trilha/${nextModule.id}`}
            cta="Continuar módulo"
            progressValue={
              nextModule.lessons.length
                ? Math.round(
                    (nextModule.lessons.filter((l) =>
                      progress.completedLessons.includes(`${nextModule.id}::${l.id}`)
                    ).length /
                      nextModule.lessons.length) *
                      100
                    )
                : 0
            }
          />

          {recommended && (
            <NextStepCard
              icon={<Target size={18} />}
              eyebrow="Laboratório"
              title={recommended.title}
              description={recommended.situation.slice(0, 90) + "…"}
              href={`/laboratorio/${recommended.id}`}
              cta="Abrir desafio"
            />
          )}

          <NextStepCard
            icon={<HelpCircle size={18} />}
            eyebrow="Quiz"
            title={`${quizQuestions.length} questões avaliadas`}
            description="Fundamentos, eventos, gateways, interpretação de diagramas e situações práticas."
            href="/quiz"
            cta="Iniciar quiz"
            progressValue={stats.quizPerformance}
          />
        </div>
      </section>

      {/* ---------- Explorar ---------- */}
      <section className="mt-8">
        <SectionHeader
          eyebrow="Conteúdo"
          title="Explore a plataforma"
          description="Biblioteca de símbolos, exemplos comentados e a trilha completa."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExploreCard
            icon={<Shapes size={20} />}
            title="Biblioteca de símbolos"
            description={`${bpmnSymbols.length} símbolos com finalidade, quando usar, erros comuns e mini-exemplos.`}
            href="/simbolos"
          />
          <ExploreCard
            icon={<Workflow size={20} />}
            title="Exemplos de processos"
            description={`${processExamples.length} processos completos com passo a passo, decisões e simulação.`}
            href="/exemplos"
          />
          <ExploreCard
            icon={<Layers size={20} />}
            title="Trilha de aprendizado"
            description={`${modules.length} módulos e ${totalLessons} lições do básico à aplicação prática.`}
            href="/trilha"
          />
        </div>
      </section>

      {/* ---------- Como funciona ---------- */}
      <section className="mt-8">
        <SectionHeader
          eyebrow="Método"
          title="Como funciona"
          description="Quatro etapas para dominar a notação BPMN 2.0."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <BookOpen size={18} />,
              title: "1. Estude",
              text: "Siga a trilha e leia cada lição com exemplos de diagrama.",
            },
            {
              icon: <Shapes size={18} />,
              title: "2. Consulte",
              text: "Use a biblioteca de símbolos como referência rápida.",
            },
            {
              icon: <Target size={18} />,
              title: "3. Pratique",
              text: "Monte, corrija e simule processos no laboratório.",
            },
            {
              icon: <CheckCircle2 size={18} />,
              title: "4. Avalie-se",
              text: "Responda ao quiz e acompanhe seu nível e conquistas.",
            },
          ].map((step) => (
            <Card key={step.title} className="p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                {step.icon}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Última atividade ---------- */}
      {recentActivity.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Última atividade" />
          <Card className="divide-y divide-line">
            {recentActivity.map((entry) => {
              const Icon = getIcon(ACTIVITY_ICONS[entry.type] ?? "Workflow");
              return (
                <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
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
                  {entry.xp > 0 && (
                    <Badge tone="success">+{entry.xp} XP</Badge>
                  )}
                </div>
              );
            })}
          </Card>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center dark:border-brand-800 dark:bg-brand-900/30">
        <h2 className="text-lg font-semibold text-brand-800 dark:text-brand-200">
          Pronto para colocar a mão na massa?
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-brand-700/90 dark:text-brand-300/90">
          O laboratório reúne 10 desafios: monte processos do zero, corrija erros de
          notação, identifique símbolos e simule fluxos.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          <Button href="/laboratorio" icon={<ArrowRight size={16} />}>
            Ir para o laboratório
          </Button>
          <Button href="/trilha" variant="secondary">
            Ver a trilha completa
          </Button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-subtle">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function NextStepCard({
  icon,
  eyebrow,
  title,
  description,
  href,
  cta,
  progressValue,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  progressValue?: number;
}) {
  return (
    <Card hover className="flex flex-col p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
        {icon}
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {typeof progressValue === "number" && (
        <ProgressBar value={progressValue} className="mt-3" />
      )}
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
      >
        {cta}
        <ArrowRight size={15} />
      </Link>
    </Card>
  );
}

function ExploreCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card hover className="h-full p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-sunk text-brand-600 dark:text-brand-400">
          {icon}
        </span>
        <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
          Acessar <ArrowRight size={15} />
        </span>
      </Card>
    </Link>
  );
}
