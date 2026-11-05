"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { DiagramView } from "@/components/bpmn/DiagramView";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { quizQuestions } from "@/data/quiz";
import { bpmnSymbols } from "@/data/symbols";
import {
  QUIZ_CATEGORY_LABELS,
  QUIZ_DIFFICULTY_LABELS,
} from "@/data/config";
import { xpForQuiz } from "@/lib/progress";
import { useProgressStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type {
  QuizAttempt,
  QuizCategory,
  QuizDifficulty,
  QuizQuestion,
} from "@/types";

type Phase = "setup" | "running" | "done";

const CATEGORY_FILTERS: (QuizCategory | "all")[] = [
  "all",
  "fundamentos",
  "eventos",
  "atividades",
  "gateways",
  "conexoes",
  "pools",
  "interpretacao",
  "pratica",
];

const DIFFICULTY_FILTERS: (QuizDifficulty | "all")[] = [
  "all",
  "facil",
  "intermediario",
  "avancado",
];

/** Opções de quantidade — no máximo 35 questões por quiz. */
const COUNT_OPTIONS = [5, 10, 15, 35] as const;
const MAX_QUESTIONS = 35;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function QuizRunner() {
  const { recordQuiz } = useProgressStore();

  const [phase, setPhase] = useState<Phase>("setup");
  const [category, setCategory] = useState<QuizCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<QuizDifficulty | "all">("all");
  const [count, setCount] = useState<number>(10);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  const pool = useMemo(
    () =>
      quizQuestions.filter(
        (q) =>
          (category === "all" || q.category === category) &&
          (difficulty === "all" || q.difficulty === difficulty)
      ),
    [category, difficulty]
  );

  const current = questions[index];
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctOptionId
  ).length;

  /* ---------------- configuração ---------------- */

  const start = () => {
    // Sorteio aleatório a cada início, respeitando o teto de questões.
    const size = Math.min(count, MAX_QUESTIONS, pool.length);
    const selected = shuffle(pool).slice(0, size);
    if (selected.length === 0) return;
    setQuestions(selected);
    setAnswers({});
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setStartedAt(Date.now());
    setAttempt(null);
    setNewAchievements([]);
    setPhase("running");
  };

  /* ---------------- resposta ---------------- */

  const confirm = () => {
    if (!current || !selected || revealed) return;
    setAnswers((prev) => ({ ...prev, [current.id]: selected }));
    setRevealed(true);
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }
    finish();
  };

  const finish = () => {
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctOptionId
    ).length;
    const total = questions.length;
    const score = Math.round((correct / total) * 100);
    const xp = xpForQuiz({ correct, total, score });

    const byCategory: QuizAttempt["byCategory"] = {};
    for (const q of questions) {
      if (!byCategory[q.category]) byCategory[q.category] = { correct: 0, total: 0 };
      byCategory[q.category].total += 1;
      if (answers[q.id] === q.correctOptionId) byCategory[q.category].correct += 1;
    }

    const newAttempt: QuizAttempt = {
      id: `qa-${Date.now().toString(36)}`,
      startedAt,
      finishedAt: Date.now(),
      correct,
      total,
      score,
      xp,
      byCategory,
      questionIds: questions.map((q) => q.id),
    };

    const result = recordQuiz(
      newAttempt,
      `Quiz: ${score}% (${correct}/${total})`
    );
    setAttempt(newAttempt);
    setNewAchievements(result.newAchievements);
    setPhase("done");
  };

  const restart = () => {
    setPhase("setup");
    setAttempt(null);
    setNewAchievements([]);
  };

  /* ---------------- render ---------------- */

  if (phase === "setup") {
    return (
      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Configure seu quiz</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Escolha o escopo e responda questão a questão — a cada início as
          questões são sorteadas aleatoriamente, com no máximo {MAX_QUESTIONS}{" "}
          por quiz. Cada acerto vale XP — 100% em um quiz com 10 ou mais
          questões desbloqueia a conquista &quot;Nota máxima&quot;.
        </p>

        {/* Categoria */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Categoria
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((c) => {
              const label =
                c === "all"
                  ? `Todas (${quizQuestions.length})`
                  : `${QUIZ_CATEGORY_LABELS[c]} (${
                      quizQuestions.filter((q) => q.category === c).length
                    })`;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition",
                    category === c
                      ? "border-brand-400 bg-brand-600 text-white"
                      : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dificuldade */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Dificuldade
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTY_FILTERS.map((d) => {
              const label =
                d === "all"
                  ? "Todas"
                  : QUIZ_DIFFICULTY_LABELS[d];
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition",
                    difficulty === d
                      ? "border-brand-400 bg-brand-600 text-white"
                      : "border-line bg-surface-raised text-ink-muted hover:border-brand-300"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantidade */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Quantidade de questões
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COUNT_OPTIONS.map((n) => {
              const available = Math.min(n, pool.length);
              const disabled = available === 0;
              return (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  disabled={disabled}
                  className={cn(
                    "flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition",
                    count === n
                      ? "border-brand-400 bg-brand-600 text-white"
                      : "border-line bg-surface-raised text-ink-muted hover:border-brand-300",
                    disabled && "cursor-not-allowed opacity-40"
                  )}
                >
                  {n}
                  {n > pool.length && pool.length > 0 && ` (máx. ${pool.length})`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm text-ink-muted">
            {pool.length === 0
              ? "Nenhuma questão corresponde aos filtros escolhidos."
              : `Disponíveis: ${pool.length} ${pool.length === 1 ? "questão" : "questões"} · sorteadas: ${Math.min(count, MAX_QUESTIONS, pool.length)}`}
          </p>
          <Button
            onClick={start}
            disabled={pool.length === 0}
            icon={<ArrowRight size={16} />}
          >
            Iniciar quiz
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "done" && attempt) {
    const perfect = attempt.score === 100 && attempt.total >= 10;
    const tone =
      attempt.score >= 80 ? "success" : attempt.score >= 50 ? "warning" : "danger";
    const toneLabel =
      attempt.score >= 80
        ? "Excelente desempenho"
        : attempt.score >= 50
          ? "Bom, mas dá para melhorar"
          : "Reveja o conteúdo e tente de novo";

    return (
      <div className="space-y-5">
        <Card className="p-6 text-center">
          <span
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              attempt.score >= 80
                ? "bg-emerald-500 text-white"
                : attempt.score >= 50
                  ? "bg-amber-500 text-white"
                  : "bg-rose-500 text-white"
            )}
          >
            <Trophy size={30} />
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Resultado do quiz
          </p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-ink">
            {attempt.score}%
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {attempt.correct} de {attempt.total} corretas — {toneLabel}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge tone={tone as "success" | "warning" | "danger"}>
              {attempt.correct}/{attempt.total} acertos
            </Badge>
            <Badge tone="brand">+{attempt.xp} XP</Badge>
            {perfect && <Badge tone="warning">Nota máxima</Badge>}
          </div>

          <ProgressBar
            value={attempt.score}
            tone={attempt.score >= 80 ? "success" : attempt.score >= 50 ? "warning" : "brand"}
            className="mx-auto mt-5 max-w-md"
          />

          {newAchievements.length > 0 && (
            <div className="mx-auto mt-5 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/30">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                <Trophy size={14} className="mr-1.5 inline align-[-2px]" />
                Conquista desbloqueada
              </p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                {newAchievements.join(", ")}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={start} icon={<RotateCcw size={16} />}>
              Refazer com os mesmos filtros
            </Button>
            <Button variant="secondary" onClick={restart}>
              Novo quiz
            </Button>
            <Button href="/conquistas" variant="ghost">
              Ver conquistas
            </Button>
          </div>
        </Card>

        {/* Desempenho por categoria */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-ink">
            Desempenho por categoria
          </h3>
          <div className="mt-3 space-y-3">
            {Object.entries(attempt.byCategory).map(([cat, data]) => {
              const pct = data.total ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">
                      {QUIZ_CATEGORY_LABELS[cat as QuizCategory] ?? cat}
                    </span>
                    <span className="font-medium text-ink">
                      {data.correct}/{data.total}
                    </span>
                  </div>
                  <ProgressBar
                    value={pct}
                    tone={pct >= 80 ? "success" : pct >= 50 ? "warning" : "brand"}
                    className="mt-1.5 h-1.5"
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Revisão das questões */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-ink">Revisão</h3>
          <div className="mt-3 space-y-3">
            {questions.map((q, i) => {
              const given = answers[q.id];
              const ok = given === q.correctOptionId;
              const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
              const givenOpt = q.options.find((o) => o.id === given);
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-xl border p-4",
                    ok
                      ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-rose-200 bg-rose-50/60 dark:border-rose-800 dark:bg-rose-900/20"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                        ok ? "bg-emerald-500" : "bg-rose-500"
                      )}
                    >
                      {ok ? <Check size={11} /> : <X size={11} />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {i + 1}. {q.statement}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">
                        Sua resposta:{" "}
                        <span className={ok ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
                          {givenOpt?.text ?? "Não respondida"}
                        </span>
                        {!ok && (
                          <>
                            {" · "}Correta:{" "}
                            <span className="font-medium text-emerald-700 dark:text-emerald-300">
                              {correctOpt?.text}
                            </span>
                          </>
                        )}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-subtle">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  /* ---------------- execução ---------------- */

  if (!current) return null;

  const answered = revealed;
  const chosenCorrect = answers[current.id] === current.correctOptionId;
  const symbol = current.symbolId
    ? bpmnSymbols.find((s) => s.id === current.symbolId)
    : undefined;
  const progressPct = ((index + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-4">
      {/* Cabeçalho da execução */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <HelpCircle size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Questão {index + 1} de {questions.length}
              </p>
              <p className="text-sm font-medium text-ink">
                {QUIZ_CATEGORY_LABELS[current.category]} ·{" "}
                {QUIZ_DIFFICULTY_LABELS[current.difficulty]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">{correctCount}</span>{" "}
              {correctCount === 1 ? "acerto" : "acertos"}
            </span>
            <Button size="sm" variant="ghost" onClick={restart}>
              Sair
            </Button>
          </div>
        </div>
        <ProgressBar value={progressPct} className="mt-3" />
      </Card>

      {/* Questão */}
      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-sunk text-xs font-bold text-ink-subtle">
            {index + 1}
          </span>
          <h2 className="text-base font-semibold leading-relaxed text-ink sm:text-lg">
            {current.statement}
          </h2>
        </div>

        {/* Visual: símbolo ou diagrama */}
        {current.type === "symbol" && symbol && (
          <div className="mt-4 flex justify-center">
            <span className="flex h-32 w-40 items-center justify-center rounded-xl border border-line bg-surface-sunk">
              <BpmnSymbolGlyph
                render={symbol.render}
                label={symbol.namePt}
                fit={SYMBOL_BOX.hero}
              />
            </span>
          </div>
        )}
        {current.type === "diagram" && current.diagram && (
          <div className="mt-4">
            <DiagramView
              diagram={current.diagram}
              highlightNodeIds={current.highlightNodeIds}
              height={320}
              fitViewPadding={0.2}
            />
          </div>
        )}

        {/* Opções */}
        <div className="mt-5 space-y-2">
          {current.options.map((opt, i) => {
            const optionLetter = String.fromCharCode(65 + i);
            const isSelected = selected === opt.id;
            const isCorrect = opt.id === current.correctOptionId;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (answered) return;
                  setSelected(opt.id);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  answered
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                      : isSelected
                        ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30"
                        : "border-line bg-surface-raised"
                    : isSelected
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30"
                      : "border-line bg-surface-raised hover:border-brand-300"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    answered && isCorrect
                      ? "bg-emerald-500 text-white"
                      : answered && isSelected
                        ? "bg-rose-500 text-white"
                        : isSelected
                          ? "bg-brand-600 text-white"
                          : "bg-surface-sunk text-ink-subtle"
                  )}
                >
                  {answered && isCorrect ? (
                    <Check size={14} />
                  ) : answered && isSelected ? (
                    <X size={14} />
                  ) : (
                    optionLetter
                  )}
                </span>
                <span className="flex-1 text-ink">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explicação */}
        {answered && (
          <div
            className={cn(
              "mt-4 rounded-xl border p-4",
              chosenCorrect
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30"
                : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/30"
            )}
          >
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold",
                chosenCorrect
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-amber-800 dark:text-amber-200"
              )}
            >
              {chosenCorrect ? (
                <>
                  <CheckCircle2 size={16} /> Resposta correta!
                </>
              ) : (
                <>
                  <XCircle size={16} /> Resposta incorreta.
                </>
              )}
            </p>
            <p
              className={cn(
                "mt-1.5 text-sm leading-relaxed",
                chosenCorrect
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-amber-700 dark:text-amber-300"
              )}
            >
              {current.explanation}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          {!answered ? (
            <Button onClick={confirm} disabled={!selected} icon={<Check size={16} />}>
              Confirmar resposta
            </Button>
          ) : (
            <Button onClick={next} icon={<ArrowRight size={16} />}>
              {index < questions.length - 1 ? "Próxima questão" : "Ver resultado"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

/** Resumo usado no dashboard: melhor tentativa e desempenho geral. */
export function QuizHistoryHint() {
  const { progress } = useProgressStore();
  if (progress.quizAttempts.length === 0) return null;
  const last = progress.quizAttempts[progress.quizAttempts.length - 1];
  return (
    <p className="text-xs text-ink-subtle">
      Última tentativa: {last.score}% em {new Date(last.finishedAt).toLocaleDateString("pt-BR")}
    </p>
  );
}
