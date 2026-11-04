"use client";

import { useMemo } from "react";
import { HelpCircle, Target, Trophy, Zap } from "lucide-react";
import { Card, SectionHeader, Stat } from "@/components/ui";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { quizQuestions } from "@/data/quiz";
import { QUIZ_CATEGORY_LABELS } from "@/data/config";
import { averageScore, bestScore, quizPerformance, XP_RULES } from "@/lib/progress";
import { useProgressStore } from "@/lib/store";

export default function QuizPage() {
  const { progress, ready } = useProgressStore();

  const attempts = progress.quizAttempts;
  const answeredIds = useMemo(
    () => new Set(attempts.flatMap((a) => a.questionIds)),
    [attempts]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, { seen: number; correct: number }>();
    for (const q of quizQuestions) {
      if (!map.has(q.category)) map.set(q.category, { seen: 0, correct: 0 });
    }
    for (const a of attempts) {
      for (const [cat, data] of Object.entries(a.byCategory)) {
        const entry = map.get(cat);
        if (entry) {
          entry.seen += data.total;
          entry.correct += data.correct;
        }
      }
    }
    return map;
  }, [attempts]);

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <SectionHeader
        eyebrow="Avaliação"
        title="Quiz de conhecimentos"
        description={`${quizQuestions.length} questões em 8 categorias, com dificuldade progressiva. Responda, leia a explicação de cada questão e acompanhe seu desempenho ao longo do tempo.`}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Desempenho geral"
          value={ready && attempts.length > 0 ? `${quizPerformance(attempts)}%` : "—"}
          hint={`${attempts.length} tentativa${attempts.length !== 1 ? "s" : ""}`}
          icon={<Target size={16} />}
        />
        <Stat
          label="Melhor resultado"
          value={attempts.length > 0 ? `${bestScore(attempts)}%` : "—"}
          hint="em uma única tentativa"
          icon={<Trophy size={16} />}
        />
        <Stat
          label="Média"
          value={attempts.length > 0 ? `${averageScore(attempts)}%` : "—"}
          hint="de todas as tentativas"
          icon={<HelpCircle size={16} />}
        />
        <Stat
          label="Questões vistas"
          value={`${answeredIds.size}/${quizQuestions.length}`}
          hint={`${XP_RULES.quizPerCorrect} XP por acerto · +${XP_RULES.quizCompletionBonus} ao concluir`}
          icon={<Zap size={16} />}
        />
      </div>

      <div className="mt-6">
        <QuizRunner />
      </div>

      {/* Cobertura por categoria */}
      <Card className="mt-6 p-5">
        <h2 className="text-base font-semibold text-ink">Cobertura por categoria</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Quantas questões de cada categoria você já respondeu.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(QUIZ_CATEGORY_LABELS).map(([cat, label]) => {
            const total = quizQuestions.filter((q) => q.category === cat).length;
            const entry = byCategory.get(cat);
            const seen = entry?.seen ?? 0;
            const pct = total ? Math.round((seen / total) * 100) : 0;
            return (
              <div key={cat} className="rounded-xl border border-line bg-surface-sunk p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{label}</span>
                  <span className="text-ink-subtle">
                    {seen}/{total}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
