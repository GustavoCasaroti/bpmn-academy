"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ActivityEntry,
  ActivityType,
  QuizAttempt,
  UserProgress,
} from "@/types";
import {
  ACHIEVEMENTS,
  XP_RULES,
  achievementById,
  evaluateAchievements,
} from "@/lib/progress";
import { todayKey } from "@/lib/utils";
import { challenges } from "@/data/challenges";
import { modules } from "@/data/modules";

const STORAGE_KEY = "bpmn-academy:progress:v2";

const DEFAULT_PROGRESS: UserProgress = {
  version: 2,
  xp: 0,
  completedLessons: [],
  completedModules: [],
  challenges: {},
  quizAttempts: [],
  achievements: [],
  visitedSymbols: [],
  activity: [],
  streak: 0,
  lastActiveDay: "",
};

function loadProgress(): UserProgress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProgress;
    if (!parsed || typeof parsed.xp !== "number") return null;
    return { ...DEFAULT_PROGRESS, ...parsed, version: 2 };
  } catch {
    return null;
  }
}

function saveProgress(progress: UserProgress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage indisponível (modo privado): o app segue funcionando em memória.
  }
}

function touchStreak(progress: UserProgress): UserProgress {
  const today = todayKey();
  if (progress.lastActiveDay === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const streak =
    progress.lastActiveDay === yesterdayKey ? progress.streak + 1 : 1;
  return { ...progress, streak, lastActiveDay: today };
}

function pushActivity(
  progress: UserProgress,
  entry: Omit<ActivityEntry, "id" | "at">
): UserProgress {
  const activity: ActivityEntry[] = [
    { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, at: Date.now(), ...entry },
    ...progress.activity,
  ].slice(0, 40);
  return { ...progress, activity };
}

interface MutationResult {
  progress: UserProgress;
  xpGained: number;
  newAchievements: string[];
}

interface StoreValue {
  progress: UserProgress;
  ready: boolean;
  addXp: (amount: number, label: string, type?: ActivityType) => void;
  completeLesson: (moduleId: string, lessonId: string, title: string) => MutationResult;
  completeModule: (moduleId: string, title: string) => MutationResult;
  completeChallenge: (
    challengeId: string,
    title: string,
    score: number,
    attempts: number,
    xp: number
  ) => MutationResult;
  recordQuiz: (attempt: QuizAttempt, title: string) => MutationResult;
  visitSymbol: (symbolId: string, name: string) => void;
  recordPageVisit: (label: string) => void;
  resetProgress: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [ready, setReady] = useState(false);

  // Hidratação: só lê o localStorage após a montagem (evita mismatch de SSR).
  useEffect(() => {
    const stored = loadProgress();
    if (stored) setProgress(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveProgress(progress);
  }, [progress, ready]);

  const finalize = useCallback(
    (mutate: (p: UserProgress) => MutationResult): MutationResult => {
      let result: MutationResult = {
        progress,
        xpGained: 0,
        newAchievements: [],
      };
      setProgress((current) => {
        const base = mutate(current);
        const gainedFromAchievements = base.newAchievements.reduce(
          (sum, id) => sum + (achievementById(id)?.xpReward ?? 0),
          0
        );
        const next = touchStreak({
          ...base.progress,
          xp: base.progress.xp + gainedFromAchievements,
        });
        result = { ...base, progress: next };
        return next;
      });
      return result;
    },
    [progress]
  );

  const completeLesson = useCallback(
    (moduleId: string, lessonId: string, title: string): MutationResult =>
      finalize((current) => {
        const key = `${moduleId}::${lessonId}`;
        if (current.completedLessons.includes(key)) {
          return { progress: current, xpGained: 0, newAchievements: [] };
        }
        const withLesson: UserProgress = {
          ...current,
          completedLessons: [...current.completedLessons, key],
          xp: current.xp + XP_RULES.lesson,
        };
        const withActivity = pushActivity(withLesson, {
          type: "lesson",
          label: title,
          xp: XP_RULES.lesson,
        });
        const unlocked = evaluateAchievements(withActivity, totals());
        return {
          progress: {
            ...withActivity,
            achievements: [...withActivity.achievements, ...unlocked],
          },
          xpGained: XP_RULES.lesson,
          newAchievements: unlocked,
        };
      }),
    [finalize]
  );

  const completeModule = useCallback(
    (moduleId: string, title: string): MutationResult =>
      finalize((current) => {
        if (current.completedModules.includes(moduleId)) {
          return { progress: current, xpGained: 0, newAchievements: [] };
        }
        const updated: UserProgress = {
          ...current,
          completedModules: [...current.completedModules, moduleId],
          xp: current.xp + XP_RULES.module,
        };
        const withActivity = pushActivity(updated, {
          type: "module",
          label: title,
          xp: XP_RULES.module,
        });
        const unlocked = evaluateAchievements(withActivity, totals());
        return {
          progress: {
            ...withActivity,
            achievements: [...withActivity.achievements, ...unlocked],
          },
          xpGained: XP_RULES.module,
          newAchievements: unlocked,
        };
      }),
    [finalize]
  );

  const completeChallenge = useCallback(
    (
      challengeId: string,
      title: string,
      score: number,
      attempts: number,
      xp: number
    ): MutationResult =>
      finalize((current) => {
        const existing = current.challenges[challengeId];
        const bonus = existing ? Math.round(xp * 0.3) : xp;
        const updated: UserProgress = {
          ...current,
          xp: current.xp + bonus,
          challenges: {
            ...current.challenges,
            [challengeId]: {
              challengeId,
              completedAt: Date.now(),
              score: existing ? Math.max(existing.score, score) : score,
              attempts: (existing?.attempts ?? 0) + attempts,
              xp: (existing?.xp ?? 0) + bonus,
            },
          },
        };
        const withActivity = pushActivity(updated, {
          type: "challenge",
          label: title,
          xp: bonus,
        });
        const unlocked = evaluateAchievements(withActivity, totals());
        return {
          progress: {
            ...withActivity,
            achievements: [...withActivity.achievements, ...unlocked],
          },
          xpGained: bonus,
          newAchievements: unlocked,
        };
      }),
    [finalize]
  );

  const recordQuiz = useCallback(
    (attempt: QuizAttempt, title: string): MutationResult =>
      finalize((current) => {
        const updated: UserProgress = {
          ...current,
          xp: current.xp + attempt.xp,
          quizAttempts: [...current.quizAttempts, attempt],
        };
        const withActivity = pushActivity(updated, {
          type: "quiz",
          label: title,
          xp: attempt.xp,
        });
        const unlocked = evaluateAchievements(withActivity, totals());
        return {
          progress: {
            ...withActivity,
            achievements: [...withActivity.achievements, ...unlocked],
          },
          xpGained: attempt.xp,
          newAchievements: unlocked,
        };
      }),
    [finalize]
  );

  const addXp = useCallback(
    (amount: number, label: string, type: ActivityType = "page") => {
      finalize((current) => ({
        progress: pushActivity(
          { ...current, xp: current.xp + amount },
          { type, label, xp: amount }
        ),
        xpGained: amount,
        newAchievements: [],
      }));
    },
    [finalize]
  );

  const visitSymbol = useCallback((symbolId: string, name: string) => {
    setProgress((current) => {
      if (current.visitedSymbols.includes(symbolId)) return current;
      const updated = pushActivity(
        { ...current, visitedSymbols: [...current.visitedSymbols, symbolId] },
        { type: "symbol", label: name, xp: XP_RULES.symbolView }
      );
      const unlocked = evaluateAchievements(updated, totals());
      return {
        ...updated,
        xp: updated.xp + XP_RULES.symbolView,
        achievements: [...updated.achievements, ...unlocked],
      };
    });
  }, []);

  const recordPageVisit = useCallback((label: string) => {
    setProgress((current) =>
      pushActivity(current, { type: "page", label, xp: 0 })
    );
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...DEFAULT_PROGRESS, lastActiveDay: todayKey(), streak: 0 });
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      progress,
      ready,
      addXp,
      completeLesson,
      completeModule,
      completeChallenge,
      recordQuiz,
      visitSymbol,
      recordPageVisit,
      resetProgress,
    }),
    [
      progress,
      ready,
      addXp,
      completeLesson,
      completeModule,
      completeChallenge,
      recordQuiz,
      visitSymbol,
      recordPageVisit,
      resetProgress,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function totals() {
  return {
    symbols: 40,
    challenges: challenges.length,
    lessonsInFundamentos: 0,
    lessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
  };
}

export function useProgressStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useProgressStore precisa estar dentro de ProgressProvider");
  }
  return ctx;
}

export { ACHIEVEMENTS, STORAGE_KEY };
